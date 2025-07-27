// src/routes/(admin)/account/(menu)/teams/[teamId]/worlds/[worldId]/elements/[elementId]/+page.server.ts
import { error, fail } from "@sveltejs/kit"
import type { PageServerLoad, Actions } from "./$types"
// import type { Json } from '../../../../../../../../../DatabaseDefinitions';

export const load: PageServerLoad = async ({
  params,
  locals: { supabase },
}) => {
  const { elementId } = params

  // Fetch the main element's data
  const { data: element, error: elementError } = await supabase
    .from("elements")
    .select("*")
    .eq("id", elementId)
    .single()

  if (elementError || !element) {
    console.error("Error fetching element:", elementError)
    throw error(404, "Element not found")
  }

  // Fetch all relationships connected to this element for display
  const { data: relationships, error: relationshipsError } = await supabase
    .from("relationships")
    .select(
      `
            id,
            type,
            source:source_element_id ( id, name ),
            target:target_element_id ( id, name )
        `,
    )
    .or(`source_element_id.eq.${elementId},target_element_id.eq.${elementId}`)

  if (relationshipsError) {
    console.error("Error fetching relationships:", relationshipsError)
    throw error(500, "Could not load relationships.")
  }

  // --- MODIFIED: Fetch 'id', 'name', AND 'type' for all world elements ---
  const { data: worldElements, error: worldElementsError } = await supabase
    .from("elements")
    .select("id, name, type") // Added 'type'
    .eq("world_id", element.world_id)

  if (worldElementsError) {
    console.error("Error fetching world elements:", worldElementsError)
    throw error(500, "Could not load world elements.")
  }

  return {
    element,
    relationships: relationships ?? [],
    worldElements: worldElements ?? [],
  }
}

export const actions: Actions = {
  updateElement: async ({ request, locals: { supabase }, params }) => {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const elementId = params.elementId

    const properties: { [key: string]: string } = {}
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("prop_")) {
        const propName = key.substring(5)
        if (typeof value === "string") {
          properties[propName] = value
        }
      }
    }

    if (!name) {
      return fail(400, { error: "Name is required." })
    }

    const { error } = await supabase
      .from("elements")
      .update({
        name,
        properties,
      })
      .eq("id", elementId)

    if (error) {
      console.error("Error updating element:", error)
      return fail(500, { error: "Server error. Please try again." })
    }

    return { success: true, message: "Element updated successfully!" }
  },

  createRelationship: async ({ request, locals: { supabase }, params }) => {
    const formData = await request.formData()
    const targetElementId = formData.get("targetElementId") as string
    const relationshipType = formData.get("relationshipType") as string
    const description = formData.get("relationshipDescription") as string
    const sourceElementId = params.elementId

    if (!targetElementId || !relationshipType) {
      return fail(400, {
        createRelationshipError: "Target element and type are required.",
      })
    }

    if (sourceElementId === targetElementId) {
      return fail(400, {
        createRelationshipError:
          "An element cannot have a relationship with itself.",
      })
    }

    const { error } = await supabase.from("relationships").insert({
      source_element_id: sourceElementId,
      target_element_id: targetElementId,
      type: relationshipType,
      properties: description ? { description } : undefined,
    })

    if (error) {
      console.error("Error creating relationship:", error)
      return fail(500, {
        createRelationshipError: "Server error. Could not create relationship.",
      })
    }

    return { success: true, message: "Relationship created!" }
  },
}
