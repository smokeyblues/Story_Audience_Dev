import adapter from "@sveltejs/adapter-cloudflare"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
    // allow up to 150kb of style to be inlined with the HTML
    // Faster FCP (First Contentful Paint) by reducing the number of requests
    inlineStyleThreshold: 150000,
    csp: {
      directives: {
        "script-src": ["self", "unsafe-eval", "https://*.posthog.com"],
        "style-src": ["self", "unsafe-inline", "https://fonts.googleapis.com"],
        "img-src": [
          "self",
          "data:",
          "https://maps.wikimedia.org",
          "https://*.posthog.com",
        ],
        "font-src": ["self", "https://fonts.gstatic.com"],
        "connect-src": ["self", "https://*.posthog.com"],
      },
    },
  },
  preprocess: vitePreprocess(),
}

export default config
