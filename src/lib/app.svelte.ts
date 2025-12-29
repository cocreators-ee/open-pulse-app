import { AdMob, AdmobConsentStatus } from "@capacitor-community/admob"
import { BleClient, numberToUUID, type ScanResult } from "@capacitor-community/bluetooth-le"
import { Preferences } from "@capacitor/preferences"
import { goto } from "$app/navigation"
import { errorToString, sleep } from "$lib/utils"

type HRLog = {
  date: Date
  value: number
}

export const HISTORY_MAX_LENGTH = 3 * 60
const SCAN_DURATION = 15_000
const MS_BETWEEN_POLLS = 30_000
const HEART_RATE_SERVICE = numberToUUID(0x180d)
const HEART_RATE_MEASUREMENT_CHARACTERISTIC = "00002a37-0000-1000-8000-00805f9b34fb"
// const BODY_SENSOR_LOCATION_CHARACTERISTIC = "00002a38-0000-1000-8000-00805f9b34fb"
const BATTERY_SERVICE = numberToUUID(0x180f)
const BATTERY_CHARACTERISTIC = numberToUUID(0x2a19)

type State = {
  selectedDevice?: ScanResult
  showAdConsent: boolean
  showAds: boolean
  hrMax: number
}

const DEFAULT_STATE: State = {
  selectedDevice: undefined,
  showAdConsent: true,
  showAds: false,
  hrMax: 180,
}

// https://github.com/capacitor-community/bluetooth-le/blob/fcf3a84c1fc3e3bfe15f613f0ab4ba21b71d88b7/README.md
function parseHeartRate(value: DataView): number {
  const flags = value.getUint8(0)
  const rate16Bits = flags & 0x1
  let heartRate: number
  if (rate16Bits > 0) {
    heartRate = value.getUint16(1, true)
  } else {
    heartRate = value.getUint8(1)
  }
  return heartRate
}

// Sort by signal strength
function sortDevices(a: ScanResult, b: ScanResult) {
  return (a.rssi ?? 0) - (b.rssi ?? 0)
}

class App {
  loaded: boolean = false

  showPrivacy: boolean = $state(false)
  showAdConsent: boolean = $state(false)
  showAds: boolean = $state(false)
  adInitComplete: boolean = $state(false)

  hrMax: number = $state(180)

  selectedDevice?: ScanResult = $state(undefined)

  connected = $state(false)
  connecting: boolean = $state(false)

  scanning = $state(false)
  foundDevices: ScanResult[] = $state([])

  bluetoothInitialized = $state(false)
  bluetoothError?: Error = $state(undefined)

  currentHeartRate?: number = $state(undefined)
  currentBatteryLevel?: number = $state(undefined)
  // currentBodyLocation?: number = $state(undefined)
  heartRateHistory: HRLog[] = $state([])

  pollInterval?: NodeJS.Timeout = undefined
  retryTimeout?: NodeJS.Timeout = undefined

  async start() {
    // console.log("Starting app")
    await this.load()

    if (this.selectedDevice) {
      // Start connecting, but don't wait for it
      this.connect(this.selectedDevice).then(() => {})
    }

    if (this.showAds) {
      this.initAds().then(() => {})
    }
  }

  async enableAds() {
    this.showAds = true
    await this.save()
    await this.initAds()
  }

  async disableAds() {
    this.showAds = false
    await this.save()
  }

  async save() {
    const state = {
      selectedDevice: this.selectedDevice,
      showAdConsent: this.showAdConsent,
      showAds: this.showAds,
      hrMax: this.hrMax,
    }

    await Preferences.set({
      key: "state",
      value: JSON.stringify(state),
    })

    // console.log("Saved state", state)
  }

  async waitUntilLoaded() {
    while (!this.loaded) {
      await sleep(25)
    }
  }

  async load() {
    // Guard for build-time
    if (typeof window !== "undefined") {
      const ret = await Preferences.get({ key: "state" })
      if (ret.value !== null) {
        const state = JSON.parse(ret.value)
        await this.setState(state as State)

        // console.log("Loaded state", state)
      } else {
        // console.log("No saved state found")
        await this.setState(DEFAULT_STATE)
      }
    }

    this.loaded = true
  }

  async reset() {
    // console.log("Reset")
    await Preferences.clear()
    await goto("/")
    window.location.reload()
  }

  async resetHeartRateHistory() {
    const noHistory = []
    const start = Date.now() - HISTORY_MAX_LENGTH * 1_000
    for (let i = 0; i < HISTORY_MAX_LENGTH; i++) {
      noHistory.push({
        date: new Date(start + i * 1_000),
        value: null,
      })
    }
    this.heartRateHistory = noHistory
  }

  async setState(state: State) {
    for (let key in state) {
      // @ts-ignore
      this[key] = state[key]
    }
  }

  async initAds() {
    if (this.adInitComplete) {
      return
    }

    await AdMob.initialize()

    const [trackingInfo, consentInfo] = await Promise.all([
      AdMob.trackingAuthorizationStatus(),
      AdMob.requestConsentInfo(),
    ])

    if (trackingInfo.status === "notDetermined") {
      /**
       * If you want to explain TrackingAuthorization before showing the iOS dialog,
       * you can show the modal here.
       * ex)
       * const modal = await this.modalCtrl.create({
       *   component: RequestTrackingPage,
       * });
       * await modal.present();
       * await modal.onDidDismiss();  // Wait for close modal
       **/

      await AdMob.requestTrackingAuthorization()
    }

    const authorizationStatus = await AdMob.trackingAuthorizationStatus()
    if (
      authorizationStatus.status === "authorized" &&
      consentInfo.isConsentFormAvailable &&
      consentInfo.status === AdmobConsentStatus.REQUIRED
    ) {
      await AdMob.showConsentForm()
    }

    this.adInitComplete = true
  }

