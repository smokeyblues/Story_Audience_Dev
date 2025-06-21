<script lang="ts">
  // src/routes/(admin)/account/(menu)/premises/[premiseId]/+page.svelte

  import type { PageData } from "../$types"
  import { page } from "$app/stores"
  let { data }: { data: PageData } = $props()
  let premises = $derived(data.premises ?? [])
  let items = $derived([...(data.wishListItems ?? [])])
  let premise = $derived(premises.find((p) => p.id === $page.params.premiseId))
  let selectedItems = $state<string[]>([])
  function handleSubmit() {
    console.log(selectedItems)
  }
</script>

<div class="container mx-auto">
  <h1 class="text-2xl font-bold">Premise</h1>
  <p class="text-lg">
    {premise?.premise ?? "No premise found"}
  </p>
  <fieldset
    class="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4"
  >
    <legend class="fieldset-legend">Add Wish List Items</legend>
    {#each items as item}
      <label class="label">
        <input
          type="checkbox"
          class="checkbox"
          bind:group={selectedItems}
          value={item.description}
        />
        {item.description}
      </label>
    {/each}
  </fieldset>
  <button class="btn btn-primary" onclick={handleSubmit}>Submit</button>
</div>
