// src/routes/(admin)/account/(menu)/teams/[teamId]/worlds/[worldId]/elements/[elementId]/+page.server.ts
import { error, fail } from "@sveltejs/kit"
import type { PageServerLoad, Actions } from "./$types"
// import type { Json } from "../../../../../../../../../../DatabaseDefinitions"

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

  // Now, fetch all relationships connected to this element.
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

  return {
    element,
    relationships: relationships ?? [],
  }
}

export const actions: Actions = {
  updateElement: async ({ request, locals: { supabase }, params }) => {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const elementId = params.elementId

    // --- TYPE ERROR FIX ---
    // The `properties` object must conform to the `Json` type.
    // We explicitly define it as a dictionary of strings, which is a valid `Json` type.
    const properties: { [key: string]: string } = {}
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("prop_")) {
        const propName = key.substring(5) // Remove 'prop_'
        // Ensure we only add string values, as FormData can include File objects
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
}
