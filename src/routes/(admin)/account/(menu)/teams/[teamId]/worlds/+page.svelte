<!-- src/routes/(admin)/account/(menu)/teams/[teamId]/worlds/+page.svelte -->
<script lang="ts">
  import { enhance } from "$app/forms"
  import { invalidateAll } from "$app/navigation"
  import type { ActionData, PageData } from "./$types"

  let { data, form }: { data: PageData; form: ActionData } = $props()
  let worlds = $derived(data.worlds ?? [])
  let userRole = $derived(data.userRole)
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

<svelte:head>
  <title>Worlds</title>
</svelte:head>

<section>
  <h2 class="text-2xl font-semibold mb-4 border-b pb-2">
    {data.worlds?.[0]?.name || "No World"}
  </h2>

  {#if userRole && ["owner", "admin"].includes(userRole) && !data.worlds?.[0]?.name}
    <form method="POST" action="?/addWorld" use:enhance class="mb-6">
      <div class="form-control">
        <label for="name" class="label">
          <span class="label-text">New World Name</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          class="input input-bordered w-full max-w-xs"
          required
        />
      </div>
      <div class="form-control mt-2">
        <label for="description" class="label">
          <span class="label-text">Description (Optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          class="textarea textarea-bordered w-full max-w-xs"
          rows="2"
        ></textarea>
      </div>
      <button type="submit" class="btn btn-secondary mt-4">Create World</button>
      {#if currentForm?.error}
        <p class="text-error text-sm mt-2">{currentForm.error}</p>
      {/if}
      {#if currentForm?.success}
        <p class="text-success text-sm mt-2">{currentForm.message}</p>
      {/if}
    </form>
  {/if}

  <div class="space-y-3">
    {#if worlds.length > 0}
      {#each worlds as world (world.id)}
        <a
          href="/account/teams/{data.teamId}/worlds/{world.id}"
          class="card bg-base-200 shadow-md hover:shadow-lg transition-shadow block"
        >
          <div class="card-body">
            <h3 class="card-title">{world.name}</h3>
            <p>{world.description || "No description"}</p>
          </div>
        </a>
      {/each}
    {:else}
      <p>This team doesn't have any worlds yet.</p>
    {/if}
  </div>
</section>
