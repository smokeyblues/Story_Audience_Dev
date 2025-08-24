// src/routes/(admin)/account/(menu)/teams/[teamId]/worlds/[worldId]/(transmedia)/+layout.server.ts
import { error, redirect } from "@sveltejs/kit"
import type { LayoutServerLoad } from "./$types" // This will now work

// Define the structure for section status explicitly
interface SectionStatus {
  treatment: { hasSynopsis: boolean; hasCharacters: boolean }
  business: { hasAudience: boolean; hasGoals: boolean }
  design: { isStarted: boolean }
  functional: { isStarted: boolean }
  technology: { isStarted: boolean }
}

export const load: LayoutServerLoad = async ({
  params,
  locals: { supabase, safeGetSession },
}) => {
  const { session } = await safeGetSession()
  if (!session) {
    throw redirect(303, "/login")
  }

  const { worldId } = params
  if (!worldId) {
    throw error(400, "World ID is missing.")
  }

  // --- Start Parallel Data Fetching (Corrected Approach) ---

  // Fetch world and its associated team in one go
  const worldDetailsPromise = supabase
    .from("worlds")
    .select(
      `
      id,
      name,
      teams (id, name)
    `,
    )
    .eq("id", worldId)
    .single() // Use .single() as we expect exactly one row or an error

  // Fetch all status-related data
  const treatmentStatusPromise = supabase
    .from("world_treatments")
    .select("synopsis, characterization_attitude")
    .eq("world_id", worldId)
    .maybeSingle()

  const businessStatusPromise = supabase
    .from("world_business_details")
    .select("target_audience, goals_user")
    .eq("world_id", worldId)
    .maybeSingle()

  const functionalStatusPromise = supabase
    .from("world_functional_specs")
    .select("world_id", { count: "exact", head: true })
    .eq("world_id", worldId)

  const designStatusPromise = supabase
    .from("world_design_specs")
    .select("world_id", { count: "exact", head: true })
    .eq("world_id", worldId)

  // --- Await all promises ---
  const [
    { data: worldData, error: worldError },
    { data: treatmentStatusData },
    { data: businessStatusData },
    { count: functionalCount },
    { count: designCount },
  ] = await Promise.all([
    worldDetailsPromise,
    treatmentStatusPromise,
    businessStatusPromise,
    functionalStatusPromise,
    designStatusPromise,
  ])

  // --- Error Handling ---
  if (worldError) {
    console.error("Error loading world details:", worldError.message)
    // RLS will make this query fail with code PGRST116 if the user lacks access or the world doesn't exist.
    if (worldError.code === "PGRST116") {
      throw error(404, {
        message: "World not found or you don't have permission to view it.",
      })
    }
    throw error(500, "A server error occurred while loading world data.")
  }

  // --- Calculate Section Status ---
  const sectionStatus: SectionStatus = {
    treatment: {
      hasSynopsis: !!treatmentStatusData?.synopsis?.trim(),
      hasCharacters: !!treatmentStatusData?.characterization_attitude?.trim(),
    },
    business: {
      hasAudience: !!businessStatusData?.target_audience?.trim(),
      hasGoals: !!businessStatusData?.goals_user?.trim(),
    },
    functional: { isStarted: (functionalCount ?? 0) > 0 },
    design: { isStarted: (designCount ?? 0) > 0 },
    technology: { isStarted: false },
  }

  // --- Return Combined Data ---
  return {
    world: { id: worldData.id, name: worldData.name },
    // The team data is nested inside the worldData object from the query
    team: worldData.teams
      ? { id: worldData.teams.id, name: worldData.teams.name }
      : null,
    sectionStatus,
  }
}
