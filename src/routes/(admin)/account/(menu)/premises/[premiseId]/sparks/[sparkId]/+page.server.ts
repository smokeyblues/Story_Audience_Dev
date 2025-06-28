// src/routes/(admin)/account/(menu)/premises/[premiseId]/sparks/[sparkId]/+page.server.ts

import { fail, redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({
  locals: { supabase, user },
  params,
}) => {
  if (!user) {
    redirect(303, "/login")
  }

  // --- FIX 1: Parse the ID and validate it ---
  const numericSparkId = parseInt(params.sparkId, 10)
  if (isNaN(numericSparkId)) {
    return fail(400, { error: "Invalid Spark ID format." })
  }

  const { data: spark, error } = await supabase
    .from("story_sparks")
    .select("*")
    .eq("id", numericSparkId) // Use the numeric ID
    .eq("user_id", user.id)
    .single()

  if (error) {
    // This could happen if the row doesn't exist, which .single() treats as an error
    if (error.code === "PGRST116") {
      return fail(404, {
        error: "Story spark not found or you don't have access.",
      })
    }
    console.error("Error loading story spark:", error)
    return fail(500, {
      error: "Failed to load story spark. Please try again later.",
    })
  }

  // Note: .single() guarantees `spark` is not null if no error, so no `!spark` check is needed.

  return { spark }
}

export const actions: Actions = {
  updateSpark: async ({ request, locals: { supabase, user }, params }) => {
    if (!user) {
      return fail(401, { error: "Unauthorized" })
    }

    // --- FIX 2: Parse the ID in the action as well ---
    const numericSparkId = parseInt(params.sparkId, 10)
    if (isNaN(numericSparkId)) {
      return fail(400, { error: "Invalid Spark ID provided." })
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

    const { data: updatedSpark, error } = await supabase
      .from("story_sparks")
      .update({
        // Ensure title is not an empty string inside the array
        title: title ? [title] : [],
        logline,
        comparisons,
        hero_name,
        hero_description,
        hero_save_the_cat_moment,
        story_engine,
        thematic_premise,
        story_roadmap,
      })
      .eq("id", numericSparkId) // Use the numeric ID
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating story spark:", error)
      return fail(500, { error: "Failed to update story spark." })
    }

    return { success: true, spark: updatedSpark }
  },
}
