import adapter from "@sveltejs/adapter-static"
// import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltePreprocess } from "svelte-preprocess"

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: sveltePreprocess({
    scss: {
      includePaths: ["src/style"],
    },
  }),

  kit: {
    alias: {
      $style: "src/style",
      $lib: "src/lib",
    },

    adapter: adapter({
      // default options are shown. On some platforms
      // these options are set automatically — see below
      pages: "build",
      assets: "build",
      fallback: undefined,
      precompress: false,
      strict: true,
    }),
  },
}

export default config
