<!-- src/routes/(admin)/account/(menu)/teams/create/+page.svelte -->
<script lang="ts">
  import { enhance } from "$app/forms"
  import type { ActionData } from "./$types"

  // The 'form' prop is automatically typed by SvelteKit based on the server actions.
  // 'ActionData' represents the data returned from `fail()` and is undefined initially.
  export let form: ActionData

  let teamNameValue = ""

  $: teamNameValue = form?.teamName ?? "" // Update local var if form prop exists and has teamName

  let submitting = false
</script>

<div class="flex justify-center items-start pt-16 min-h-screen bg-base-200">
  <div class="card w-full max-w-md bg-base-100 shadow-xl">
    <div class="card-body">
      <h1 class="card-title text-2xl mb-4">Create a New Team</h1>

      <form
        method="POST"
        use:enhance={() => {
          submitting = true
          return async ({ update }) => {
            await update({ reset: false })
            submitting = false
          }
        }}
      >
        <div class="form-control w-full mb-4">
          <label class="label" for="teamName">
            <span class="label-text">Team Name</span>
          </label>
          <!-- Use ?? to provide default empty string if form or teamName is null/undefined -->
          <input
            type="text"
            id="teamName"
            name="teamName"
            placeholder="e.g., My Awesome Project Team"
            class="input input-bordered w-full {form?.missing || form?.error
              ? 'input-error'
              : ''}"
            aria-invalid={form?.missing || form?.error}
            bind:value={teamNameValue}
            disabled={submitting}
            required
          />
          <!-- Use optional chaining form?.property -->
          {#if form?.missing}
            <label class="label" for="teamName">
              <span class="label-text-alt text-error"
                >Team name cannot be empty.</span
              >
            </label>
          {/if}
          {#if form?.error && form?.message}
            <label class="label" for="teamName">
              <span class="label-text-alt text-error">{form.message}</span>
            </label>
          {/if}
        </div>

        <div class="card-actions justify-end mt-6">
          <a
            href="/account"
            class="btn btn-ghost"
            class:btn-disabled={submitting}>Cancel</a
          >
          <button
            type="submit"
            class="btn btn-primary"
            class:loading={submitting}
            disabled={submitting}
          >
            {#if !submitting}
              Create Team
            {:else}
              Creating...
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
