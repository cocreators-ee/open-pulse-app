import type { ClientInit } from "@sveltejs/kit"
import { app } from "$lib/app.svelte"

/** @type {ClientInit} */
export async function init(): Promise<void> {
  await app.start()
}
