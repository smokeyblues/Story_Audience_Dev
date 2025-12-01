import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
  if (!user) {
    redirect(303, "/login")
  }

  const { data: storySparks, error } = await supabase
    .from("story_sparks")
    .select("*, premises(premise)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error loading story sparks:", error.message)
  }

  return {
    storySparks: storySparks ?? [],
  }
}
