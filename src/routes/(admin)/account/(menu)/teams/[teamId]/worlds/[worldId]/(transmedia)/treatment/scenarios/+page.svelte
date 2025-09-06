<script lang="ts">
  import { enhance } from "$app/forms"
  import { invalidateAll } from "$app/navigation"
  import { page } from "$app/stores"
  import type { ActionData, PageData } from "./$types"
  import EditableListItem from "$lib/components/EditableListItem.svelte"

  let { data }: { data: PageData } = $props()
  let scenarios = $derived(data.scenarios ?? [])

  const form = $derived(($page as { form: ActionData }).form)

  $effect(() => {
    // This effect runs after any successful form action on this page
    if (
      form?.success ||
      form?.action === "deleteScenario" ||
      form?.action === "updateScenario"
    ) {
      // invalidateAll tells SvelteKit to re-run the `load` function, refreshing the data
      invalidateAll()

      // If the action was 'addScenario', clear the form's textarea
      if (form.action === "addScenario") {
        const textarea = document.querySelector(
          'textarea[name="description"]',
        ) as HTMLTextAreaElement
        if (textarea) {
          textarea.value = ""
        }
      }
    }
  })
</script>

<section>
  <h2 class="text-2xl font-semibold mb-4 border-b pb-2">
    User-Centric Scenarios
  </h2>
  <p class="text-sm mb-4">
    Describe hypothetical user journeys through your story world, highlighting
    their motivations and points of entry.
  </p>

  <div class="space-y-3 mb-6">
    {#each scenarios as scenario (scenario.id)}
      <EditableListItem
        item={scenario}
        field="description"
        updateAction="?/updateScenario"
        deleteAction="?/deleteScenario"
        textAreaRows={3}
      />
    {/each}
  </div>

  <form
    method="POST"
    action="?/addScenario"
    use:enhance
    class="flex items-start gap-2"
  >
    <textarea
      name="description"
      class="textarea textarea-bordered w-full max-w-lg"
      placeholder="Describe a new user scenario..."
      required
      rows="3"
    ></textarea>
    <button type="submit" class="btn btn-secondary">Add Scenario</button>
  </form>

  {#if form?.error}
    <p class="text-error text-sm mt-1">{form.error}</p>
  {/if}
</section>
