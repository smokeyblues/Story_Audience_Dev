import { fail } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load = (async ({ locals: { supabase, session } }) => {
  if (!session) {
    return {
      user_teams_with_details: [],
      invitations: [],
    }
  }

  const {
    data: user_teams_with_details,
    error: user_teams_with_details_error,
  } = await supabase.rpc("get_user_teams_with_details")

  if (user_teams_with_details_error) {
    return fail(500, {
      message: "Error fetching user teams",
      error: user_teams_with_details_error,
    })
  }

  if (!session.user.email) {
    return fail(500, {
      message: "User email not found",
      error: "User email not found",
    })
  }

  const { data: invitations, error: invitations_error } = await supabase
    .from("team_invitations")
    .select("*")
    .eq("invited_user_email", session.user.email)
    .eq("status", "pending")

  if (invitations_error) {
    return fail(500, {
      message: "Error fetching invitations",
      error: invitations_error,
    })
  }

  return { user_teams_with_details, invitations, session }
}) satisfies PageServerLoad
