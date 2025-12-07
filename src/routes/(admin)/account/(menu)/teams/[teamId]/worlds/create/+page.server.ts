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

  // Verify permission (same as before)
  const { data: teamMembership, error: teamError } = await supabase
    .from("team_memberships")
    .select("role")
    .eq("team_id", params.teamId)
    .eq("user_id", user.id)
    .single()

  if (teamError || !["owner", "admin"].includes(teamMembership.role)) {
    redirect(303, `/account/teams/${params.teamId}/worlds`)
  }

  return {
    teamId: params.teamId,
  }
}

export const actions: Actions = {
  createWorldFromAgent: async ({
    request,
    locals: { supabase, user },
    params,
  }) => {
    if (!user) return fail(401, { error: "Unauthorized" })

    const formData = await request.formData()
    const worldDataRaw = formData.get("worldData")?.toString()

    if (!worldDataRaw) {
      console.error("No agent data received in form submission")
      return fail(400, { error: "No agent data received." })
    }

    let extractedData
    try {
      extractedData = JSON.parse(worldDataRaw)
      console.log(
        "Server received world data:",
        JSON.stringify(extractedData, null, 2),
      )
    } catch (e) {
      console.error("Failed to parse world JSON:", e)
      return fail(400, { error: "Invalid JSON data." })
    }

    // Default to empty arrays if undefined
    const {
      world,
      elements = [],
      relationships = [],
      premises = [],
    } = extractedData
    console.log("Elements to save:", elements)

    if (!world || !world.name) {
      console.error("Missing world metadata in agent response")
      return fail(400, {
        error: "Agent response missing world name/description.",
      })
    }

    // 1. Create the World
    const { data: newWorld, error: worldError } = await supabase
      .from("worlds")
      .insert({
        name: world.name,
        description: world.description,
        team_id: params.teamId,
      })
      .select("id")
      .single()

    if (worldError || !newWorld) {
      console.error("Error creating world:", worldError)
      return fail(500, { error: "Failed to create world record." })
    }

    // 2. Create Elements (if any)
    const elementMap = new Map<string, string>() // Name -> ID

    if (elements && elements.length > 0) {
      const elementsToInsert = elements.map(
        (el: {
          name: string
          type: string
          properties: Record<string, unknown>
        }) => ({
          world_id: newWorld.id,
          name: el.name,
          type: el.type,
          properties: {
            ...el.properties,
            agent_suggestion: true, // Mark as suggested for review
          },
        }),
      )

      const { data: insertedElements, error: elementsError } = await supabase
        .from("elements")
        .insert(elementsToInsert)
        .select("id, name")

      if (elementsError) {
        console.error("Error inserting elements:", elementsError)
      } else if (insertedElements) {
        insertedElements.forEach((el) => {
          elementMap.set(el.name, el.id)
        })
      }
    }

    // 3. Create Relationships (if any)
    if (relationships && relationships.length > 0 && elementMap.size > 0) {
      const relationshipsToInsert = []

      for (const rel of relationships) {
        const sourceId = elementMap.get(rel.source)
        const targetId = elementMap.get(rel.target)

        if (sourceId && targetId) {
          relationshipsToInsert.push({
            world_id: newWorld.id,
            source_element_id: sourceId,
            target_element_id: targetId,
            type: rel.type,
            properties: {
              description: rel.description,
            },
          })
        }
      }

      if (relationshipsToInsert.length > 0) {
        const { error: relError } = await supabase
          .from("relationships")
          .insert(relationshipsToInsert)

        if (relError) {
          console.error("Error inserting relationships:", relError)
        }
      }
    }

    // 4. Create Premises (if any)
    if (premises && premises.length > 0) {
      const premisesToInsert = premises.map((p: string) => ({
        user_id: user.id,
        premise: p,
      }))

      const { error: premiseError } = await supabase
        .from("premises")
        .insert(premisesToInsert)

      if (premiseError) console.error("Error inserting premises:", premiseError)
    }

    // Redirect to the new World Dashboard with ?new=true
    redirect(
      303,
      `/account/teams/${params.teamId}/worlds/${newWorld.id}?new=true`,
    )
  },
}
