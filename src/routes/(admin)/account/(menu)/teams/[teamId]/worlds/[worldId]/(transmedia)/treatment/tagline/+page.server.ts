import { fail } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({
  locals: { supabase },
  params,
}) => {
  // The layout.server.ts already handles auth and world existence.
  // We just need to load the data for this specific page.
  const { data: treatment } = await supabase
    .from("world_treatments")
    .select("tagline")
    .eq("world_id", params.worldId)
    .maybeSingle() // It's okay if this doesn't exist yet.

  return {
    treatment: treatment ?? { tagline: "" }, // Ensure we always return an object
  }
}

export const actions: Actions = {
  saveTagline: async ({ request, locals: { supabase }, params }) => {
    const formData = await request.formData()
    const tagline = formData.get("tagline")?.toString()

    if (tagline === null || tagline === undefined) {
      return fail(400, {
        error: "Missing tagline content.",
      })
    }

    const { error: upsertError } = await supabase
      .from("world_treatments")
      .upsert(
        { world_id: params.worldId, tagline: tagline },
        { onConflict: "world_id" }, // This ensures it updates if a row for the world already exists
      )

    if (upsertError) {
      console.error(`Error saving tagline:`, upsertError)
      return fail(500, {
        error: `Database error: ${upsertError.message}`,
      })
    }

    return {
      success: true,
      message: "Tagline saved.",
    }
  },
}
