<!-- src/lib/components/EditableListItem.svelte -->
<script lang="ts">
  import { enhance } from "$app/forms"
  // import { createEventDispatcher } from "svelte"
  import type { SubmitFunction } from "@sveltejs/kit"

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type Item = {
    id: string
    description: string
    // Add other fields if needed later, e.g., order_index
  }

  let {
    item,
    field = "description", // default to "description"
    updateAction, // e.g., "?/updatePlotPoint"
    deleteAction, // e.g., "?/deletePlotPoint"
    textAreaRows = 2, // Default rows for textarea
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item: Record<string, any>
    field?: string
    updateAction: string
    deleteAction: string
    textAreaRows?: number
  } = $props()

  let editing = $state(false)
  let editedValue = $state(item[field])
  let isDeleting = $state(false)
  let isSaving = $state(false)
  let formError = $state<string | null>(null)

  // const dispatch = createEventDispatcher()

  function handleEditClick() {
    editedValue = item[field] // Reset on opening edit mode
    editing = true
    formError = null
  }

  function handleCancelClick() {
    editing = false
    formError = null
  }

  // Inside src/lib/components/EditableListItem.svelte

  const handleDelete: SubmitFunction = (opts) => {
    // ---> Destructure cancel directly from the options object <---
    const { cancel } = opts

    // Ask for confirmation FIRST
    if (!window.confirm("Are you sure you want to delete this item?")) {
      // ---> Call cancel() directly if the user clicks "Cancel" <---
      cancel()
      return // Stop execution here if cancelled
    }

    // If confirmed, THEN set loading state and proceed.
    // This part runs *before* the actual fetch request is made by enhance.
    isDeleting = true
    formError = null

    // Now, return the function that will run *after* the submission attempt.
    return async ({ result }) => {
      // This runs once the server action responds.
      isDeleting = false // Reset loading state regardless of outcome
      if (result.type === "failure") {
        formError = result.data?.error ?? "Failed to delete item."
      } else if (result.type === "success") {
        // Optional dispatch
        // dispatch('deleted', { id: item.id });
      }
    }
  }

  // Apply the same pattern to handleUpdate (though it doesn't need cancel())
  const handleUpdate: SubmitFunction = () => {
    // --- Runs BEFORE submission ---
    isSaving = true
    formError = null

    // --- Runs AFTER submission ---
    return async ({ result }) => {
      isSaving = false
      if (result.type === "failure") {
        formError = result.data?.error ?? "Failed to update item."
      } else if (result.type === "success") {
        editing = false // Close edit mode on success
        // Optional dispatch
        // dispatch('updated', { id: item.id, description: editedValue });
      }
    }
  }

  // Reset local state if the item prop itself changes externally
  $effect(() => {
    if (!editing) {
      editedValue = item[field]
    }
  })
</script>

<div class="p-3 bg-base-100 rounded shadow-sm group">
  {#if !editing}
    <div class="flex flex-col md:flex-row justify-between items-start gap-2">
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
      <textarea
        name={field}
        bind:value={editedValue}
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
