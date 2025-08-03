<!-- src/routes/(admin)/account/(menu)/teams/worlds/+page.svelte -->
<script lang="ts">
  import type { PageData } from "./$types"

  let { data }: { data: PageData } = $props()
  let teamsWithWorlds = $derived(data.teamsWithWorlds ?? [])
</script>

<svelte:head>
  <title>Your Teams' World</title>
</svelte:head>

<section>
  <h2 class="text-2xl font-semibold mb-6 border-b pb-2">Your Teams' World</h2>

  {#if teamsWithWorlds.length > 0}
    <div class="space-y-8">
      {#each teamsWithWorlds as team (team.team_id)}
        <div class="card bg-base-100 shadow-md">
          <div class="card-body">
            <h3 class="card-title border-b pb-2">{team.team_name}</h3>
            <div class="mt-4 space-y-3">
              {#if team.worlds.length > 0}
                {#each team.worlds as world (world.id)}
                  <a
                    href="/account/teams/{team.team_id}/worlds/{world.id}"
                    class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow block"
                  >
                    <div class="card-body p-4">
                      <h4 class="font-semibold">{world.name}</h4>
                      <p class="text-sm">
                        {world.description || "No description provided."}
                      </p>
                    </div>
                  </a>
                {/each}
              {:else}
                <div class="text-center p-4 bg-base-200 rounded-lg">
                  <p class="mb-4">This team doesn't have any worlds yet.</p>
                  <a
                    href="/account/teams/{team.team_id}/worlds/create"
                    class="btn btn-secondary"
                  >
                    Create a World
                  </a>
                </div>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="text-center py-10">
      <p class="mb-4 text-lg">You are not part of any teams yet.</p>
      <a href="/account/teams/create" class="btn btn-primary"
        >Create Your First Team</a
      >
    </div>
  {/if}
</section>
