// src/routes/(admin)/account/(menu)/+layout.server.ts
import { redirect } from "@sveltejs/kit"
import type { LayoutServerLoad } from "./$types"
import type { TeamMembershipWithTeamDetails } from "$lib/types" // Define this custom type below
import { CreateProfileStep } from "../../../../config"
import type { Database } from "../../../../DatabaseDefinitions"

// Optional: Define a more specific type combining membership and team details
// You might put this in a shared types file (e.g., src/lib/types.ts)
// Ensure the select query below matches this structure
// type TeamMembershipWithTeamDetails = {
//   role: string
//   teams: {
//     // Corresponds to the joined 'teams' table
//     id: string
//     name: string
//     owner_user_id: string | null
//   } | null // Use null if the join might result in no team match (shouldn't happen with INNER JOIN default)
// }

export const load: LayoutServerLoad = async ({
  locals: { safeGetSession, supabase },
  url,
}) => {
  // Check if we have a valid session using the server-side helper
  const { session, user } = await safeGetSession()

  // Redirect to login if no valid session
  if (!session?.user?.id || !user?.id) {
    redirect(303, "/login")
  }

  // Fetch additional user data
  const { data: profile } = await supabase
    .from("profiles")
    .select(`*`)
    .eq("id", user.id)
    .single()

  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

  // Profile redirect check
  const createProfilePath = "/account/create_profile"
  const signOutPath = "/account/sign_out"
  if (
    profile &&
    !_hasFullProfile(profile) &&
    url.pathname !== createProfilePath &&
    url.pathname !== signOutPath &&
    CreateProfileStep
  ) {
    redirect(303, createProfilePath)
  }

  // Fetch the teams the user is a member of, along with their worlds
  const { data: userTeamsData, error: rpcError } = await supabase.rpc(
    "get_user_teams_with_details",
  )

  if (rpcError) {
    console.error("Error fetching user's teams via RPC:", rpcError)
    // Handle error appropriately, maybe return an empty array or show an error
  }

  // An array to hold the fully processed team data including worlds
  let userTeams: TeamMembershipWithTeamDetails[] = []

  if (userTeamsData) {
    // Fetch all worlds for all teams the user is a member of in a single query
    const teamIds = userTeamsData.map((row) => row.team_id)
    const { data: worldsData, error: worldsError } = await supabase
      .from("worlds")
      .select("id, team_id")
      .in("team_id", teamIds)

    if (worldsError) {
      console.error("Error fetching worlds for teams:", worldsError)
      // Decide how to handle this - maybe teams will just have empty worlds arrays
    }

    // Map worlds to their team_id for efficient lookup
    const worldsByTeamId = new Map<string, { id: string }[]>()
    if (worldsData) {
      for (const world of worldsData) {
        if (!worldsByTeamId.has(world.team_id)) {
          worldsByTeamId.set(world.team_id, [])
        }
        worldsByTeamId.get(world.team_id)?.push({ id: world.id })
      }
    }

    // Now, structure the final userTeams array
    userTeams =
      userTeamsData.map((row) => ({
        role: row.user_role,
        teams: {
          id: row.team_id,
          name: row.team_name,
          owner_user_id: row.owner_id,
          // Assign the fetched worlds, or an empty array if none
          worlds: worldsByTeamId.get(row.team_id) ?? [],
        },
      })) ?? []
  }

  return {
    session,
    profile,
    user,
    amr: aal?.currentAuthenticationMethods,
    // This now correctly includes the 'worlds' property
    userTeams,
  }
}

function _hasFullProfile(
  profile: Database["public"]["Tables"]["profiles"]["Row"],
) {
  if (!profile) return false
  if (!profile.full_name) return false
  if (!profile.company_name) return false
  if (!profile.website) return false
  return true
}
