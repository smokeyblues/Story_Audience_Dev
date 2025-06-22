import { fail, redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({
  locals: { supabase, user },
  params,
}) => {
  if (!user) {
    redirect(303, "/login")
  }

  const { sparkId } = params

  if (!sparkId) {
    // This case should ideally not be hit if the route is set up correctly
    return fail(400, { error: "Spark ID is required." })
  }

  const { data: spark, error } = await supabase
    .from("story_sparks")
    .select("*")
    .eq("id", sparkId)
    .eq("user_id", user.id)
    .single()

  if (error) {
    console.error("Error loading story spark:", error)
    return fail(500, {
      error: "Failed to load story spark. Please try again later.",
    })
  }

  if (!spark) {
    return fail(404, { error: "Story spark not found." })
  }

  return { spark }
}

export const actions: Actions = {
  updateSpark: async ({ request, locals: { supabase, user }, params }) => {
    if (!user) {
      return fail(401, { error: "Unauthorized" })
    }

    const { sparkId } = params
    if (!sparkId) {
      return fail(400, { error: "Spark ID is required." })
    }

    const formData = await request.formData()

    const title = formData.get("title") as string
    const logline = formData.get("logline") as string
    const comparisons = formData.get("comparisons") as string
    const hero_name = formData.get("hero_name") as string
    const hero_description = formData.get("hero_description") as string
    const hero_save_the_cat_moment = formData.get(
      "hero_save_the_cat_moment",
    ) as string
    const story_engine = formData.get("story_engine") as string
    const thematic_premise = formData.get("thematic_premise") as string
    const story_roadmap = formData.getAll("story_roadmap") as string[]

    const { error } = await supabase
      .from("story_sparks")
      .update({
        title: [title],
        logline,
        comparisons,
        hero_name,
        hero_description,
        hero_save_the_cat_moment,
        story_engine,
        thematic_premise,
        story_roadmap,
      })
      .eq("id", sparkId)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error updating story spark:", error)
      return fail(500, { error: "Failed to update story spark." })
    }

    return { success: true }
  },
}
