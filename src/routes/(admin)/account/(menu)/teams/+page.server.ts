import { fail } from "@sveltejs/kit"
import type { PageServerLoad, Actions } from "./$types"

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

export const actions: Actions = {
  deleteTeam: async ({ request, locals: { supabase, session } }) => {
    if (!session) {
      return fail(401, { message: "Unauthorized" })
    }

    const formData = await request.formData()
    const team_id = formData.get("team_id") as string

    if (!team_id) {
      return fail(400, { message: "Team ID is required" })
    }

    // Verify ownership
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("owner_user_id")
      .eq("id", team_id)
      .single()

    if (teamError || !team) {
      return fail(404, { message: "Team not found" })
    }

    if (team.owner_user_id !== session.user.id) {
      return fail(403, { message: "Only the owner can delete the team" })
    }

    // Delete team
    const { error: deleteError } = await supabase
      .from("teams")
      .delete()
      .eq("id", team_id)

    if (deleteError) {
      return fail(500, { message: "Failed to delete team", error: deleteError })
    }

    return { success: true }
  },

  acceptInvite: async ({ request, locals: { supabase, session } }) => {
    if (!session) {
      return fail(401, { message: "Unauthorized" })
    }

    const formData = await request.formData()
    const token = formData.get("token") as string

    if (!token) {
      return fail(400, { message: "Token is required" })
    }

    // Find invitation by token to get ID
    const { data: invite, error: inviteError } = await supabase
      .from("team_invitations")
      .select("id")
      .eq("token", token)
      .single()

    if (inviteError || !invite) {
      return fail(404, { message: "Invitation not found" })
    }

    // Use RPC to accept invitation
    const { error: rpcError } = await supabase.rpc("accept_team_invitation", {
      p_invitation_id: invite.id,
    })

    if (rpcError) {
      console.error("RPC accept_team_invitation failed:", rpcError)
      return fail(500, {
        message: "Failed to accept invitation",
        error: rpcError,
      })
    }

    return { success: true }
  },

  declineInvite: async ({ request, locals: { supabase, session } }) => {
    if (!session) {
      return fail(401, { message: "Unauthorized" })
    }

    const formData = await request.formData()
    const token = formData.get("token") as string

    if (!token) {
      return fail(400, { message: "Token is required" })
    }

    // Find and delete invitation
    const { error: deleteError } = await supabase
      .from("team_invitations")
      .delete()
      .eq("token", token)

    if (deleteError) {
      return fail(500, {
        message: "Failed to decline invitation",
        error: deleteError,
      })
    }

    return { success: true }
  },
}
