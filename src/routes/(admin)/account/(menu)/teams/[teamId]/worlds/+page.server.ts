import { fail, redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({
  locals: { supabase, user },
  params,
}) => {
  if (!user) {
    redirect(303, "/login")
  }

  // Verify the user is a member of the team
  const { data: teamMembership, error: teamError } = await supabase
    .from("team_memberships")
    .select("role")
    .eq("team_id", params.teamId)
    .eq("user_id", user.id)
    .single()

  if (teamError || !teamMembership) {
    return fail(404, { error: "Team not found or you are not a member." })
  }

  // Fetch worlds for the team
  const { data: worlds, error: worldsError } = await supabase
    .from("worlds")
    .select("*")
    .eq("team_id", params.teamId)
    .order("created_at", { ascending: true })

  if (worldsError) {
    console.error("Error loading worlds:", worldsError.message)
    return fail(500, { error: "Failed to load worlds." })
  }

  return {
    worlds: worlds ?? [],
    teamId: params.teamId,
    userRole: teamMembership.role,
  }
}

export const actions: Actions = {
  addWorld: async ({ request, locals: { supabase, user }, params }) => {
    if (!user) {
      return fail(401, { error: "Unauthorized" })
    }

    const formData = await request.formData()
    const name = formData.get("name")?.toString()?.trim()
    const description = formData.get("description")?.toString()?.trim()

    if (!name) {
      return fail(400, {
        name,
        description,
        error: "World name cannot be empty.",
      })
    }

    // Verify user has permission to add a world to this team (owner or admin)
    const { data: teamMembership, error: teamError } = await supabase
      .from("team_memberships")
      .select("role")
      .eq("team_id", params.teamId)
      .eq("user_id", user.id)
      .single()

    if (teamError || !["owner", "admin"].includes(teamMembership.role)) {
      return fail(403, {
        error: "You don't have permission to create a world in this team.",
      })
    }

    const { error: insertError } = await supabase.from("worlds").insert({
      name,
      description,
      team_id: params.teamId,
    })

    if (insertError) {
      console.error("Error adding world:", insertError)
      return fail(500, { name, description, error: "Database error." })
    }

    return { success: true, message: "World created successfully." }
  },
}
