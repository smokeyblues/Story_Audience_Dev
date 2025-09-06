import { fail } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"
import { createClient } from "@supabase/supabase-js"
import { PUBLIC_SUPABASE_URL } from "$env/static/public"
import { PRIVATE_SUPABASE_SERVICE_ROLE } from "$env/static/private"

// This helper creates a temporary, admin-level Supabase client
// that can bypass RLS policies for storage operations.
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

  // Since the bucket is private, we must generate secure, temporary download links.
  const scriptsWithUrls = await Promise.all(
    (scriptAssets ?? []).map(async (script) => {
      const { data, error: urlError } = await supabase.storage
        .from("world-assets")
        .createSignedUrl(script.file_path, 60 * 60) // URL is valid for 1 hour

      if (urlError) {
        console.error(
          "Error creating signed URL for",
          script.file_path,
          urlError,
        )
        return { ...script, signedUrl: null }
      }
      return { ...script, signedUrl: data.signedUrl }
    }),
  )

  return { scripts: scriptsWithUrls }
}

export const actions: Actions = {
  uploadScript: async ({ request, locals: { supabase, user }, params }) => {
    if (!user) {
      return fail(401, { action: "uploadScript", error: "Unauthorized" })
    }

    // 1. VERIFY PERMISSION: Before touching any files, ensure the user is a member of the team.
    const { count, error: membershipError } = await supabase
      .from("team_memberships")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("team_id", params.teamId)

    if (membershipError || (count ?? 0) === 0) {
      console.error("Permission check failed:", membershipError?.message)
      return fail(403, {
        action: "uploadScript",
        error: "You don't have permission to upload to this team.",
      })
    }

    // 2. PROCEED WITH UPLOAD: If permission is granted, use the admin client.
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
      .upload(filePath, file, { upsert: false })

    if (uploadError) {
      console.error("Admin upload error:", uploadError)
      return fail(500, {
        action: "uploadScript",
        error: `Storage error: ${uploadError.message}`,
      })
    }

    // 3. RECORD METADATA: After a successful upload, save the file's info in our public table.
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
