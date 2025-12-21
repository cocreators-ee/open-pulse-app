<script lang="ts">
  import { app } from '$lib/app.svelte.js';

  import Loader from '$lib/assets/lucide/loader-circle.svg?component';
  import DeviceStatus from '$lib/DeviceStatus.svelte';
  import Device from '$lib/Device.svelte';
</script>

<section>
  {#if !app.selectedDevice}
    <h1>Connect to a device</h1>
    <p>Make sure your Bluetooth LE -enabled heart rate monitor is on, and near this device.</p>

    <button
      class="scan"
      onclick={() => app.startScan()}
      disabled={app.scanning}>
      {#if app.scanning}
        Scanning
        <Loader />
      {:else}
        Start scanning
      {/if}
    </button>

    {#if app.foundDevices.length}
      <p>Tap to select a compatible device</p>
      {#each app.foundDevices as result}
        <Device enabled={true} item={result} />
      {/each}
    {/if}
  {/if}

  {#if app.selectedDevice}
    <h1>Selected device</h1>

    <div class="selected-device">
      <Device enabled={false} item={app.selectedDevice} />
    </div>

    <p class="status">
      {#if app.connecting}
        Attempting to connect...
      {:else if app.connected}
        Connected.
      {/if}
    </p>

    <DeviceStatus />

    <button
      class="disconnect"
      onclick={() => app.disconnect()}>
      Disconnect
    </button>
  {/if}
</section>

<style lang="scss">
  @use "variables" as *;

  section {
    display: flex;
    flex-direction: column;
  }

  button {
    align-self: center;
  }

  button.scan {
    display: flex;
    flex-direction: row;
    align-items: center;

    margin: $spacing-4 0;
    display: flex;

    gap: $spacing-2;

    height: 3rem;
  }

  :global(button.scan svg) {
    height: 24px;
    width: 24px;
    animation: spin 1s infinite;
  }

  .selected-device {
    margin: $spacing-4 0;
  }

  .status {
    margin-top: $spacing-2;
  }
</style>
