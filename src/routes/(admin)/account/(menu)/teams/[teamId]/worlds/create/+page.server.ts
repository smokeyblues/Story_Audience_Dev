import { fail, redirect } from "@sveltejs/kit"
import type { PageServerLoad, Actions } from "./$types"
// import type { Json } from "../../../../../../../../DatabaseDefinitions"

export const load: PageServerLoad = async ({
  locals: { safeGetSession },
  params,
}) => {
  const session = await safeGetSession()
  if (!session) {
    throw redirect(303, "/login")
  }

  // Pass teamId to the frontend so it knows where to submit
  return {
    teamId: params.teamId,
  }
}

export const actions: Actions = {
  createWorldFromAgent: async ({
    request,
    params,
    locals: { supabase, safeGetSession },
  }) => {
    const session = await safeGetSession()
    if (!session) {
      return fail(401, { error: "Unauthorized" })
    }

    const { teamId } = params
    const formData = await request.formData()

    // 1. GET THE AI DATA 📦
    // We look for the hidden input field we populated in the frontend
    const worldDataRaw = formData.get("worldDataJSON")?.toString()

    if (!worldDataRaw) {
      return fail(400, { error: "No world data received from the Architect." })
    }

    let worldData
    try {
      worldData = JSON.parse(worldDataRaw)
    } catch (e) {
      return fail(400, { error: "Invalid JSON data." })
    }

    const { world, elements, relationships } = worldData

    // 2. INSERT WORLD 🌍
    // We create the container first so we have an ID
    const { data: newWorld, error: worldError } = await supabase
      .from("worlds")
      .insert({
        team_id: teamId,
        name: world.title,
        description: world.description,
        map_type: "custom_image", // Default for now
      })
      .select()
      .single()

    if (worldError || !newWorld) {
      console.error("World creation failed:", worldError)
      return fail(500, { error: "Failed to save the world." })
    }

    const worldId = newWorld.id

    // 3. INSERT ELEMENTS & BUILD ID MAP 📍
    // We prepare the rows for bulk insertion
    const elementRows = elements.map(
      (el: { name: string; type: string; properties: unknown }) => ({
        world_id: worldId,
        name: el.name,
        type: el.type,
        properties: el.properties, // The Architect cleaned this up for us already!
      }),
    )

    const { data: insertedElements, error: elementsError } = await supabase
      .from("elements")
      .insert(elementRows)
      .select("id, name") // We only need ID and Name to build our map

    if (elementsError || !insertedElements) {
      console.error("Element creation failed:", elementsError)
      // Optional: Delete the world if elements fail to avoid partial data?
      // For now, we'll just error out.
      return fail(500, { error: "Failed to save elements." })
    }

    // 4. MAP NAMES TO IDS 🗺️
    // The AI gave us relationships like "Kaelen" -> "Soraya".
    // We need to translate that to "UUID-A" -> "UUID-B".
    const nameToIdMap = new Map<string, string>()
    insertedElements.forEach((el) => {
      nameToIdMap.set(el.name, el.id)
    })

    // 5. INSERT RELATIONSHIPS 🕸️
    const relationshipRows = relationships
      .map(
        (rel: {
          sourceName: string
          targetName: string
          type: string
          properties: unknown
        }) => {
          const sourceId = nameToIdMap.get(rel.sourceName)
          const targetId = nameToIdMap.get(rel.targetName)

          // Safeguard: Only create relationship if both ends exist in our DB
          if (sourceId && targetId) {
            return {
              source_element_id: sourceId,
              target_element_id: targetId,
              type: rel.type,
              properties: rel.properties || {},
            }
          }
          return null
        },
      )
      .filter((r: unknown) => r !== null) // Remove any failed lookups

    if (relationshipRows.length > 0) {
      const { error: relError } = await supabase
        .from("relationships")
        .insert(relationshipRows)

      if (relError) {
        console.error("Relationship creation failed:", relError)
        // We don't fail the whole request here, as the world and elements are safe.
      }
    }

    // 6. SUCCESS! 🎉
    throw redirect(303, `/account/teams/${teamId}/worlds/${worldId}`)
  },
}
