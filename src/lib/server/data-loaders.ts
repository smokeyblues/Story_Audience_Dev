// src/lib/server/data-loaders.ts

import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database, Tables } from "../../DatabaseDefinitions"

// Helper type for a world with its elements
type WorldWithElements = Tables<"worlds"> & {
  elements: Tables<"elements">[]
}

/**
 * Fetches all teams for a user, their associated worlds, and all elements of a specific type.
 * This is the central function for loading data for element overview pages.
 */
export async function getTeamsWithWorldsAndElements(
  supabase: SupabaseClient<Database>,
  user_id: string,
  elementType: string,
) {
  // --- THIS IS THE FIX ---
  // The key is to be explicit about the relationship: teams!team_members(...)
  // This tells Supabase how to join the tables correctly.
  const { data: teamsData, error: teamsError } = await supabase
    .from("teams")
    .select(
      `
            id,
            name,
            team_members!inner (
                user_role
            ),
            worlds (
                id,
                name,
                description,
                map_image_url,
                elements (
                    id,
                    name,
                    type,
                    properties
                )
            )
        `,
    )
    .eq("team_members.user_id", user_id)

  if (teamsError) {
    console.error(
      `Error fetching data for element type ${elementType}:`,
      teamsError,
    )
    return []
  }

  if (!teamsData) {
    return []
  }

  // Filter the elements in memory to match the requested type.
  const teamsWithFilteredElements = teamsData
    .map((team) => {
      // Filter the worlds to only include those that have the relevant elements
      const filteredWorlds = (team.worlds as WorldWithElements[])
        .map((world: WorldWithElements) => {
          // Keep only the elements of the desired type
          world.elements = world.elements.filter(
            (element: Tables<"elements">) => element.type === elementType,
          )
          return world
        })
        // Only keep worlds that actually contain the relevant elements
        .filter((world: WorldWithElements) => world.elements.length > 0)

      return { ...team, worlds: filteredWorlds }
    })
    // Filter out teams that have no worlds with the relevant elements
    .filter((team) => team.worlds.length > 0)

  return teamsWithFilteredElements
}
