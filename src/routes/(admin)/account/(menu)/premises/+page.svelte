<script lang="ts">
  import { enhance } from "$app/forms"
  import { invalidateAll } from "$app/navigation"
  import type { ActionData, PageData } from "../$types"
  import EditableListItem from "$lib/components/EditableListItem.svelte"
  // import type { Database } from "../../../../../DatabaseDefinitions"

  let { data, form }: { data: PageData; form: ActionData } = $props()
  let premises = $derived(data.premises ?? [])
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
  <h2 class="text-2xl font-semibold mb-4 border-b pb-2">Premises</h2>
  <p class="text-sm mb-4">
    List every premise you've ever thought of, each in a single sentence.
  </p>
  <div class="space-y-3 mb-6">
    {#each premises as premise (premise.id)}
      <a href="premises/{premise.id}">
        <EditableListItem
          item={premise}
          field="premise"
          updateAction="?/updatePremise"
          deleteAction="?/deletePremise"
        />
      </a>
    {/each}
  </div>
  <form
    method="POST"
    action="?/addPremise"
    use:enhance
    class="flex items-start gap-2"
  >
    <textarea
      name="premise"
      class="textarea textarea-bordered w-full max-w-lg"
      placeholder="New premise..."
      required
      rows="2"
    ></textarea>
    <button type="submit" class="btn btn-secondary">Add Premise</button>
  </form>
  {#if currentForm?.action === "addPremise" || currentForm?.action === "deletePremise"}
    {#if currentForm?.success}
      <p class="text-success text-sm mt-1">{currentForm.message}</p>
    {/if}
    {#if currentForm?.error}
      <p class="text-error text-sm mt-1">{currentForm.error}</p>
    {/if}
  {/if}
  <div class="my-6">
    <p class="text-sm">Select a premise to get started.</p>
  </div>
</section>
