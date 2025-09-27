<!-- src/routes/(admin)/account/(menu)/+page.svelte -->
<script lang="ts">
  import type { PageData, ActionData } from "./$types"
  import { enhance } from "$app/forms"
  import { invalidateAll } from "$app/navigation" // Needed to refresh invites list
  // import type { DashboardProject } from "$lib/types"

  let { data, form }: { data: PageData; form: ActionData } = $props()

  // Correctly derive hasTeams using $derived
  let hasTeams = $derived(data.userTeams && data.userTeams.length > 0)

  // $: console.log("userTeams", data.userTeams)
  // $: console.log("Complete data prop in +page.svelte:", data)

  // Reactive statement to filter invites shown based on form actions
  let pendingInvitations = $derived(
    data.pendingInvitations.filter((invite) => {
      // Hide invite if it was just successfully accepted or declined by this user
      if (form?.success && "token" in form && form.token === invite.id) {
        return false // Hide it
      }
      return true // Keep it
    }),
  )

  // Optional: Effect for showing toast messages on success/error
  $effect(() => {
    if (form?.action === "acceptInvite" || form?.action === "declineInvite") {
      if (form?.success) {
        // Show success toast: form.message
        console.log("Invite action success:", form.message)
        invalidateAll() // Ensure data is fresh after action
      } else if (form?.error) {
        // Show error toast: form.error
        console.error("Invite action error:", form.error)
      }
    }
  })
</script>

{#if !hasTeams}
  <!-- EMPTY STATE: User has no teams -->
  <div class="hero min-h-[calc(100vh-theme(spacing.24))] bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <!-- Use profile data from layout -->
        <h1 class="text-5xl font-bold">
          Welcome, {data.profile?.full_name ?? data.user?.email ?? "User"}!
        </h1>
        <p class="py-6">
          Ready to build your universe?
          <br /><br />
          Here we begin with world building, then we create characters that live
          in that world, before finally developing the stories that your characters
          live through in your world.
          <br /><br />
          In Nanowrit Labs, worlds live inside of teams. Create a team for your solo
          work or to collaborate with others.
        </p>
        <a href="/account/teams/create" class="btn btn-primary"
          >Create Your First Team</a
        >
      </div>
    </div>
  </div>
{:else}
  <!-- POPULATED STATE: User has teams -->
  <div class="container mx-auto max-w-4xl p-4 space-y-8">
    <h1 class="text-3xl font-bold mb-6">Dashboard</h1>

    <!-- *** Team Invitations Section - REVERTED DISPLAY *** -->
    {#if pendingInvitations && pendingInvitations.length > 0}
      <section class="space-y-4 p-4 border rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold">Team Invitations</h2>
        <ul class="space-y-3">
          {#each pendingInvitations as invite (invite.id)}
            <li
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-base-100 rounded-md"
            >
              <div>
                <!-- Removed reference to invite.teams.name -->
                You have been invited to join a team as a
                <span class="font-medium">{invite.role}</span>.
                <span class="text-xs text-gray-500 block"
                  >Invited: {new Date(
                    invite.created_at,
                  ).toLocaleDateString()}</span
                >
              </div>
              <div class="flex space-x-2 mt-2 sm:mt-0">
                <!-- Accept Form -->
                <form
                  method="POST"
                  action="?/acceptInvite"
                  use:enhance
                  class="inline-block"
                >
                  <input type="hidden" name="token" value={invite.id} />
                  <button type="submit" class="btn btn-sm btn-success"
                    >Accept</button
                  >
                </form>
                <!-- Decline Form -->
                <form
                  method="POST"
                  action="?/declineInvite"
                  use:enhance
                  class="inline-block"
                >
                  <input type="hidden" name="token" value={invite.token} />
                  <button type="submit" class="btn btn-sm btn-error btn-outline"
                    >Decline</button
                  >
                </form>
              </div>
            </li>
            <!-- Display errors specific to this invite token -->
            {#if form?.error && "token" in form && form.token === invite.token}
              <li class="pl-4 -mt-2">
                <p class="text-error text-sm">{form.error}</p>
              </li>
            {/if}
          {/each}
        </ul>
      </section>
    {/if}
    <!-- *** END: Team Invitations Section *** -->

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">Your Teams</h2>
      <!-- Correctly loop over 'userTeams' -->
      {#each data.userTeams as teamMembership}
        {#if teamMembership.teams}
          <div class="card bg-base-100 shadow-xl mb-4">
            <div class="card-body">
              <h3 class="card-title">{teamMembership.teams.name}</h3>
              <p>Your role: {teamMembership.role}</p>
              <div class="card-actions justify-end">
                {#if teamMembership.teams.worlds && teamMembership.teams.worlds.length > 0}
                  <!-- Team has one or more worlds, link to the first one -->
                  <a
                    href="/account/teams/{teamMembership.teams
                      .id}/worlds/{teamMembership.teams.worlds[0].id}"
                    class="btn btn-primary btn-sm">View World</a
                  >
                {:else}
                  <!-- Team has no worlds, link to create one -->
                  <a
                    href="/account/teams/{teamMembership.teams
                      .id}/worlds/create"
                    class="btn btn-secondary btn-sm">Create World</a
                  >
                {/if}
                <a
                  href="/account/teams/{teamMembership.teams.id}"
                  class="btn btn-ghost btn-sm">View Team</a
                >
              </div>
            </div>
          </div>
        {/if}
      {:else}
        <p>Something went wrong loading your teams.</p>
      {/each}
      <a href="/account/teams/create" class="btn btn-primary">Create New Team</a
      >
    </section>
  </div>
{/if}
