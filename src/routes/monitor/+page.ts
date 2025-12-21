import { redirect } from "@sveltejs/kit"
import { app } from "$lib/app.svelte.js"

export async function load() {
  await app.waitUntilLoaded()
  if (app.selectedDevice === undefined) {
    redirect(307, "/connection/")
  }
}
