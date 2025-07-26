import { fail, redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({
  locals: { supabase, user },
  params,
}) => {
  if (!user) {
    redirect(303, "/login")
  }

  // Fetch the specific world and verify user has access via RLS policies implicitly
  const { data: world, error: worldError } = await supabase
    .from("worlds")
    .select("*")
    .eq("id", params.worldId)
    .eq("team_id", params.teamId) // Ensure world belongs to the team in the URL
    .single()

  if (worldError || !world) {
    return fail(404, { error: "World not found or you do not have access." })
  }

  // Fetch elements for this world
  const { data: elements, error: elementsError } = await supabase
    .from("elements")
    .select("*")
    .eq("world_id", params.worldId)
    .order("created_at", { ascending: true })

  if (elementsError) {
    console.error("Error loading elements:", elementsError.message)
    return fail(500, { error: "Failed to load world elements." })
  }

  return {
    world,
    elements: elements ?? [],
  }
}

export const actions: Actions = {
  updateWorld: async ({ request, locals: { supabase, user }, params }) => {
    if (!user) {
      return fail(401, { action: "updateWorld", error: "Unauthorized" })
    }

    const formData = await request.formData()
    const name = formData.get("name")?.toString()?.trim()
    const description = formData.get("description")?.toString()?.trim()

    if (!name) {
      return fail(400, {
        action: "updateWorld",
        name,
        description,
        error: "World name cannot be empty.",
      })
    }

    // RLS will handle the permission check, but we can add an explicit check for better UX
    const { error } = await supabase
      .from("worlds")
      .update({ name, description, updated_at: new Date().toISOString() })
      .eq("id", params.worldId)
      .eq("team_id", params.teamId)

    if (error) {
      console.error("Error updating world:", error)
      return fail(500, {
        action: "updateWorld",
        error: "Failed to update the world.",
      })
    }

    return {
      action: "updateWorld",
      success: true,
      message: "World updated successfully.",
    }
  },

  deleteWorld: async ({ locals: { supabase, user }, params }) => {
    if (!user) {
      return fail(401, { action: "deleteWorld", error: "Unauthorized" })
    }

    // RLS will handle the permission check (only owner can delete)
    const { error } = await supabase
      .from("worlds")
      .delete()
      .eq("id", params.worldId)
      .eq("team_id", params.teamId)

    if (error) {
      console.error("Error deleting world:", error)
      return fail(500, {
        action: "deleteWorld",
        error: "Failed to delete the world.",
      })
    }

    // On successful deletion, redirect to the list of worlds
    redirect(303, `/account/teams/${params.teamId}/worlds`)
  },

  addElement: async ({ request, locals: { supabase, user }, params }) => {
    if (!user) {
      return fail(401, { action: "addElement", error: "Unauthorized" })
    }

    const formData = await request.formData()
    const name = formData.get("name")?.toString()?.trim()
    const type = formData.get("type")?.toString()?.trim()

    if (!name || !type) {
      return fail(400, {
        action: "addElement",
        name,
        type,
        error: "Element name and type cannot be empty.",
      })
    }

    const { error: insertError } = await supabase.from("elements").insert({
      name,
      type,
      world_id: params.worldId,
    })

    if (insertError) {
      console.error("Error adding element:", insertError)
      return fail(500, {
        action: "addElement",
        name,
        type,
        error: "Database error while adding element.",
      })
    }

    return {
      action: "addElement",
      success: true,
      message: "Element added successfully.",
    }
  },
}
