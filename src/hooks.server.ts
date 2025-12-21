import { app } from "$lib/app.svelte"

export async function init(): Promise<void> {
  await app.start()
}
