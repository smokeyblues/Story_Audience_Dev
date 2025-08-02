<script lang="ts">
  import type { PageData } from "./$types"

  export let data: PageData

  // Reactive declaration to get the structured data from the load function.
  $: teamsWithCharacters = data.teamsWithCharacters || []
</script>

<div class="p-4 md:p-8">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">All Characters</h1>
    <!-- You can add a "Create Character" button here if desired -->
    <!-- <a href="/account/teams" class="btn btn-primary">Create Character</a> -->
  </div>

  {#if teamsWithCharacters.length === 0}
    <div class="text-center py-12">
      <p class="text-lg">No characters found.</p>
      <p class="mt-2 text-neutral-content">
        Get started by navigating to a world and creating a new character
        element.
      </p>
      <a href="/account/teams" class="btn btn-primary mt-4">Go to Teams</a>
    </div>
  {:else}
    <!-- Iterate over each team -->
    {#each teamsWithCharacters as team}
      <div class="mb-10">
        <h2 class="text-xl font-semibold border-b pb-2 mb-4">
          <span class="text-neutral-content">Team:</span>
          {team.name}
        </h2>

        <!-- Iterate over each world within a team -->
        {#each team.worlds as world}
          <div class="mb-6 pl-4">
            <h3 class="text-lg font-medium mb-4">
              <span class="text-neutral-content">World:</span>
              {world.name}
            </h3>
            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              <!-- Iterate over each character in the world and display it as a card -->
              {#each world.elements as character}
                <a
                  href={`/account/teams/${team.id}/worlds/${world.id}/elements/${character.id}`}
                  class="card card-compact bg-base-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  <div class="card-body">
                    <h4 class="card-title">{character.name}</h4>
                    <p class="text-sm text-neutral-content truncate">
                      {(typeof character.properties === "object" &&
                        character.properties !== null &&
                        !Array.isArray(character.properties) &&
                        (character.properties.summary ||
                          character.properties.description)) ||
                        "No description available."}
                    </p>
                  </div>
                </a>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {/each}
  {/if}
</div>
