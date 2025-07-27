import { error } from "@sveltejs/kit"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({
  locals: { supabase },
  params,
  route,
}) => {
  const breadcrumbs = [{ label: "Teams", href: "/account/teams" }]

  if (params.teamId) {
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("id, name")
      .eq("id", params.teamId)
      .single()
    if (teamError) error(404, "Team not found")
    breadcrumbs.push({
      label: team.name,
      href: `/account/teams/${team.id}`,
    })
  }

  if (params.worldId) {
    const { data: world, error: worldError } = await supabase
      .from("worlds")
      .select("id, name, team_id")
      .eq("id", params.worldId)
      .single()
    if (worldError) error(404, "World not found")
    breadcrumbs.push({
      label: world.name,
      href: `/account/teams/${world.team_id}/worlds/${world.id}`,
    })
  }

  if (params.elementId) {
    const { data: element, error: elementError } = await supabase
      .from("elements")
      .select("id, name, world_id")
      .eq("id", params.elementId)
      .single()
    if (elementError) error(404, "Element not found")

    // To get the full path, we need the world's team_id
    const { data: world, error: worldError } = await supabase
      .from("worlds")
      .select("team_id")
      .eq("id", element.world_id)
      .single()
    if (worldError) error(404, "World for element not found")

    breadcrumbs.push({
      label: element.name,
      href: `/account/teams/${world.team_id}/worlds/${element.world_id}/elements/${element.id}`,
    })
  }

  return {
    breadcrumbs,
    // Pass along route.id to determine which segments should be links
    currentRouteId: route.id,
  }
}
