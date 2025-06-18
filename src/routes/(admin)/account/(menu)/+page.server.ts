import { fail, redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
  if (!user) {
    redirect(303, "/login") // Or your specific login path
  }

  // Verify project access using the RLS helper function implicitly via queries
  // Fetching the core treatment data - RLS ensures user has access

  const wishListPromise = supabase
    .from("wish_list_items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  const premisesPromise = supabase
    .from("premises")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  // Run all data fetching in parallel
  const [
    { data: wishListItems, error: wishListItemsError },
    { data: premises, error: premisesError },
  ] = await Promise.all([wishListPromise, premisesPromise])

  // Check for critical errors (e.g., if RLS denied access unexpectedly)
  // Individual sections might fail gracefully, but log errors.
  if (wishListItemsError) {
    console.error("Error loading wish list items:", wishListItemsError.message)
  }
  if (premisesError) {
    console.error("Error loading premises:", premisesError.message)
  }

  return {
    wishListItems: wishListItems ?? [],
    premises: premises ?? [],
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
        error: "Plot point description cannot be empty.",
      })
    }
    const { count, error: countError } = await supabase
      .from("wish_list_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
    if (countError) {
      console.error("Error counting plot points:", countError)
      return fail(500, {
        action: actionName,
        description,
        error: "Database error determining order.",
      })
    }
    const { error: insertError } = await supabase
      .from("wish_list_items")
      .insert({
        user_id: user.id,
        description: description,
        order_index: count ?? 0,
      })
    if (insertError) {
      console.error("Error adding wish list item:", insertError)
      return fail(500, {
        action: actionName,
        description,
        error: `Database error: ${insertError.message}`,
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
