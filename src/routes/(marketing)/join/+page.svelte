<script lang="ts">
  import { enhance } from "$app/forms"
  import type { ActionData } from "./$types"

  export let form: ActionData
</script>

<svelte:head>
  <title>Join the Adventure - Nanowrit Labs</title>
  <meta
    name="description"
    content="Sign up for early access to Nanowrit Labs, the operating system for modern storytellers."
  />
</svelte:head>

<div class="hero min-h-[70vh] bg-base-200">
  <div class="hero-content text-center">
    <div class="max-w-md">
      {#if form?.success}
        <h1 class="text-4xl font-bold text-primary">You're on the list!</h1>
        <p class="py-6 text-lg">
          Thank you for joining the adventure. We've sent a confirmation to your
          email. We can't wait to share what we're building with you.
        </p>
        <a href="/" class="btn btn-primary">Return Home</a>
      {:else}
        <h1 class="text-4xl font-bold">The Adventure Begins Soon</h1>
        <p class="py-6 text-lg">
          Be the first to get access to Nanowrit Labs. Join our private beta
          waitlist and help shape the future of transmedia storytelling.
        </p>

        <form method="POST" use:enhance class="card-body p-0">
          <div class="form-control">
            <label class="label" for="full_name">
              <span class="label-text">Your Name</span>
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              placeholder="e.g., Alex"
              class="input input-bordered"
              value={form?.fullName ?? ""}
              required
            />
          </div>
          <div class="form-control">
            <label class="label" for="email">
              <span class="label-text">Email Address</span>
            </label>
            <input
              type="email"
              id="email"
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
  </div>
</div>
