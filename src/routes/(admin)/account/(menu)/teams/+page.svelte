<script lang="ts">
  import type { PageData } from "./$types"
  import { enhance } from "$app/forms"

  export let data: PageData
</script>

<div class="space-y-6">
  <div>
    <h2 class="text-2xl font-semibold">Your Teams</h2>
    {#if data.user_teams_with_details && data.user_teams_with_details.length > 0}
      <ul class="mt-4 space-y-4">
        {#each data.user_teams_with_details as team_detail}
          <li class="p-4 border rounded-md">
            <div class="flex justify-between items-center">
              <a
                href="/account/teams/{team_detail.team_id}"
                class="flex-grow hover:underline"
              >
                <div>
                  <p class="font-bold">{team_detail.team_name}</p>
                  <p class="text-sm text-gray-500">
                    Role: {team_detail.user_role}
                  </p>
                </div>
              </a>
              {#if team_detail.user_role === "owner"}
                <div class="flex gap-2 flex-shrink-0">
                  <a
                    href="/account/teams/{team_detail.team_id}/edit"
                    class="btn btn-sm"
                  >
                    Edit
                  </a>
                  <form
                    method="POST"
                    action="?/deleteTeam"
                    use:enhance={() => {
                      return async ({ result }) => {
                        if (result.type === "success") {
                          // Optionally refresh data or remove item from UI
                        }
                      }
                    }}
                  >
                    <input
                      type="hidden"
                      name="team_id"
                      value={team_detail.team_id}
                    />
                    <button type="submit" class="btn btn-sm btn-error"
                      >Delete</button
                    >
                  </form>
                </div>
              {/if}
            </div>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="mt-4">You are not a part of any teams yet.</p>
    {/if}
  </div>

  <div>
    <h2 class="text-2xl font-semibold">Pending Invitations</h2>
    {#if data.invitations && data.invitations.length > 0}
      <ul class="mt-4 space-y-4">
        {#each data.invitations as invitation}
          <li class="p-4 border rounded-md">
            <div class="flex justify-between items-center">
              <p>
                You have been invited to join a team.
                <span class="font-semibold"
                  >(Role: {invitation.role || "Not specified"})</span
                >
              </p>
              <div class="flex gap-2">
                <form
                  method="POST"
                  action="?/acceptInvite"
                  use:enhance={() => {
                    return async ({ result }) => {
                      if (result.type === "success") {
                        // Refresh page or handle UI update
                      }
                    }
                  }}
                >
                  <input type="hidden" name="token" value={invitation.token} />
                  <button type="submit" class="btn btn-sm btn-primary"
                    >Accept</button
                  >
                </form>
                <form
                  method="POST"
                  action="?/declineInvite"
                  use:enhance={() => {
                    return async ({ result }) => {
                      if (result.type === "success") {
                        // Refresh page or handle UI update
                      }
                    }
                  }}
                >
                  <input type="hidden" name="token" value={invitation.token} />
                  <button type="submit" class="btn btn-sm">Decline</button>
                </form>
              </div>
            </div>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="mt-4">You have no pending invitations.</p>
    {/if}
  </div>
</div>
