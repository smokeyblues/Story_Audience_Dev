import { fail } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({
  locals: { supabase },
  params,
}) => {
  const { data: treatment, error: treatmentError } = await supabase
    .from("world_treatments")
    .select("characterization_attitude")
    .eq("world_id", params.worldId)
    .maybeSingle()

  if (treatmentError) {
    console.error("Error loading characterization:", treatmentError.message)
    // No need to throw, the page can handle a null treatment object
  }

  return {
    treatment: treatment ?? null,
  }
}

export const actions: Actions = {
  saveCharacterization: async ({
    request,
    locals: { supabase, user },
    params,
  }) => {
    if (!user) {
      return fail(401, {
        action: "saveCharacterization",
        error: "Unauthorized",
      })
    }

    const formData = await request.formData()
    const content = formData.get("characterization_attitude")?.toString()

    // content can be an empty string, which is a valid state to save
    if (content === null || content === undefined) {
      return fail(400, {
        action: "saveCharacterization",
        error: "Invalid content value.",
      })
    }

    const { error: upsertError } = await supabase
      .from("world_treatments")
      .upsert(
        {
          world_id: params.worldId,
          characterization_attitude: content,
        },
        { onConflict: "world_id" },
      )

    if (upsertError) {
      console.error("Error saving characterization:", upsertError)
      return fail(500, {
        action: "saveCharacterization",
        error: `Database error: ${upsertError.message}`,
      })
    }

    return {
      success: true,
      action: "saveCharacterization",
      message: "Characterization saved.",
    }
  },
}
