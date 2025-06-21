<script lang="ts">
  // src/routes/(admin)/account/(menu)/premises/[premiseId]/+page.svelte

  import type { PageData } from "../$types"
  import { page } from "$app/stores"
  import { supabase } from "$lib/supabaseClient"

  interface HeroProfile {
    name: string
    description: string
    save_the_cat_moment: string
  }

  interface PitchPackage {
    title: string[]
    logline: string
    comparisons: string
    hero_profile: HeroProfile
    story_engine: string
    thematic_premise: string
    story_roadmap: string[]
  }

  let { data }: { data: PageData } = $props()
  let premises = $derived(data.premises ?? [])
  let items = $derived([...(data.wishListItems ?? [])])
  let premise = $derived(premises.find((p) => p.id === $page.params.premiseId))
  let selectedItems = $state<string[]>([])
  let pitchPackage = $state<PitchPackage | null>(null)
  let isLoading = $state(false)
  let errorMessage = $state<string | null>(null)

  async function handleSubmit() {
    if (!premise) {
      console.error("No premise selected")
      errorMessage = "No premise selected"
      return
    }

    isLoading = true
    errorMessage = null
    pitchPackage = null

    try {
      const { data: supa, error: supaError } =
        await supabase.functions.invoke<PitchPackage>("generate-spark", {
          body: {
            premiseText: premise.premise,
            wishesText: selectedItems.join(", "),
          },
        })

      if (supaError) {
        throw supaError
      }
      pitchPackage = supa
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error("Error invoking edge function:", message)
      errorMessage = `Error: ${message}`
    } finally {
      isLoading = false
    }
  }
</script>

<div class="container mx-auto">
  <h1 class="text-2xl font-bold">Premise</h1>
  <p class="text-lg">
    {premise?.premise ?? "No premise found"}
  </p>
  <fieldset
    class="fieldset bg-base-100 border-base-300 rounded-box w-full max-w-md border p-4"
  >
    <legend class="fieldset-legend">Add Wish List Items</legend>
    <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {#each items as item}
        <label class="label">
          <input
            type="checkbox"
            class="checkbox"
            bind:group={selectedItems}
            value={item.description}
          />
          <span class="label-text break-words">{item.description}</span>
        </label>
      {/each}
    </div>
  </fieldset>
  <button
    class="btn btn-primary mt-4"
    onclick={handleSubmit}
    disabled={isLoading}
  >
    {#if isLoading}
      <span class="loading loading-spinner"></span>
      Generating...
    {:else}
      Generate Story Spark
    {/if}
  </button>

  {#if errorMessage}
    <div class="alert alert-error mt-4">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path></svg
        >
        <span>{errorMessage}</span>
      </div>
    </div>
  {/if}

  {#if pitchPackage}
    <div class="mt-8 space-y-6">
      <h2 class="text-3xl font-bold">Story Spark Pitch Package</h2>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Titles</h3>
          <ul class="list-disc pl-5">
            {#each pitchPackage.title as title}
              <li>{title}</li>
            {/each}
          </ul>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Logline</h3>
          <p>{pitchPackage.logline}</p>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Comparisons</h3>
          <p>{pitchPackage.comparisons}</p>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">
            Hero Profile: {pitchPackage.hero_profile.name}
          </h3>
          <p>{pitchPackage.hero_profile.description}</p>
          <h4 class="font-bold">Save the Cat Moment:</h4>
          <p>{pitchPackage.hero_profile.save_the_cat_moment}</p>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Story Engine</h3>
          <p>{pitchPackage.story_engine}</p>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Thematic Premise</h3>
          <p>{pitchPackage.thematic_premise}</p>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Story Roadmap</h3>
          <ol class="list-decimal pl-5">
            {#each pitchPackage.story_roadmap as step}
              <li>{step}</li>
            {/each}
          </ol>
        </div>
      </div>
    </div>
  {/if}
</div>