  async initBluetooth() {
    // Initialize BleClient if necessary
    if (!this.bluetoothInitialized) {
      await BleClient.initialize({ androidNeverForLocation: true })
      this.bluetoothInitialized = true
    }
  }

  async startScan() {
    // console.log("startScan")
    try {
      await this.initBluetooth()

      this.foundDevices = []
      this.scanning = true

      // Start scanning, pass results to onScanResult
      await BleClient.requestLEScan(
        {
          services: [HEART_RATE_SERVICE],
          optionalServices: [BATTERY_SERVICE],
        },
        async (result) => await this.onScanResult(result)
      )

      setTimeout(async () => await this.stopScan(), SCAN_DURATION)
    } catch (e) {
      this.bluetoothError = e as Error
    }
  }

  async stopScan() {
    // console.log("stopScan")
    this.scanning = false
    await BleClient.stopLEScan()
  }

  async connect(result: ScanResult) {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout)
      this.retryTimeout = undefined
    }

    this.connecting = true

    // console.log("connect", result)
    await this.initBluetooth()
    await this.stopScan()

    this.selectedDevice = result
    await this.save()

    try {
      await BleClient.connect(
        this.selectedDevice.device.deviceId,
        async (_deviceId) => await this.onDisconnect()
      )
      this.connected = true
      this.connecting = false
    } catch (e) {
      console.warn("Connection failed:", errorToString(e as Error))
      // Retry
      this.retryTimeout = setTimeout(() => this.connect(result), 2_500)
      return
    }

    if (this.heartRateHistory.length === 0) {
      await this.resetHeartRateHistory()
    }

    await BleClient.startNotifications(
      this.selectedDevice.device.deviceId,
      HEART_RATE_SERVICE,
      HEART_RATE_MEASUREMENT_CHARACTERISTIC,
      async (value) => await this.onHeartRateUpdate(value)
    )

    this.pollInterval = setInterval(async () => await this.poll(), MS_BETWEEN_POLLS)
    await this.poll()
  }

  async disconnect() {
    this.selectedDevice = undefined
    this.connecting = false
    await this.onDisconnect(false)
  }

  async onDisconnect(reconnect: boolean = true) {
    // console.log("onDisconnect")
    this.connected = false
    this.currentHeartRate = undefined

    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout)
      this.retryTimeout = undefined
    }

    await this.stopPolling()

    if (!this.selectedDevice) {
      return
    }

    try {
      await BleClient.stopNotifications(
        this.selectedDevice!.device.deviceId,
        HEART_RATE_SERVICE,
        HEART_RATE_MEASUREMENT_CHARACTERISTIC
      )
    } catch (e) {
      console.error("Error stopping notifications:", errorToString(e as Error))
    }

    try {
      await BleClient.disconnect(this.selectedDevice!.device.deviceId)
    } catch (e) {
      console.error("Error disconnecting:", errorToString(e as Error))
    }

    // If we still have a selected device, try reconnecting
    if (reconnect) {
      await this.connect(this.selectedDevice)
    }
  }

  async poll() {
    // console.log("poll")
    if (!this.selectedDevice) {
      await this.stopPolling()
      return
    }

    // TODO: Not sure what this does, maybe it's useful later?
    // const result = await BleClient.read(
    //   this.selectedDevice!.device.deviceId,
    //   HEART_RATE_SERVICE,
    //   BODY_SENSOR_LOCATION_CHARACTERISTIC
    // )
    // this.currentBodyLocation = result.getUint8(0)
    // console.log("body sensor location", this.currentBodyLocation)

    try {
      const battery = await BleClient.read(
        this.selectedDevice!.device.deviceId,
        BATTERY_SERVICE,
        BATTERY_CHARACTERISTIC
      )
      this.currentBatteryLevel = battery.getUint8(0)
      // console.log("battery level", this.currentBatteryLevel)
    } catch (e: Error) {
      const msg: string = e.toString()
      if (msg.includes("Not connected to device")) {
        await this.onDisconnect(true)
      } else {
        console.error("Error polling device state:", e)
      }
    }
  }

  async stopPolling() {
    // console.log("stopPolling")
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = undefined
    }
  }

  /*
   * Event handlers
   */

  // Found a new device during BLE scan
  async onScanResult(result: ScanResult) {
    // console.log("onScanResult", result)
    this.foundDevices.push(result)
    this.foundDevices.sort(sortDevices)
  }

  // New heart rate value received from connected device
  async onHeartRateUpdate(value: DataView) {
    const now = new Date()
    const newValue = parseHeartRate(value)
    this.currentHeartRate = newValue
    // console.log("current heart rate", this.currentHeartRate)

    this.heartRateHistory = this.heartRateHistory
      .concat([
        {
          date: now,
          value: newValue > 0 ? newValue : null,
        },
      ])
      .slice(-HISTORY_MAX_LENGTH)
  }
}

export const app = new App()
