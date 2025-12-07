<!-- src/lib/components/EditableListItem.svelte -->
<script lang="ts">
  import { enhance } from "$app/forms"
  import type { SubmitFunction } from "@sveltejs/kit"

  // Make the Item type more flexible: it must have an id, but can have any other string properties.
  type Item = {
    id: string
    [key: string]: unknown // string | number | boolean | null | undefined // Index signature for flexibility
  }

  let {
    item,
    field, // The name of the property on the 'item' object to edit (e.g., "description", "premise")
    updateAction,
    deleteAction,
    textAreaRows = 2,
  }: {
    item: Item
    field: string
    updateAction: string
    deleteAction: string
    textAreaRows?: number
  } = $props()

  let editing = $state(false)
  // Use the 'field' prop to dynamically get the initial value
  // svelte-ignore state_referenced_locally
  let editedDescription = $state(item[field])
  let isDeleting = $state(false)
  let isSaving = $state(false)
  let formError = $state<string | null>(null)

  function handleEditClick() {
    // Reset to the current item's value when editing starts
    editedDescription = item[field]
    editing = true
    formError = null
  }

  function handleCancelClick() {
    editing = false
    formError = null
  }

  const handleDelete: SubmitFunction = ({ cancel }) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      cancel()
      return
    }
    isDeleting = true
    formError = null
    return async ({ result }) => {
      isDeleting = false
      if (result.type === "failure") {
        formError = result.data?.error ?? "Failed to delete item."
      }
    }
  }

  const handleUpdate: SubmitFunction = () => {
    isSaving = true
    formError = null
    return async ({ result }) => {
      isSaving = false
      if (result.type === "failure") {
        formError = result.data?.error ?? "Failed to update item."
      } else if (result.type === "success") {
        editing = false
      }
    }
  }

  $effect(() => {
    if (!editing) {
      // Update local state if the external item prop changes
      editedDescription = item[field]
    }
  })
</script>

<div
  class="p-3 bg-base-100 rounded-lg shadow-sm group border border-transparent hover:border-base-300 transition-colors"
>
  {#if !editing}
    <div class="flex flex-col md:flex-row justify-between items-start gap-2">
      <!-- Display the correct field dynamically -->
      <p class="whitespace-pre-wrap flex-1 py-1">{item[field]}</p>
      <div class="flex gap-1 flex-shrink-0 self-end md:self-center">
        <button
          onclick={handleEditClick}
          class="btn btn-xs btn-ghost opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
        >
          Edit
        </button>
        <form
          method="POST"
          action={deleteAction}
          use:enhance={handleDelete}
          class="inline"
        >
          <input type="hidden" name="id" value={item.id} />
          <button
            type="submit"
            class="btn btn-xs btn-ghost text-error opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            disabled={isDeleting}
          >
            {#if isDeleting}Deleting...{:else}Delete{/if}
          </button>
        </form>
      </div>
    </div>
  {:else}
    <form method="POST" action={updateAction} use:enhance={handleUpdate}>
      <input type="hidden" name="id" value={item.id} />
      <!-- The name of the textarea should match the 'field' prop -->
      <textarea
        name={field}
        bind:value={editedDescription}
        class="textarea textarea-bordered w-full mb-2"
        rows={textAreaRows}
        required
      ></textarea>
      {#if formError}<p class="text-error text-xs mb-2">{formError}</p>{/if}
      <div class="flex gap-2">
        <button
          type="submit"
          class="btn btn-xs btn-primary"
          disabled={isSaving}
        >
          {#if isSaving}Saving...{:else}Save{/if}
        </button>
        <button
          type="button"
          onclick={handleCancelClick}
          class="btn btn-xs btn-ghost"
        >
          Cancel
        </button>
      </div>
    </form>
  {/if}
</div>
