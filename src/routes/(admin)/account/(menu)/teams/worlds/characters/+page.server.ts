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

  // 2. Fetch the teams and their nested worlds and character elements.
  //    - We filter elements by `type: 'Character'` (note the capital C).
  //    - Using regular joins (not !inner) to avoid filtering out teams/worlds without characters.
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
                updated_at,
                elements(
                    id,
                    name,
                    type,
                    properties,
                    created_at,
                    updated_at,
                    world_id
                )
            )
        `,
    )
    .in("id", teamIds)
    .eq("worlds.elements.type", "Character")

  if (teamsError) {
    console.error("Error fetching teams and characters:", teamsError)
    throw error(500, "An error occurred while fetching characters.")
  }

  // Filter and process the data to only include teams/worlds that have character elements
  const teamsWithCharacters: TeamWithCharacters[] = (teamsData || [])
    .map((team) => ({
      ...team,
      worlds: (team.worlds || [])
        .map((world) => ({
          ...world,
          elements: (world.elements || []).filter(
            (element) => element.type === "Character",
          ),
        }))
        .filter((world) => world.elements.length > 0), // Only include worlds with characters
    }))
    .filter((team) => team.worlds.length > 0) // Only include teams with worlds that have characters

  return { teamsWithCharacters }
}
