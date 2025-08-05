import { fail, redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"
import type { Json, Tables } from "../../../../../../../../DatabaseDefinitions"

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

  const elementIds = elements?.map((e) => e.id) || []
  let relationships: Tables<"relationships">[] = []

  if (elementIds.length > 0) {
    const { data: rels, error: relsError } = await supabase
      .from("relationships")
      .select("*")
      .in("source_element_id", elementIds)

    if (relsError) {
      console.error("Error fetching relationships:", relsError)
    } else if (rels) {
      relationships = rels
    }
  }

  // Create a map of element IDs to names for easy lookup
  const elementMap = new Map(elements?.map((e) => [e.id, e.name]))

  // Augment relationships with source and target element names
  const populatedRelationships = relationships.map((rel) => ({
    ...rel,
    source_element_name:
      elementMap.get(rel.source_element_id) ?? "Unknown Element",
    target_element_name:
      elementMap.get(rel.target_element_id) ?? "Unknown Element",
  }))

  return {
    world,
    elements: elements ?? [],
    relationships: populatedRelationships,
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

  uploadMap: async ({ request, locals: { supabase }, params }) => {
    const formData = await request.formData()
    const mapImage = formData.get("mapImage") as File

    if (!mapImage || mapImage.size === 0) {
      return fail(400, { error: "Please select an image to upload." })
    }

    // 1. Upload the file to Supabase Storage
    const filePath = `${params.teamId}/${params.worldId}/${mapImage.name}`
    const { error: uploadError } = await supabase.storage
      .from("map-images")
      .upload(filePath, mapImage, {
        upsert: true, // Overwrite file if it already exists
      })

    if (uploadError) {
      return fail(500, {
        error: "Failed to upload map image.",
        details: uploadError.message,
      })
    }

    // 2. Get the public URL of the uploaded file
    const { data: urlData } = supabase.storage
      .from("map-images")
      .getPublicUrl(filePath)

    if (!urlData || !urlData.publicUrl) {
      return fail(500, { error: "Could not retrieve public URL for the map." })
    }

    // 3. Update the worlds table with the new URL
    const { error: dbError } = await supabase
      .from("worlds")
      .update({ map_image_url: urlData.publicUrl as string }) // Use a valid column, e.g., 'description'
      .eq("id", params.worldId)

    if (dbError) {
      return fail(500, {
        error: "Failed to update world with map URL.",
        details: dbError.message,
      })
    }

    return { success: true, mapUrl: urlData.publicUrl }
  },

  // NEW, UPDATED VERSION
  createElement: async ({ request, locals: { supabase }, params }) => {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const type = formData.get("type") as string
    const worldId = params.worldId

    // --- New logic to handle dynamic properties ---
    const properties: { [key: string]: Json } = {}
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("prop_")) {
        const propName = key.substring(5) // Remove the 'prop_' prefix
        if (typeof value === "string") {
          properties[propName] = value
        }
      }
    }
    // --- End of new logic ---

    if (!name || !type) {
      return fail(400, { error: "Name and type are required." })
    }

    const { error } = await supabase.from("elements").insert({
      name,
      type,
      world_id: worldId,
      properties, // Add the new properties object here
    })

    if (error) {
      return fail(500, { error: "Server error. Please try again." })
    }

    return { success: true }
  },
}
