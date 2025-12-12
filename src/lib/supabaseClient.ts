import { createBrowserClient } from "@supabase/ssr"
import { env } from "$env/dynamic/public"
import { building } from "$app/environment"

export const supabase = createBrowserClient(
  env.PUBLIC_SUPABASE_URL || (building ? "https://example.com" : ""),
  env.PUBLIC_SUPABASE_ANON_KEY || (building ? "placeholder-key" : ""),
)
