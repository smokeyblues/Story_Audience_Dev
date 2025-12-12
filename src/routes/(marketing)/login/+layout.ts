import { env } from "$env/dynamic/public"
import { building } from "$app/environment"
import {
  createBrowserClient,
  createServerClient,
  isBrowser,
} from "@supabase/ssr"
import { redirect } from "@sveltejs/kit"
import { load_helper } from "$lib/load_helpers.js"

export const load = async ({ fetch, data, depends }) => {
  depends("supabase:auth")

  const supabase = isBrowser()
    ? createBrowserClient(
        env.PUBLIC_SUPABASE_URL || (building ? "https://example.com" : ""),
        env.PUBLIC_SUPABASE_ANON_KEY || (building ? "placeholder-key" : ""),
        {
          global: {
            fetch,
          },
        },
      )
    : createServerClient(
        env.PUBLIC_SUPABASE_URL || (building ? "https://example.com" : ""),
        env.PUBLIC_SUPABASE_ANON_KEY || (building ? "placeholder-key" : ""),
        {
          global: {
            fetch,
          },
          cookies: {
            getAll() {
              return data.cookies
            },
          },
        },
      )

  // Redirect if already logged in
  const { session, user } = await load_helper(data.session, supabase)
  if (session && user) {
    redirect(303, "/account")
  }

  const url = data.url

  return { supabase, url }
}
