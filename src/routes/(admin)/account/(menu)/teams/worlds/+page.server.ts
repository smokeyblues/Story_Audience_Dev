import { fail, redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import type { Tables } from "../../../../../../DatabaseDefinitions"

type TeamWithWorlds = {
  team_id: string
  team_name: string
  user_role:
    | "owner"
    | "admin"
    | "member"
    | "writer"
    | "canon-editor"
    | "story-lead"
    | "world-architect"
  owner_id: string
  worlds: Tables<"worlds">[]
}

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
  if (!user) {
    redirect(303, "/login")
  }

  const { data: teams, error: teamsError } = await supabase.rpc(
    "get_user_teams_with_details",
  )

  if (teamsError) {
    console.error("Error fetching user teams:", teamsError)
    return fail(500, { error: "Failed to load teams." })
  }

  if (!teams || teams.length === 0) {
    return { teamsWithWorlds: [] }
  }

  const teamIds = teams.map((t) => t.team_id)

  const { data: worlds, error: worldsError } = await supabase
    .from("worlds")
    .select("*")
    .in("team_id", teamIds)

  if (worldsError) {
    console.error("Error fetching worlds:", worldsError)
    // Gracefully return teams without worlds if worlds fetch fails
    const teamsWithWorlds: TeamWithWorlds[] = teams.map((team) => ({
      ...team,
      worlds: [],
    }))
    return { teamsWithWorlds }
  }

  const worldsByTeamId = new Map<string, Tables<"worlds">[]>()
  if (worlds) {
    for (const world of worlds) {
      if (!worldsByTeamId.has(world.team_id)) {
        worldsByTeamId.set(world.team_id, [])
      }
      worldsByTeamId.get(world.team_id)!.push(world)
    }
  }

  const teamsWithWorlds: TeamWithWorlds[] = teams.map((team) => ({
    ...team,
    worlds: worldsByTeamId.get(team.team_id) || [],
  }))

  return { teamsWithWorlds }
}
