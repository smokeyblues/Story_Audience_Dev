import { fail, redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
  if (!user) {
    redirect(303, "/login") // Or your specific login path
  }

  const wishListPromise = supabase
    .from("wish_list_items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  // Run all data fetching in parallel
  const [{ data: wishListItems, error: wishListItemsError }] =
    await Promise.all([wishListPromise])

  // Check for critical errors (e.g., if RLS denied access unexpectedly)
  // Individual sections might fail gracefully, but log errors.
  if (wishListItemsError)
    console.error("Error loading wish list items:", wishListItemsError.message)

  return {
    // Ensure we pass back null or data, never undefined for treatment
    wishListItems: wishListItems ?? [],
  }
}

export const actions: Actions = {
  addWishListItem: async ({ request, locals: { supabase, user } }) => {
    const actionName = "addWishListItem" // <<< Define action name
    if (!user) return fail(401, { action: actionName, message: "Unauthorized" })
    const formData = await request.formData()
    const description = formData.get("description")?.toString()?.trim()
    if (!description) {
      return fail(400, {
        action: actionName,
        description: "",
        error: "Wish list item description cannot be empty.",
      })
    }
    const { error: insertError } = await supabase
      .from("wish_list_items")
      .insert({
        description: description,
        user_id: user.id,
      })
    if (insertError) {
      console.error("Error adding wish list item:", insertError)
      return fail(500, {
        action: actionName,
        description,
        error: `Database error: ${(insertError as { message: string }).message}`,
      })
    }
    return {
      success: true,
      action: actionName,
      type: "wishListItem",
      message: "Wish list item added.",
    } // <<< Added action
  },
  updateWishListItem: async ({ request, locals: { supabase, user } }) => {
    const actionName = "updateWishListItem" // <<< Define action name
    if (!user) return fail(401, { action: actionName, message: "Unauthorized" })
    const formData = await request.formData()
    const id = formData.get("id")?.toString()
    const description = formData.get("description")?.toString()?.trim()
    if (!id)
      return fail(400, {
        action: actionName,
        error: "Wish list item ID missing.",
      })
    if (!description)
      return fail(400, {
        action: actionName,
        id,
        error: "Wish list item description cannot be empty.",
      })
    const { error: updateError } = await supabase
      .from("wish_list_items")
      .update({ description: description })
      .eq("id", id)
    if (updateError) {
      console.error("Error updating wish list item:", updateError)
      return fail(500, {
        action: actionName,
        id,
        error: `Database error: ${updateError.message}`,
      })
    }
    return {
      success: true,
      action: actionName,
      type: "wishListItem",
      message: "Wish list item updated.",
    } // <<< Added action
  },
  deleteWishListItem: async ({ request, locals: { supabase, user } }) => {
    const actionName = "deleteWishListItem" // <<< Define action name
    if (!user) return fail(401, { action: actionName, message: "Unauthorized" })
    const formData = await request.formData()
    const id = formData.get("id")?.toString()
    if (!id)
      return fail(400, {
        action: actionName,
        error: "Wish list item ID missing.",
      })
    const { error: deleteError } = await supabase
      .from("wish_list_items")
      .delete()
      .eq("id", id)
    if (deleteError) {
      console.error("Error deleting wish list item:", deleteError)
      return fail(500, {
        action: actionName,
        id,
        error: `Database error: ${deleteError.message}`,
      })
    }
    return {
      success: true,
      action: actionName,
      type: "wishListItem",
      deletedId: id,
      message: "Wish list item deleted.",
    } // <<< Added action
  },
}
