// src/routes/(admin)/account/(menu)/teams/[teamId]/worlds/create/+page.server.ts
import { fail, redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({
  locals: { supabase, user },
  params,
}) => {
  if (!user) {
    redirect(303, "/login")
  }

  // Verify the user is an owner or admin of the team
  const { data: teamMembership, error: teamError } = await supabase
    .from("team_memberships")
    .select("role")
    .eq("team_id", params.teamId)
    .eq("user_id", user.id)
    .single()

  if (teamError || !["owner", "admin"].includes(teamMembership.role)) {
    redirect(303, `/account/teams/${params.teamId}/worlds`)
  }

  return { teamId: params.teamId }
}

export const actions: Actions = {
  createWorld: async ({ request, locals: { supabase, user }, params }) => {
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

    // Double-check permission before insertion
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

    const { data: newWorld, error: insertError } = await supabase
      .from("worlds")
      .insert({
        name,
        description,
        team_id: params.teamId,
      })
      .select("id")
      .single()

    if (insertError) {
      console.error("Error creating world:", insertError)
      return fail(500, { name, description, error: "Database error." })
    }

    if (newWorld) {
      redirect(303, `/account/teams/${params.teamId}/worlds/${newWorld.id}`)
    }

    return { success: true, message: "World created successfully." }
  },
}
