<script lang="ts">
  import { enhance } from "$app/forms"
  import { page } from "$app/stores"
  import { invalidateAll } from "$app/navigation"
  import type { PageData, ActionData } from "./$types"
  import EditableListItem from "$lib/components/EditableListItem.svelte"

  let { data }: { data: PageData } = $props()

  const form = $derived(($page as { form: ActionData }).form)

  // This reactive assignment ensures the list updates when data changes
  let plotPoints = $derived(data.plotPoints ?? [])

  // When any form is successful, refresh the data and handle form-specific logic
  let addForm: HTMLFormElement
  $effect(() => {
    if (form?.success) {
      // Invalidate all data to refetch the list from the server
      invalidateAll()

      // Only reset the 'add' form if that was the successful action
      if (form.action === "addPlotPoint") {
        addForm?.reset()
      }
    }
  })
</script>

<section>
  <h2 class="text-2xl font-semibold mb-4 border-b pb-2">Plot Points</h2>
  <p class="text-sm text-base-content/70 mb-4">
    List the key story-centric beats, events, or user actions in the intended
    sequence.
  </p>

  <div class="space-y-3 mb-6">
    {#if plotPoints.length > 0}
      {#each plotPoints as point (point.id)}
        <EditableListItem
          item={point}
          field="description"
          updateAction="?/updatePlotPoint"
          deleteAction="?/deletePlotPoint"
        />
      {/each}
    {:else}
      <p class="text-base-content/60 italic">No plot points added yet.</p>
    {/if}
  </div>

  <form
    method="POST"
    action="?/addPlotPoint"
    use:enhance
    bind:this={addForm}
    class="flex items-start gap-2"
  >
    <textarea
      name="description"
      class="textarea textarea-bordered w-full max-w-lg"
      placeholder="New plot point description..."
      required
      rows="2"
    ></textarea>
    <button type="submit" class="btn btn-secondary">Add Point</button>
  </form>

  {#if form?.action === "addPlotPoint"}
    {#if form?.success}
      <p class="text-success text-sm mt-1">{form.message}</p>
    {/if}
    {#if form?.error}
      <p class="text-error text-sm mt-1">{form.error}</p>
    {/if}
  {/if}
</section>
