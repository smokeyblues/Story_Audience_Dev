import { fail, redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
  if (!user) {
    redirect(303, "/login") // Or your specific login path
  }

  const premisesPromise = supabase
    .from("premises")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  const wishListItemsPromise = supabase
    .from("wish_list_items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  // Run all data fetching in parallel
  const [
    { data: premises, error: premisesError },
    { data: wishListItems, error: wishListItemsError },
  ] = await Promise.all([premisesPromise, wishListItemsPromise])

  // Check for critical errors (e.g., if RLS denied access unexpectedly)
  // Individual sections might fail gracefully, but log errors.
  if (premisesError)
    console.error("Error loading premises:", premisesError.message)
  if (wishListItemsError)
    console.error("Error loading wish list items:", wishListItemsError.message)

  return {
    // Ensure we pass back null or data, never undefined for treatment
    premises: premises ?? [],
    wishListItems: wishListItems ?? [],
  }
}

export const actions: Actions = {
  addPremise: async ({ request, locals: { supabase, user } }) => {
    const actionName = "addPremise" // <<< Define action name
    if (!user) return fail(401, { action: actionName, message: "Unauthorized" })
    const formData = await request.formData()
    const premise = formData.get("premise")?.toString()?.trim()
    if (!premise) {
      return fail(400, {
        action: actionName,
        description: "",
        error: "Premise description cannot be empty.",
      })
    }
    const { error: insertError } = await supabase.from("premises").insert({
      premise: premise,
      user_id: user.id,
    })
    if (insertError) {
      console.error("Error adding premise:", insertError)
      return fail(500, {
        action: actionName,
        premise,
        error: `Database error: ${(insertError as { message: string }).message}`,
      })
    }
    return {
      success: true,
      action: actionName,
      type: "premise",
      message: "Premise added.",
    } // <<< Added action
  },
  updatePremise: async ({ request, locals: { supabase, user } }) => {
    const actionName = "updatePremise" // <<< Define action name
    if (!user) return fail(401, { action: actionName, message: "Unauthorized" })
    const formData = await request.formData()
    const id = formData.get("id")?.toString()
    const premise = formData.get("premise")?.toString()?.trim()
    if (!id)
      return fail(400, {
        action: actionName,
        error: "Premise ID missing.",
      })
    if (!premise)
      return fail(400, {
        action: actionName,
        id,
        error: "Premise description cannot be empty.",
      })
    const { error: updateError } = await supabase
      .from("premises")
      .update({ premise: premise })
      .eq("id", id)
    if (updateError) {
      console.error("Error updating premise:", updateError)
      return fail(500, {
        action: actionName,
        id,
        error: `Database error: ${updateError.message}`,
      })
    }
    return {
      success: true,
      action: actionName,
      type: "premise",
      message: "Premise updated.",
    } // <<< Added action
  },
  deletePremise: async ({ request, locals: { supabase, user } }) => {
    const actionName = "deletePremise" // <<< Define action name
    if (!user) return fail(401, { action: actionName, message: "Unauthorized" })
    const formData = await request.formData()
    const id = formData.get("id")?.toString()
    if (!id)
      return fail(400, {
        action: actionName,
        error: "Premise ID missing.",
      })
    const { error: deleteError } = await supabase
      .from("premises")
      .delete()
      .eq("id", id)
    if (deleteError) {
      console.error("Error deleting premise:", deleteError)
      return fail(500, {
        action: actionName,
        id,
        error: `Database error: ${deleteError.message}`,
      })
    }
    return {
      success: true,
      action: actionName,
      type: "premise",
      deletedId: id,
      message: "Premise deleted.",
    } // <<< Added action
  },
}
