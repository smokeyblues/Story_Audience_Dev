import { error, fail, redirect } from "@sveltejs/kit"
import type { PageServerLoad, Actions } from "./$types"
import type { Json } from "../../../../../../../../../../../DatabaseDefinitions"

export const load: PageServerLoad = async ({
  params,
  locals: { supabase, safeGetSession },
}) => {
  const session = await safeGetSession()

  // Redirect to login if user is not authenticated.
  if (!session) {
    throw redirect(303, "/login")
  }

  const { teamId, worldId } = params
  const elementType = params["element_type"]

  // Validate the element type
  const validElementTypes = [
    "Character",
    "Location",
    "Item",
    "Species/Race",
    "Creature",
    "Faction",
    "Culture",
    "Government",
    "Religion/Mythology",
    "Event",
    "Lore Entry",
    "Theme",
    "Plot Point",
    "Magic System / Technology",
    "Language",
    "Calendar/Time",
  ]

  if (!validElementTypes.includes(elementType)) {
    throw error(400, `Invalid element type: ${elementType}`)
  }

  // Verify that the user has access to this team/world
  const { user } = session

  // Check team membership
  const { data: teamMember, error: teamMemberError } = await supabase
    .from("team_memberships")
    .select("*")
    .eq("team_id", teamId)
    .eq("user_id", user.id)
    .single()

  if (teamMemberError || !teamMember) {
    throw error(403, "You do not have access to this team.")
  }

  // Fetch team and world info for display
  const { data: team, error: teamError } = await supabase
    .from("teams")
    .select("*")
    .eq("id", teamId)
    .single()

  if (teamError || !team) {
    throw error(404, "Team not found.")
  }

  const { data: world, error: worldError } = await supabase
    .from("worlds")
    .select("*")
    .eq("id", worldId)
    .eq("team_id", teamId)
    .single()

  if (worldError || !world) {
    throw error(404, "World not found.")
  }

  return {
    team,
    world,
    elementType,
  }
}

export const actions: Actions = {
  create: async ({ request, params, locals: { supabase, safeGetSession } }) => {
    const session = await safeGetSession()

    if (!session) {
      return fail(401, { error: "Unauthorized" })
    }

    const { teamId, worldId } = params
    const elementType = params["element_type"]
    const { user } = session

    // Verify team access again
    const { data: teamMember, error: teamMemberError } = await supabase
      .from("team_memberships")
      .select("*")
      .eq("team_id", teamId)
      .eq("user_id", user.id)
      .single()

    if (teamMemberError || !teamMember) {
      return fail(403, { error: "You do not have access to this team." })
    }

    const formData = await request.formData()
    const name = formData.get("name")?.toString()

    if (!name || name.trim().length === 0) {
      return fail(400, { error: "Element name is required" })
    }

    // Collect all property fields that start with "prop_"
    const properties: Record<string, unknown> = {}
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("prop_") && value.toString().trim().length > 0) {
        const propName = key.substring(5) // Remove "prop_" prefix
        properties[propName] = value.toString().trim()
      }
    }

    // Add location data if available from hidden form fields
    const latitude = formData.get("latitude")?.toString()
    const longitude = formData.get("longitude")?.toString()
    if (latitude && longitude) {
      properties.latitude = parseFloat(latitude)
      properties.longitude = parseFloat(longitude)
      // --- New logic for coordinate system ---
      // Fetch the world's current map_type to correctly tag the coordinates
      const { data: world, error: worldError } = await supabase
        .from("worlds")
        .select("map_type")
        .eq("id", worldId)
        .single()

      if (worldError || !world) {
        return fail(500, { error: "Could not verify world map type." })
      }
      properties.coordinate_system =
        world.map_type === "custom_image" ? "pixel" : "geographic"
      // --- End of new logic ---
    }

    // Create the element
    const { data: element, error: createError } = await supabase
      .from("elements")
      .insert({
        name: name.trim(),
        type: elementType,
        world_id: worldId,
        properties:
          Object.keys(properties).length > 0 ? (properties as Json) : null,
      })
      .select()
      .single()

    if (createError) {
      console.error("Error creating element:", createError)
      return fail(500, {
        error:
          "An error occurred while creating the element. Please try again.",
      })
    }

    // Redirect to the newly created element
    throw redirect(
      303,
      `/account/teams/${teamId}/worlds/${worldId}/elements/${element.id}`,
    )
  },
}
