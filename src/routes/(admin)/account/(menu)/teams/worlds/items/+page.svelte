<script lang="ts">
  import type { PageData } from "./$types"

  export let data: PageData

  // Reactive declaration to get the structured data from the load function.
  $: teamsWithItems = data.teamsWithItems || []
</script>

<div class="p-4 md:p-8">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">All Items</h1>
  </div>

  {#if teamsWithItems.length === 0}
    <div class="text-center py-12">
      <p class="text-lg">No teams found.</p>
      <p class="mt-2 text-neutral-content">
        You need to be a member of a team to create items.
      </p>
      <a href="/account/teams" class="btn btn-primary mt-4">Go to Teams</a>
    </div>
  {:else}
    <!-- Iterate over each team -->
    {#each teamsWithItems as team}
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
                  href="/account/teams/{team.id}/worlds/{world.id}/elements/Item/create"
                  class="btn btn-sm btn-primary"
                >
                  Create Item
                </a>
              </div>

              {#if world.elements.length === 0}
                <div class="bg-base-100 rounded-lg p-6 text-center">
                  <p class="text-neutral-content mb-3">
                    No items in this world yet.
                  </p>
                  <a
                    href="/account/teams/{team.id}/worlds/{world.id}/elements/Item/create"
                    class="btn btn-sm btn-primary"
                  >
                    Create Your First Item
                  </a>
                </div>
              {:else}
                <div
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                  <!-- Iterate over each item in the world and display it as a card -->
                  {#each world.elements as item}
                    <a
                      href={`/account/teams/${team.id}/worlds/${world.id}/elements/${item.id}`}
                      class="card card-compact bg-base-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                    >
                      <div class="card-body">
                        <h4 class="card-title">{item.name}</h4>
                        <p class="text-sm text-neutral-content truncate">
                          {(typeof item.properties === "object" &&
                            item.properties !== null &&
                            !Array.isArray(item.properties) &&
                            (item.properties.description ||
                              item.properties.function)) ||
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
