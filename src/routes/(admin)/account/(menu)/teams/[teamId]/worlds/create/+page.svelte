<!-- src/routes/(admin)/account/(menu)/teams/[teamId]/worlds/create/+page.svelte -->
<script lang="ts">
  import { enhance } from "$app/forms"
  import type { ActionData, PageData } from "./$types"

  const { form } = $props<{ data: PageData; form: ActionData }>()
  let currentForm = $state<ActionData>(null)

  $effect(() => {
    currentForm = form
  })
</script>

<svelte:head>
  <title>Create a New World</title>
</svelte:head>

<section>
  <h2 class="text-2xl font-semibold mb-4 border-b pb-2">Create a New World</h2>

  <form method="POST" action="?/createWorld" use:enhance class="max-w-lg">
    <div class="form-control">
      <label for="name" class="label">
        <span class="label-text">World Name</span>
      </label>
      <input
        type="text"
        id="name"
        name="name"
        class="input input-bordered w-full"
        required
      />
    </div>
    <div class="form-control mt-4">
      <label for="description" class="label">
        <span class="label-text">Description (Optional)</span>
      </label>
      <textarea
        id="description"
        name="description"
        class="textarea textarea-bordered w-full"
        rows="4"
      ></textarea>
    </div>
    <button type="submit" class="btn btn-primary mt-6">Create World</button>
    {#if currentForm?.error}
      <p class="text-error text-sm mt-2">{currentForm.error}</p>
    {/if}
  </form>
</section>
