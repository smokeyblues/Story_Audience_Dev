import { fail } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({
  locals: { supabase },
  params,
}) => {
  const { data: plotPoints, error } = await supabase
    .from("world_plot_points")
    .select("*")
    .eq("world_id", params.worldId)
    .order("order_index", { ascending: true })

  if (error) {
    console.error("Error loading plot points:", error.message)
    return { plotPoints: [] }
  }

  return {
    plotPoints: plotPoints ?? [],
  }
}

export const actions: Actions = {
  addPlotPoint: async ({ request, locals: { supabase }, params }) => {
    const formData = await request.formData()
    const description = formData.get("description")?.toString()?.trim()

    if (!description) {
      return fail(400, {
        action: "addPlotPoint",
        error: "Description cannot be empty.",
      })
    }

    const { count, error: countError } = await supabase
      .from("world_plot_points")
      .select("*", { count: "exact", head: true })
      .eq("world_id", params.worldId)

    if (countError) {
      console.error("Error counting plot points:", countError)
      return fail(500, { action: "addPlotPoint", error: "Database error." })
    }

    const { error: insertError } = await supabase
      .from("world_plot_points")
      .insert({
        world_id: params.worldId,
        description: description,
        order_index: count ?? 0,
      })

    if (insertError) {
      console.error("Error adding plot point:", insertError)
      return fail(500, { action: "addPlotPoint", error: "Database error." })
    }

    return {
      success: true,
      action: "addPlotPoint",
      message: "Plot point added.",
    }
  },

  updatePlotPoint: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const id = formData.get("id")?.toString()
    const description = formData.get("description")?.toString()?.trim()

    if (!id || !description) {
      return fail(400, {
        action: "updatePlotPoint",
        error: "ID and description are required.",
      })
    }

    const { error } = await supabase
      .from("world_plot_points")
      .update({ description: description })
      .eq("id", id)

    if (error) {
      console.error("Error updating plot point:", error)
      return fail(500, { action: "updatePlotPoint", error: "Database error." })
    }

    return {
      success: true,
      action: "updatePlotPoint",
      message: "Plot point updated.",
    }
  },

  deletePlotPoint: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const id = formData.get("id")?.toString()

    if (!id) {
      return fail(400, {
        action: "deletePlotPoint",
        error: "Plot point ID is missing.",
      })
    }

    const { error } = await supabase
      .from("world_plot_points")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting plot point:", error)
      return fail(500, { action: "deletePlotPoint", error: "Database error." })
    }

    return {
      success: true,
      action: "deletePlotPoint",
      message: "Plot point deleted.",
    }
  },
}
