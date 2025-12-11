<script lang="ts">
  import type { PageData } from "./$types"
  import { enhance } from "$app/forms"

  export let data: PageData

  let deleteModal: HTMLDialogElement
  let teamToDelete: { team_id: string; team_name: string } | null = null
  let confirmationName = ""

  function promptDelete(team: { team_id: string; team_name: string }) {
    teamToDelete = team
    confirmationName = ""
    deleteModal.showModal()
  }
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
                class="grow hover:underline"
              >
                <div>
                  <p class="font-bold">{team_detail.team_name}</p>
                  <p class="text-sm text-gray-500">
                    Role: {team_detail.user_role}
                  </p>
                </div>
              </a>
              {#if team_detail.user_role === "owner"}
                <div class="flex gap-2 shrink-0">
                  <a
                    href="/account/teams/{team_detail.team_id}"
                    class="btn btn-sm"
                  >
                    Edit
                  </a>
                  <button
                    class="btn btn-sm btn-error"
                    on:click={() => promptDelete(team_detail)}
                  >
                    Delete
                  </button>
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
                    return async ({ result, update }) => {
                      if (result.type === "success") {
                        await update()
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
                    return async ({ result, update }) => {
                      if (result.type === "success") {
                        await update()
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

<dialog bind:this={deleteModal} class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Delete Team</h3>
    {#if teamToDelete}
      <p class="py-4">
        Are you sure you want to delete <span class="font-bold"
          >{teamToDelete.team_name}</span
        >? This action cannot be undone.
      </p>
      <p class="mb-4 text-sm">
        Please type <span class="font-mono bg-base-200 px-1 rounded"
          >{teamToDelete.team_name}</span
        > to confirm.
      </p>

      <input
        type="text"
        class="input input-bordered w-full mb-4"
        bind:value={confirmationName}
        placeholder="Type team name"
      />

      <div class="modal-action">
        <form method="dialog">
          <button class="btn">Cancel</button>
        </form>
        <form
          method="POST"
          action="?/deleteTeam"
          use:enhance={() => {
            return async ({ result, update }) => {
              if (result.type === "success") {
                deleteModal.close()
                await update()
              }
            }
          }}
        >
          <input type="hidden" name="team_id" value={teamToDelete.team_id} />
          <button
            type="submit"
            class="btn btn-error"
            disabled={confirmationName !== teamToDelete.team_name}
          >
            Delete Team
          </button>
        </form>
      </div>
    {/if}
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
