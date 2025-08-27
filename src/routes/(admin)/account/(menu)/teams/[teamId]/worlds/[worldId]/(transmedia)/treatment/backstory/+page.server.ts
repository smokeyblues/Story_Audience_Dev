import { fail } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({
  locals: { supabase },
  params,
}) => {
  const { data: treatment } = await supabase
    .from("world_treatments")
    .select("backstory_context")
    .eq("world_id", params.worldId)
    .maybeSingle()

  return {
    treatment: treatment ?? { backstory_context: "" },
  }
}

export const actions: Actions = {
  saveBackstory: async ({ request, locals: { supabase }, params }) => {
    const formData = await request.formData()
    const backstory = formData.get("backstory_context")?.toString()

    if (backstory === null || backstory === undefined) {
      return fail(400, {
        error: "Missing backstory content.",
      })
    }

    const { error: upsertError } = await supabase
      .from("world_treatments")
      .upsert(
        { world_id: params.worldId, backstory_context: backstory },
        { onConflict: "world_id" },
      )

    if (upsertError) {
      console.error(`Error saving backstory:`, upsertError)
      return fail(500, {
        error: `Database error: ${upsertError.message}`,
      })
    }

    return {
      success: true,
      message: "Backstory saved.",
    }
  },
}
