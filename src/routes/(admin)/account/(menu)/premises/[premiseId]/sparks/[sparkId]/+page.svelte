<script lang="ts">
  import type { ActionData, PageData } from "./$types"
  import { enhance } from "$app/forms"

  let { data, form }: { data: PageData; form: ActionData } = $props()

  // Use a reactive state variable for the spark data to allow editing
  let spark = $state(JSON.parse(JSON.stringify(data.spark)))

  let isSaving = $state(false)
  let saveError = $state<string | null>(null)
  let saveSuccess = $state(false)

  // Effect to handle form submission results
  $effect(() => {
    if (form) {
      isSaving = false
      if (form.success) {
        saveSuccess = true
        saveError = null
        // Optionally reset form state after a delay
        setTimeout(() => (saveSuccess = false), 3000)
      } else if (form.error) {
        saveError = form.error
        saveSuccess = false
      }
    }
  })
</script>

<div class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-6">Edit Story Spark</h1>

  {#if spark}
    <form
      method="POST"
      action="?/updateSpark"
      use:enhance={() => {
        isSaving = true
        saveSuccess = false
        saveError = null
        return async () => {
          // This will be handled by the $effect on `form`
        }
      }}
    >
      <div class="space-y-6">
        <!-- Title -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">Title</h3>
            <input
              type="text"
              name="title"
              class="input input-bordered w-full"
              bind:value={spark.title[0]}
            />
          </div>
        </div>

        <!-- Logline -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">Logline</h3>
            <textarea
              name="logline"
              class="textarea textarea-bordered w-full"
              bind:value={spark.logline}
              rows={3}
            ></textarea>
          </div>
        </div>

        <!-- Comparisons -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">Comparisons</h3>
            <input
              type="text"
              name="comparisons"
              class="input input-bordered w-full"
              bind:value={spark.comparisons}
            />
          </div>
        </div>

        <!-- Hero Profile -->
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
                name="hero_name"
                class="input input-bordered w-full"
                bind:value={spark.hero_name}
              />
            </div>
            <div class="form-control mt-4">
              <label class="label" for="heroDescription">
                <span class="label-text">Description</span>
              </label>
              <textarea
                id="heroDescription"
                name="hero_description"
                class="textarea textarea-bordered w-full"
                bind:value={spark.hero_description}
                rows={4}
              ></textarea>
            </div>
            <div class="form-control mt-4">
              <label class="label" for="heroSaveTheCat">
                <span class="label-text">Save the Cat Moment</span>
              </label>
              <textarea
                id="heroSaveTheCat"
                name="hero_save_the_cat_moment"
                class="textarea textarea-bordered w-full"
                bind:value={spark.hero_save_the_cat_moment}
                rows={3}
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Story Engine -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">Story Engine</h3>
            <textarea
              name="story_engine"
              class="textarea textarea-bordered w-full"
              bind:value={spark.story_engine}
              rows={3}
            ></textarea>
          </div>
        </div>

        <!-- Thematic Premise -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">Thematic Premise</h3>
            <textarea
              name="thematic_premise"
              class="textarea textarea-bordered w-full"
              bind:value={spark.thematic_premise}
              rows={2}
            ></textarea>
          </div>
        </div>

        <!-- Story Roadmap -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">Story Roadmap</h3>
            <ol class="list-decimal space-y-2 pl-5">
              <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
              {#each spark.story_roadmap as _, i}
                <li>
                  <input
                    type="text"
                    name="story_roadmap"
                    class="input input-bordered w-full"
                    bind:value={spark.story_roadmap[i]}
                  />
                </li>
              {/each}
            </ol>
          </div>
        </div>

        <button type="submit" class="btn btn-primary mt-4" disabled={isSaving}>
          {#if isSaving}
            <span class="loading loading-spinner"></span>
            Saving...
          {:else}
            Save Changes
          {/if}
        </button>
      </div>
    </form>

    {#if saveError}
      <div class="alert alert-error mt-4">
        <span>{saveError}</span>
      </div>
    {/if}

    {#if saveSuccess}
      <div class="alert alert-success mt-4">
        <span>Story Spark saved successfully!</span>
      </div>
    {/if}
  {:else}
    <p>Loading story spark...</p>
  {/if}
</div>
