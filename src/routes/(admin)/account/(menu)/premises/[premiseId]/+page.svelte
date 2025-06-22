<script lang="ts">
  // src/routes/(admin)/account/(menu)/premises/[premiseId]/+page.svelte

  import type { PageData } from "./$types"
  import { page } from "$app/stores"
  import { supabase } from "$lib/supabaseClient"
  import { goto } from "$app/navigation"

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
  let selectedTitle = $state("")
  let isSaving = $state(false)
  let saveError = $state<string | null>(null)
  let saveSuccess = $state(false)

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
      if (pitchPackage?.title?.length) {
        selectedTitle = pitchPackage.title[0]
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error("Error invoking edge function:", message)
      errorMessage = `Error: ${message}`
    } finally {
      isLoading = false
    }
  }

  async function handleSave() {
    if (!pitchPackage || !selectedTitle || !premise) {
      saveError = "No pitch package data or premise to save."
      return
    }

    isSaving = true
    saveError = null
    saveSuccess = false

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      saveError = "You must be logged in to save."
      isSaving = false
      return
    }

    try {
      const { error } = await supabase.from("story_sparks").insert({
        user_id: user.id,
        premise_id: premise.id,
        title: [selectedTitle],
        logline: pitchPackage.logline,
        comparisons: pitchPackage.comparisons,
        hero_name: pitchPackage.hero_profile.name,
        hero_description: pitchPackage.hero_profile.description,
        hero_save_the_cat_moment: pitchPackage.hero_profile.save_the_cat_moment,
        story_engine: pitchPackage.story_engine,
        thematic_premise: pitchPackage.thematic_premise,
        story_roadmap: pitchPackage.story_roadmap,
      })

      if (error) {
        throw error
      }

      saveSuccess = true
      await goto("/account/premises")
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error("Error saving story spark:", message)
      saveError = `Error: ${message}`
    } finally {
      isSaving = false
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
        <label class="label cursor-pointer items-start">
          <input
            type="checkbox"
            class="checkbox"
            bind:group={selectedItems}
            value={item.description}
          />
          <span class="label-text whitespace-normal break-words"
            >{item.description}</span
          >
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
      <h2 class="text-3xl font-bold">
        {selectedTitle || "Story Spark"} Pitch Package
      </h2>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Title</h3>
          <select class="select select-bordered" bind:value={selectedTitle}>
            {#each pitchPackage.title as title}
              <option value={title}>{title}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Logline</h3>
          <textarea
            class="textarea textarea-bordered w-full"
            bind:value={pitchPackage.logline}
            rows={3}
          ></textarea>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Comparisons</h3>
          <input
            type="text"
            class="input input-bordered w-full"
            bind:value={pitchPackage.comparisons}
          />
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Hero Profile</h3>
          <div class="form-control">
            <label class="label" for="heroName">
              <span class="label-text">Name</span>
            </label>
            <input
              id="heroName"
              type="text"
              class="input input-bordered w-full"
              bind:value={pitchPackage.hero_profile.name}
            />
          </div>
          <div class="form-control">
            <label class="label" for="heroDescription">
              <span class="label-text">Description</span>
            </label>
            <textarea
              id="heroDescription"
              class="textarea textarea-bordered w-full"
              bind:value={pitchPackage.hero_profile.description}
              rows={4}
            ></textarea>
          </div>
          <div class="form-control">
            <label class="label" for="heroSaveTheCat">
              <span class="label-text">Save the Cat Moment</span>
            </label>
            <textarea
              id="heroSaveTheCat"
              class="textarea textarea-bordered w-full"
              bind:value={pitchPackage.hero_profile.save_the_cat_moment}
              rows={3}
            ></textarea>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Story Engine</h3>
          <textarea
            class="textarea textarea-bordered w-full"
            bind:value={pitchPackage.story_engine}
            rows={3}
          ></textarea>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Thematic Premise</h3>
          <textarea
            class="textarea textarea-bordered w-full"
            bind:value={pitchPackage.thematic_premise}
            rows={2}
          ></textarea>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Story Roadmap</h3>
          <ol class="list-decimal space-y-2 pl-5">
            {#each pitchPackage.story_roadmap as step, i}
              <li style="display: none;">{step}</li>
              <li>
                <input
                  type="text"
                  class="input input-bordered w-full"
                  bind:value={pitchPackage.story_roadmap[i]}
                />
              </li>
            {/each}
          </ol>
        </div>
      </div>
      <button
        class="btn btn-secondary mt-4"
        onclick={handleSave}
        disabled={isSaving}
      >
        {#if isSaving}
          <span class="loading loading-spinner"></span>
          Saving...
        {:else}
          Save Story Spark
        {/if}
      </button>
      {#if saveError}
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
            <span>{saveError}</span>
          </div>
        </div>
      {/if}
      {#if saveSuccess}
        <div class="alert alert-success mt-4">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 shrink-0 stroke--current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Story Spark saved successfully!</span>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
