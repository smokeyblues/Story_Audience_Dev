<script lang="ts">
  import { enhance } from "$app/forms"
  import { page } from "$app/stores"
  import type { PageData, ActionData } from "./$types"

  let { data }: { data: PageData } = $props()

  // Use the universal $page.form store for form results
  const form = $derived(($page as { form: ActionData }).form)

  // Reactive state for the tagline, initialized from loaded data
  let tagline = $state(data.treatment.tagline ?? "")

  $effect(() => {
    // If the data from the server changes (e.g., after a navigation), update the local state.
    tagline = data.treatment.tagline ?? ""
  })
</script>

<section>
  <h2 class="text-2xl font-semibold mb-4 border-b pb-2">Tagline</h2>
  <p class="text-sm text-base-content/70 mb-4">
    A short, catchy phrase that sums up the story's tone or core conflict.
  </p>

  <form method="POST" action="?/saveTagline" use:enhance>
    <label class="form-control w-full">
      <input
        type="text"
        name="tagline"
        class="input input-bordered w-full"
        placeholder="Enter the project tagline"
        bind:value={tagline}
      />
    </label>

    <div class="mt-3 flex items-center gap-4">
      <button type="submit" class="btn btn-sm btn-primary">Save Tagline</button>

      {#if form?.success}
        <p class="text-success text-sm">{form.message}</p>
      {/if}
      {#if form?.error}
        <p class="text-error text-sm">{form.error}</p>
      {/if}
    </div>
  </form>
</section>
