<script lang="ts">
  import { enhance } from "$app/forms"
  import { invalidateAll } from "$app/navigation"
  import type { ActionData, PageData } from "./$types"
  import EditableListItem from "$lib/components/EditableListItem.svelte"
  import type { Tables } from "../../../../../DatabaseDefinitions"

  type PremiseWithSparks = Tables<"premises"> & {
    story_sparks: Tables<"story_sparks">[]
  }

  let { data, form }: { data: PageData; form: ActionData } = $props()
  let premises = $derived((data.premises as PremiseWithSparks[]) ?? [])
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
  <form
    method="POST"
    action="?/addPremise"
    use:enhance
    class="flex items-start gap-2 mb-6"
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
  <div class="space-y-3 mb-6">
    {#each premises as premise (premise.id)}
      <div class="collapse collapse-arrow bg-base-200">
        <input type="radio" name="premise-accordion" />
        <div class="collapse-title text-xl font-medium">
          <div class="flex items-center justify-between">
            <EditableListItem
              item={premise}
              field="premise"
              updateAction="?/updatePremise"
              deleteAction="?/deletePremise"
            />
            {#if premise.story_sparks && premise.story_sparks.length > 0}
              <div class="badge badge-secondary">
                {premise.story_sparks.length} Spark{premise.story_sparks
                  .length > 1
                  ? "s"
                  : ""}
              </div>
            {/if}
          </div>
        </div>
        <div class="collapse-content bg-base-100">
          {#if premise.story_sparks && premise.story_sparks.length > 0}
            <ul class="menu p-2">
              {#each premise.story_sparks as spark}
                <li>
                  <a
                    href={`/account/premises/${premise.id}/sparks/${spark.id}`}
                  >
                    {spark.title[0]}
                  </a>
                </li>
              {/each}
            </ul>
            <div class="p-4 text-center">
              <a
                href={`/account/premises/${premise.id}`}
                class="btn btn-primary">Generate Another</a
              >
            </div>
          {:else}
            <div class="p-4 text-center">
              <p class="mb-4">You don't have any sparks for this premise.</p>
              <a
                href={`/account/premises/${premise.id}`}
                class="btn btn-primary">Generate a Story Spark</a
              >
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</section>
