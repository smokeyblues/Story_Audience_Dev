<script lang="ts">
  import { enhance } from "$app/forms"
  import type { PageData, ActionData } from "./$types"
  import { onMount } from "svelte"
  import { page } from "$app/stores" // Import the page store to check for load errors

  export let data: PageData
  export let form: ActionData

  // Reactive state derived from props
  $: spark = form?.spark ?? data.spark

  let isSaving = false
  let showSuccessMessage = false
  let successMessageTimeout: number

  $: if (form?.success) {
    showSuccessMessage = true
    clearTimeout(successMessageTimeout)
    successMessageTimeout = window.setTimeout(() => {
      showSuccessMessage = false
    }, 3000)
  }

  onMount(() => {
    return () => clearTimeout(successMessageTimeout)
  })
</script>

<svelte:head>
  <title>Edit Story Spark</title>
</svelte:head>

<div class="container mx-auto p-4 md:p-8">
  <h1 class="text-3xl font-bold mb-6">Edit Story Spark</h1>

  <!-- FIX 3: Corrected conditional rendering logic -->
  {#if spark}
    <form
      method="POST"
      action="?/updateSpark"
      use:enhance={() => {
        isSaving = true
        showSuccessMessage = false

        return async ({ update, result }) => {
          // Prevent the form from being reset automatically,
          // and rely on the data returned from the action.
          if (result.type === "success") {
            await update({ reset: false })
          } else {
            // For other cases, just update
            await update()
          }

          isSaving = false
        }
      }}
      class="space-y-6"
    >
      <!-- Title -->
      <div>
        <label for="title" class="block font-semibold mb-1">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          class="input input-bordered w-full"
          value={spark.title[0] ?? ""}
          required
        />
      </div>

      <!-- Logline -->
      <div>
        <label for="logline" class="block font-semibold mb-1">Logline</label>
        <textarea
          id="logline"
          name="logline"
          class="textarea textarea-bordered w-full"
          rows="3"
          required>{spark.logline}</textarea
        >
      </div>

      <!-- Other fields follow the same pattern... -->
      <div>
        <label for="comparisons" class="block font-semibold mb-1"
          >Comparisons</label
        >
        <input
          type="text"
          id="comparisons"
          name="comparisons"
          class="input input-bordered w-full"
          value={spark.comparisons}
          required
        />
      </div>

      <h2 class="text-2xl font-bold pt-4 border-t mt-8">Hero Profile</h2>
      <div>
        <label for="hero_name" class="block font-semibold mb-1">Name</label>
        <input
          type="text"
          id="hero_name"
          name="hero_name"
          class="input input-bordered w-full"
          value={spark.hero_name}
          required
        />
      </div>
      <div>
        <label for="hero_description" class="block font-semibold mb-1"
          >Description</label
        >
        <textarea
          id="hero_description"
          name="hero_description"
          class="textarea textarea-bordered w-full"
          rows="3"
          required>{spark.hero_description}</textarea
        >
      </div>
      <div>
        <label for="hero_save_the_cat_moment" class="block font-semibold mb-1"
          >Save the Cat Moment</label
        >
        <textarea
          id="hero_save_the_cat_moment"
          name="hero_save_the_cat_moment"
          class="textarea textarea-bordered w-full"
          rows="3"
          required>{spark.hero_save_the_cat_moment}</textarea
        >
      </div>

      <h2 class="text-2xl font-bold pt-4 border-t mt-8">Core Story Elements</h2>
      <div>
        <label for="story_engine" class="block font-semibold mb-1"
          >Story Engine</label
        >
        <textarea
          id="story_engine"
          name="story_engine"
          class="textarea textarea-bordered w-full"
          rows="4"
          required>{spark.story_engine}</textarea
        >
      </div>
      <div>
        <label for="thematic_premise" class="block font-semibold mb-1"
          >Thematic Premise</label
        >
        <textarea
          id="thematic_premise"
          name="thematic_premise"
          class="textarea textarea-bordered w-full"
          rows="3"
          required>{spark.thematic_premise}</textarea
        >
      </div>

      <h2 class="text-2xl font-bold pt-4 border-t mt-8">Story Roadmap</h2>
      <div class="space-y-4">
        {#each spark.story_roadmap as step, i}
          <div>
            <label for="roadmap-step-{i + 1}" class="block font-semibold mb-1"
              >Step {i + 1}</label
            >
            <textarea
              id="roadmap-step-{i + 1}"
              name="story_roadmap"
              class="textarea textarea-bordered w-full"
              rows="3">{step}</textarea
            >
          </div>
        {/each}
      </div>

      <div class="flex items-center gap-4 pt-4">
        <button
          type="submit"
          class="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded"
          disabled={isSaving}
        >
          {#if isSaving}
            <span class="loading loading-spinner"></span>
            Saving...
          {:else}
            Save Changes
          {/if}
        </button>

        <!-- Feedback for ACTION failures (this part is correct) -->
        {#if form?.error}
          <div class="alert alert-error">
            <span>Error: {form.error}</span>
          </div>
        {/if}

        {#if showSuccessMessage}
          <div class="alert alert-success">
            <span>Story Spark saved successfully!</span>
          </div>
        {/if}
      </div>
    </form>
  {:else}
    <!-- This block now correctly handles cases where `load` failed -->
    <div class="alert alert-error">
      <!-- $page.error contains the object from fail() in `load` -->
      <p>
        {$page.error?.message ??
          "Could not load the story spark. It may not exist or an error occurred."}
      </p>
    </div>
  {/if}
</div>
