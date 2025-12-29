import { redirect } from "@sveltejs/kit"
import { browser } from "$app/environment"
import { app } from "$lib/app.svelte.js"

export async function load() {
  if (browser) {
    await app.waitUntilLoaded()
    if (app.selectedDevice === undefined) {
      redirect(307, "/connection/")
    }
  }
}
