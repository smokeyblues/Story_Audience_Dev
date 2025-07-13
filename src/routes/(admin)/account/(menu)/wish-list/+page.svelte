<script lang="ts">
  import { enhance } from "$app/forms"
  import { invalidateAll } from "$app/navigation"
  import type { PageData, ActionData } from "./$types"
  import EditableListItem from "$lib/components/EditableListItem.svelte"
  // import type { Database } from "../../../../../DatabaseDefinitions"

  // Use a looser type for form to avoid type errors
  let { data, form }: { data: PageData; form: ActionData } = $props()
  let wishListItems = $derived(data.wishListItems ?? [])
  let currentForm = $state<ActionData>(null)
  $effect(() => {
    currentForm = form
    if (form?.success) {
      invalidateAll()
      const timer = setTimeout(() => {
        currentForm = null
      }, 3000)
      return () => clearTimeout(timer)
    }
  })
</script>

<section>
  <h2 class="text-2xl font-semibold mb-4 border-b pb-2">Wish List</h2>
  <p class="text-sm mb-4">
    List everything you'd love to see in a story (characters, twists, themes,
    genres you're passionate about). Don't filter.
  </p>
  <div class="space-y-3 mb-6">
    {#each wishListItems as item (item.id)}
      <EditableListItem
        {item}
        field="description"
        updateAction="?/updateWishListItem"
        deleteAction="?/deleteWishListItem"
      />
    {/each}
  </div>
  <form
    method="POST"
    action="?/addWishListItem"
    use:enhance
    class="flex items-start gap-2"
  >
    <textarea
      name="description"
      class="textarea textarea-bordered w-full max-w-lg"
      placeholder="New wish list item description..."
      required
      rows="2"
    ></textarea>
    <button type="submit" class="btn btn-secondary">Add Item</button>
  </form>
  {#if currentForm?.action === "addWishListItem" || currentForm?.action === "deleteWishListItem"}
    {#if currentForm?.success}
      <p class="text-success text-sm mt-1">{currentForm.message}</p>
    {/if}
    {#if currentForm?.error}
      <p class="text-error text-sm mt-1">{currentForm.error}</p>
    {/if}
  {/if}
</section>
