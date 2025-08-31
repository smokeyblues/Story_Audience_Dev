<script lang="ts">
  import { enhance } from "$app/forms"
  import { onMount } from "svelte"
  import type { ActionData } from "../../routes/(marketing)/join/$types"

  let form: ActionData | null = null
  let dialog: HTMLDialogElement

  onMount(() => {
    const modalShown = sessionStorage.getItem("waitlistModalShown")
    if (!modalShown) {
      setTimeout(() => {
        dialog.showModal()
        sessionStorage.setItem("waitlistModalShown", "true")
      }, 3000) // Delay modal by 3 seconds
    }
  })

  function closeModal() {
    dialog.close()
  }
</script>

<dialog bind:this={dialog} class="modal">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >✕</button
      >
    </form>
    {#if form?.success}
      <h3 class="font-bold text-2xl text-primary">You're on the list!</h3>
      <p class="py-4 text-lg">
        Thank you for joining the adventure. We've sent a confirmation to your
        email. We can't wait to share what we're building with you.
      </p>
      <div class="modal-action">
        <button class="btn btn-primary" on:click={closeModal}>Got it!</button>
      </div>
    {:else}
      <h3 class="font-bold text-2xl">
        Your Journey From Creator to Producer Starts Here.
      </h3>
      <p class="py-4 text-lg">
        Your journey from creator to producer starts here. Join the Nanowrit
        Labs waitlist for early access to our story development platform and an
        inside track on our producer services. Let's get your project made.
      </p>
      <form
        method="POST"
        action="/join"
        use:enhance={() => {
          return async ({ result }) => {
            if (
              (result.type === "success" || result.type === "failure") &&
              result.data
            ) {
              form = result.data as ActionData
            }
          }
        }}
        class="card-body p-0"
      >
        <div class="form-control">
          <label class="label" for="full_name_modal">
            <span class="label-text">Your Name</span>
          </label>
          <input
            type="text"
            id="full_name_modal"
            name="full_name"
            placeholder="e.g., Alex"
            class="input input-bordered"
            value={form?.fullName ?? ""}
            required
          />
        </div>
        <div class="form-control">
          <label class="label" for="email_modal">
            <span class="label-text">Email Address</span>
          </label>
          <input
            type="email"
            id="email_modal"
            name="email"
            placeholder="alex@example.com"
            class="input input-bordered {form?.error ? 'input-error' : ''}"
            value={form?.email ?? ""}
            required
          />
        </div>

        {#if form?.error}
          <p class="text-error text-sm mt-2">{form.error}</p>
        {/if}

        <div class="form-control mt-6">
          <button class="btn btn-primary">Request My Invitation</button>
        </div>
      </form>
    {/if}
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
