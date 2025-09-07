import { fail, redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"
import { createClient } from "@supabase/supabase-js"
import { PUBLIC_SUPABASE_URL } from "$env/static/public"
import { PRIVATE_SUPABASE_SERVICE_ROLE } from "$env/static/private"

// Helper to create a Supabase client with admin privileges
const createAdminClient = () => {
  if (!PRIVATE_SUPABASE_SERVICE_ROLE) {
    throw new Error(
      "PRIVATE_SUPABASE_SERVICE_ROLE is not set in environment variables",
    )
  }
  return createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_ROLE)
}

export const load: PageServerLoad = async ({
  locals: { supabase },
  params,
}) => {
  // Load the list of scripts without generating signed URLs upfront
  const { data: scriptAssets, error: dbError } = await supabase
    .from("world_assets")
    .select("id, file_name, file_path, size_bytes, created_at")
    .eq("world_id", params.worldId)
    .eq("asset_category", "script")
    .order("created_at", { ascending: true })

  if (dbError) {
    console.error("Error loading scripts:", dbError.message)
    return { scripts: [] }
  }

  return { scripts: scriptAssets ?? [] }
}

export const actions: Actions = {
  // --- NEW: Action to generate a signed URL on demand ---
  viewScript: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const filePath = formData.get("filePath")?.toString()

    if (!filePath) {
      return fail(400, { action: "viewScript", error: "File path is missing." })
    }

    // Create a short-lived (60 seconds) signed URL
    const { data, error } = await supabase.storage
      .from("world-assets")
      .createSignedUrl(filePath, 60)

    if (error) {
      console.error("Error creating signed URL:", error)
      return fail(500, {
        action: "viewScript",
        error: "Could not generate view link.",
      })
    }

    // Redirect the user to the newly generated URL
    throw redirect(303, data.signedUrl)
  },

  // --- uploadScript and deleteScript actions remain the same ---

  uploadScript: async ({ request, locals: { supabase, user }, params }) => {
    if (!user) {
      return fail(401, { action: "uploadScript", error: "Unauthorized" })
    }

    const { count, error: membershipError } = await supabase
      .from("team_memberships")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("team_id", params.teamId)

    if (membershipError || (count ?? 0) === 0) {
      return fail(403, {
        action: "uploadScript",
        error: "You don't have permission to upload to this team.",
      })
    }

    const formData = await request.formData()
    const file = formData.get("scriptFile") as File

    if (!file || file.size === 0) {
      return fail(400, {
        action: "uploadScript",
        error: "Please select a file to upload.",
      })
    }

    const supabaseAdmin = createAdminClient()
    const filePath = `${params.teamId}/${params.worldId}/${crypto.randomUUID()}-${file.name}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from("world-assets")
      .upload(filePath, file)

    if (uploadError) {
      console.error("Admin upload error:", uploadError)
      return fail(500, {
        action: "uploadScript",
        error: `Storage error: ${uploadError.message}`,
      })
    }

    const { error: dbError } = await supabase.from("world_assets").insert({
      world_id: params.worldId,
      uploaded_by_user_id: user.id,
      file_name: file.name,
      file_path: filePath,
      file_type: file.type,
      size_bytes: file.size,
      asset_category: "script",
    })

    if (dbError) {
      console.error("Error saving script metadata:", dbError)
      await supabaseAdmin.storage.from("world-assets").remove([filePath])
      return fail(500, {
        action: "uploadScript",
        error: `Database error: ${dbError.message}`,
      })
    }

    return {
      success: true,
      action: "uploadScript",
      message: "Script uploaded successfully.",
    }
  },

  deleteScript: async ({ request, locals: { supabase, user }, params }) => {
    if (!user) {
      return fail(401, { action: "deleteScript", error: "Unauthorized" })
    }

    const formData = await request.formData()
    const assetId = formData.get("assetId")?.toString()
    const filePath = formData.get("filePath")?.toString()

    if (!assetId || !filePath) {
      return fail(400, {
        action: "deleteScript",
        error: "Missing asset ID or file path.",
      })
    }

    const { count, error: membershipError } = await supabase
      .from("team_memberships")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("team_id", params.teamId)

    if (membershipError || (count ?? 0) === 0) {
      return fail(403, {
        action: "deleteScript",
        error: "You do not have permission to delete assets.",
      })
    }

    const { error: dbError } = await supabase
      .from("world_assets")
      .delete()
      .match({ id: assetId, world_id: params.worldId })

    if (dbError) {
      console.error("Error deleting script metadata:", dbError)
      return fail(500, { action: "deleteScript", error: "Database error." })
    }

    const supabaseAdmin = createAdminClient()
    const { error: storageError } = await supabaseAdmin.storage
      .from("world-assets")
      .remove([filePath])

    if (storageError) {
      console.warn("Could not delete file from storage:", storageError.message)
    }

    return { success: true, action: "deleteScript", message: "Script deleted." }
  },
}
