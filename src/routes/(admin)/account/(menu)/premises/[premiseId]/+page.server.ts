import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
  if (!user) {
    redirect(303, "/login") // Or your specific login path
  }

  // Verify project access using the RLS helper function implicitly via queries
  // Fetching the core treatment data - RLS ensures user has access

  const wishListPromise = supabase
    .from("wish_list_items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  const premisesPromise = supabase
    .from("premises")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  // Run all data fetching in parallel
  const [
    { data: wishListItems, error: wishListItemsError },
    { data: premises, error: premisesError },
  ] = await Promise.all([wishListPromise, premisesPromise])

  // Check for critical errors (e.g., if RLS denied access unexpectedly)
  // Individual sections might fail gracefully, but log errors.
  if (wishListItemsError) {
    console.error("Error loading wish list items:", wishListItemsError.message)
  }
  if (premisesError) {
    console.error("Error loading premises:", premisesError.message)
  }

  return {
    wishListItems: wishListItems ?? [],
    premises: premises ?? [],
  }
}
