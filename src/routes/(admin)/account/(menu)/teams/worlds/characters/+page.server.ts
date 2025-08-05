import { error, redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import type { Database } from "../../../../../../../DatabaseDefinitions"

// Define the shape of the data returned by the load function.
// This helps with type safety in the Svelte component.
export type CharacterElement = Database["public"]["Tables"]["elements"]["Row"]

export type WorldWithCharacters =
  Database["public"]["Tables"]["worlds"]["Row"] & {
    elements: CharacterElement[]
  }

export type TeamWithCharacters =
  Database["public"]["Tables"]["teams"]["Row"] & {
    worlds: WorldWithCharacters[]
  }

/**
 * Loads all characters for all teams and worlds associated with the current user.
 * The data is structured as a nested array of teams, worlds, and characters.
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

  // If the user isn't part of any teams, there are no characters to show.
  if (!teamMembers || teamMembers.length === 0) {
    return { teamsWithCharacters: [] as TeamWithCharacters[] }
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
                updated_at
            )
        `,
    )
    .in("id", teamIds)

  if (teamsError) {
    console.error("Error fetching teams and worlds:", teamsError)
    throw error(500, "An error occurred while fetching teams and worlds.")
  }

  // 3. Separately fetch character elements for all worlds
  const worldIds = (teamsData || [])
    .flatMap((team) => team.worlds || [])
    .map((world) => world.id)

  let characterElements: CharacterElement[] = []
  if (worldIds.length > 0) {
    const { data: elementsData, error: elementsError } = await supabase
      .from("elements")
      .select("*")
      .in("world_id", worldIds)
      .eq("type", "Character")

    if (elementsError) {
      console.error("Error fetching character elements:", elementsError)
      throw error(500, "An error occurred while fetching character elements.")
    }

    characterElements = elementsData || []
  }

  // 4. Combine the data - always include all teams/worlds, with their character elements
  const teamsWithCharacters: TeamWithCharacters[] = (teamsData || []).map(
    (team) => ({
      ...team,
      worlds: (team.worlds || []).map((world) => ({
        ...world,
        elements: characterElements.filter(
          (element) => element.world_id === world.id,
        ),
      })),
    }),
  )

  return { teamsWithCharacters }
}
