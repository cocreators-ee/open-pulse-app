import { Browser } from "@capacitor/browser"

export function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

export async function buyMeACoffee() {
  await Browser.open({ url: "https://buymeacoffee.com/cocreators" })
}

export async function openLink(evt) {
  evt.preventDefault()
  const url = evt.target.href
  await Browser.open({ url })
}
