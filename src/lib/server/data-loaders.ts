// src/lib/server/data-loaders.ts

import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database, Tables } from "../../DatabaseDefinitions"

/**
 * Fetches all teams for a user, their associated worlds, and all elements of a specific type.
 * This is the central function for loading data for element overview pages.
 *
 * This function has been refactored to perform filtering at the database level, which is more efficient.
 */
export async function getTeamsWithWorldsAndElements(
  supabase: SupabaseClient<Database>,
  user_id: string,
  elementType: string,
) {
  const { data: teamsData, error: teamsError } = await supabase
    .from("teams")
    .select(
      `
            id,
            name,
            team_members!inner (
                user_role
            ),
            worlds!inner (
                id,
                name,
                description,
                map_image_url,
                elements!inner (
                    id,
                    name,
                    type,
                    properties
                )
            )
        `,
    )
    .eq("team_members.user_id", user_id)
    .eq("worlds.elements.type", elementType)

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

  return teamsData
}
