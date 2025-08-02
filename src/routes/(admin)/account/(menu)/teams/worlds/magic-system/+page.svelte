<script lang="ts">
  import type { PageData } from "./$types"

  export let data: PageData

  // Reactive declaration to get the structured data from the load function.
  $: teamsWithMagicSystems = data.teamsWithMagicSystems || []
</script>

<div class="p-4 md:p-8">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">All Magic Systems</h1>
  </div>

  {#if teamsWithMagicSystems.length === 0}
    <div class="text-center py-12">
      <p class="text-lg">No teams found.</p>
      <p class="mt-2 text-neutral-content">
        You need to be a member of a team to create magic systems.
      </p>
      <a href="/account/teams" class="btn btn-primary mt-4">Go to Teams</a>
    </div>
  {:else}
    <!-- Iterate over each team -->
    {#each teamsWithMagicSystems as team}
      <div class="mb-10">
        <h2 class="text-xl font-semibold border-b pb-2 mb-4">
          <span class="text-neutral-content">Team:</span>
          {team.name}
        </h2>

        {#if team.worlds.length === 0}
          <div class="pl-4 py-6 text-center bg-base-100 rounded-lg">
            <p class="text-neutral-content">No worlds in this team yet.</p>
            <a
              href="/account/teams/{team.id}"
              class="btn btn-sm btn-outline mt-2"
            >
              Manage Team
            </a>
          </div>
        {:else}
          <!-- Iterate over each world within a team -->
          {#each team.worlds as world}
            <div class="mb-6 pl-4">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-medium">
                  <span class="text-neutral-content">World:</span>
                  {world.name}
                </h3>
                <a
                  href="/account/teams/{team.id}/worlds/{world.id}/elements/Magic%20System%20%2F%20Technology/create"
                  class="btn btn-sm btn-primary"
                >
                  Create Magic System
                </a>
              </div>

              {#if world.elements.length === 0}
                <div class="bg-base-100 rounded-lg p-6 text-center">
                  <p class="text-neutral-content mb-3">
                    No magic systems in this world yet.
                  </p>
                  <a
                    href="/account/teams/{team.id}/worlds/{world.id}/elements/Magic%20System%20%2F%20Technology/create"
                    class="btn btn-sm btn-primary"
                  >
                    Create Your First Magic System
                  </a>
                </div>
              {:else}
                <div
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                  <!-- Iterate over each magic system in the world and display it as a card -->
                  {#each world.elements as magicSystem}
                    <a
                      href={`/account/teams/${team.id}/worlds/${world.id}/elements/${magicSystem.id}`}
                      class="card card-compact bg-base-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                    >
                      <div class="card-body">
                        <h4 class="card-title">{magicSystem.name}</h4>
                        <p class="text-sm text-neutral-content truncate">
                          {(typeof magicSystem.properties === "object" &&
                            magicSystem.properties !== null &&
                            !Array.isArray(magicSystem.properties) &&
                            (magicSystem.properties.description ||
                              magicSystem.properties.rules)) ||
                            "No description available."}
                        </p>
                      </div>
                    </a>
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        {/if}
      </div>
    {/each}
  {/if}
</div>
