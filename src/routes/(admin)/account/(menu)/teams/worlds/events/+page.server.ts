import { error, redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import type { Database } from "../../../../../../../DatabaseDefinitions"

// Define the shape of the data returned by the load function.
// This helps with type safety in the Svelte component.
export type EventElement = Database["public"]["Tables"]["elements"]["Row"]

export type WorldWithEvents = Database["public"]["Tables"]["worlds"]["Row"] & {
  elements: EventElement[]
}

export type TeamWithEvents = Database["public"]["Tables"]["teams"]["Row"] & {
  worlds: WorldWithEvents[]
}

/**
 * Loads all events for all teams and worlds associated with the current user.
 * The data is structured as a nested array of teams, worlds, and events.
 */
export const load: PageServerLoad = async ({
  locals: { supabase, safeGetSession },
}) => {
  const session = await safeGetSession()

  // Redirect to login if user is not authenticated.
  if (!session) {
    throw redirect(303, "/login")
  }

  const { user } = session

  // 1. Get the IDs of all teams the current user is a member of.
  const { data: teamMembers, error: teamMembersError } = await supabase
    .from("team_memberships")
    .select("team_id")
    .eq("user_id", user.id)

  if (teamMembersError) {
    console.error("Error fetching user teams:", teamMembersError)
    throw error(500, "An error occurred while fetching your teams.")
  }

  // If the user isn't part of any teams, there are no events to show.
  if (!teamMembers || teamMembers.length === 0) {
    return { teamsWithEvents: [] as TeamWithEvents[] }
  }

  const teamIds = teamMembers.map((tm) => tm.team_id)

  // 2. Fetch all teams and their worlds (always show structure)
  const { data: teamsData, error: teamsError } = await supabase
    .from("teams")
    .select(
      `
            id,
            name,
            created_at,
            owner_user_id,
            updated_at,
            worlds(
                id,
                name,
                team_id,
                created_at,
                description,
                map_image_url,
                map_type,
                updated_at
            )
        `,
    )
    .in("id", teamIds)

  if (teamsError) {
    console.error("Error fetching teams and worlds:", teamsError)
    throw error(500, "An error occurred while fetching teams and worlds.")
  }

  // 3. Separately fetch event elements for all worlds
  const worldIds = (teamsData || [])
    .flatMap((team) => team.worlds || [])
    .map((world) => world.id)

  let eventElements: EventElement[] = []
  if (worldIds.length > 0) {
    const { data: elementsData, error: elementsError } = await supabase
      .from("elements")
      .select("*")
      .in("world_id", worldIds)
      .eq("type", "Event")

    if (elementsError) {
      console.error("Error fetching event elements:", elementsError)
      throw error(500, "An error occurred while fetching event elements.")
    }

    eventElements = elementsData || []
  }

  // 4. Combine the data - always include all teams/worlds, with their event elements
  const teamsWithEvents: TeamWithEvents[] = (teamsData || []).map((team) => ({
    ...team,
    worlds: (team.worlds || []).map((world) => ({
      ...world,
      elements: eventElements.filter(
        (element) => element.world_id === world.id,
      ),
    })),
  }))

  return { teamsWithEvents }
}
