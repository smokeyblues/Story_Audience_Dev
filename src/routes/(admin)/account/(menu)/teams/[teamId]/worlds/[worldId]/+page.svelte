<!-- src/routes/(admin)/account/(menu)/teams/[teamId]/worlds/[worldId]/+page.svelte -->
<script lang="ts">
  import { enhance } from "$app/forms"
  import { invalidateAll } from "$app/navigation"
  import type { ActionData, PageData } from "./$types"

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const props = $props<{ data: PageData; form: ActionData }>()
  let world = $derived(props.data.world)
  let elements = $derived(props.data.elements)

  let editingWorld = $state(false)
  let worldName = $state("")
  let worldDescription = $state("")

  let currentForm = $state<ActionData>(null)

  $effect(() => {
    currentForm = props.form
    if (props.form?.success) {
      if (props.form.action === "updateWorld") {
        editingWorld = false
      }
      invalidateAll()
      const timer = setTimeout(() => {
        currentForm = null
      }, 3000)
      return () => clearTimeout(timer)
    }
  })

  function startEditing() {
    if (world) {
      worldName = world.name
      worldDescription = world.description ?? ""
      editingWorld = true
    }
  }

  function confirmDelete(event: SubmitEvent) {
    if (
      !world ||
      !window.confirm(
        `Are you sure you want to delete the world "${world.name}"? This action is permanent.`,
      )
    ) {
      event.preventDefault()
    }
  }
</script>

<svelte:head>
  <title>World: {world?.name ?? "Loading..."}</title>
</svelte:head>

{#if world}
  <section class="space-y-6">
    {#if editingWorld}
      <form
        method="POST"
        action="?/updateWorld"
        use:enhance
        class="p-4 border rounded-lg bg-base-200"
      >
        <div class="form-control">
          <label for="name" class="label">
            <span class="label-text">World Name</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            bind:value={worldName}
            class="input input-bordered"
          />
        </div>
        <div class="form-control mt-2">
          <label for="description" class="label">
            <span class="label-text">Description</span>
          </label>
          <textarea
            id="description"
            name="description"
            bind:value={worldDescription}
            class="textarea textarea-bordered"
            rows="3"
          ></textarea>
        </div>
        <div class="mt-4 space-x-2">
          <button type="submit" class="btn btn-primary">Save Changes</button>
          <button
            type="button"
            class="btn btn-ghost"
            onclick={() => (editingWorld = false)}>Cancel</button
          >
        </div>
        {#if currentForm?.action === "updateWorld" && currentForm?.error}
          <p class="text-error text-sm mt-2">{currentForm.error}</p>
        {/if}
      </form>
    {:else}
      <div class="flex justify-between items-start">
        <div>
          <h2 class="text-3xl font-bold">{world.name}</h2>
          <p class="mt-2 text-lg text-gray-600">
            {world.description || "No description provided."}
          </p>
        </div>
        <div class="flex space-x-2">
          <button class="btn btn-sm btn-outline" onclick={startEditing}
            >Edit</button
          >
          <form
            method="POST"
            action="?/deleteWorld"
            use:enhance
            onsubmit={confirmDelete}
          >
            <button type="submit" class="btn btn-sm btn-error btn-outline"
              >Delete</button
            >
          </form>
        </div>
      </div>
    {/if}
  </section>

  <div class="divider my-8"></div>

  <section class="space-y-4">
    <h3 class="text-2xl font-semibold">Elements</h3>

    <form
      method="POST"
      action="?/addElement"
      use:enhance
      class="p-4 border rounded-lg bg-base-200"
    >
      <div class="flex items-end space-x-4">
        <div class="form-control grow">
          <label for="element-name" class="label">
            <span class="label-text">New Element Name</span>
          </label>
          <input
            type="text"
            id="element-name"
            name="name"
            class="input input-bordered w-full"
            required
          />
        </div>
        <div class="form-control">
          <label for="element-type" class="label">
            <span class="label-text">Type</span>
          </label>
          <input
            type="text"
            id="element-type"
            name="type"
            class="input input-bordered"
            required
          />
        </div>
        <button type="submit" class="btn btn-secondary">Add Element</button>
      </div>
      {#if currentForm?.action === "addElement" && currentForm?.error}
        <p class="text-error text-sm mt-2">{currentForm.error}</p>
      {/if}
      {#if currentForm?.action === "addElement" && currentForm?.success}
        <p class="text-success text-sm mt-2">{currentForm.message}</p>
      {/if}
    </form>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {#if elements && elements.length > 0}
        {#each elements as element (element.id)}
          <div class="card bg-base-100 shadow-md">
            <div class="card-body">
              <h4 class="card-title">{element.name}</h4>
              <p
                class="text-sm font-mono bg-gray-200 px-2 py-1 rounded inline-block"
              >
                {element.type}
              </p>
            </div>
          </div>
        {/each}
      {:else}
        <p>No elements have been added to this world yet.</p>
      {/if}
    </div>
  </section>
{:else}
  <p class="text-center text-lg mt-8">
    World not found or you do not have access.
  </p>
{/if}
