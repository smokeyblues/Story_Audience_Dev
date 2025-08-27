import { fail } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({
  locals: { supabase },
  params,
}) => {
  const { data: treatment } = await supabase
    .from("world_treatments")
    .select("synopsis")
    .eq("world_id", params.worldId)
    .maybeSingle()

  return {
    treatment: treatment ?? { synopsis: "" },
  }
}

export const actions: Actions = {
  saveSynopsis: async ({ request, locals: { supabase }, params }) => {
    const formData = await request.formData()
    const synopsis = formData.get("synopsis")?.toString()

    if (synopsis === null || synopsis === undefined) {
      return fail(400, {
        error: "Missing synopsis content.",
      })
    }

    const { error: upsertError } = await supabase
      .from("world_treatments")
      .upsert(
        { world_id: params.worldId, synopsis: synopsis },
        { onConflict: "world_id" },
      )

    if (upsertError) {
      console.error(`Error saving synopsis:`, upsertError)
      return fail(500, {
        error: `Database error: ${upsertError.message}`,
      })
    }

    return {
      success: true,
      message: "Synopsis saved.",
    }
  },
}
