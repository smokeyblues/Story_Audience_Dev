<script lang="ts">
  import { enhance } from "$app/forms"
  import type { PageData, ActionData } from "./$types"
  import { page } from "$app/stores"
  import InteractiveMap from "$lib/components/InteractiveMap.svelte"

  export let data: PageData
  export let form: ActionData

  // Element type configuration - matches the one from the element detail page
  const elementTypes = {
    "Core Entities": [
      {
        name: "Character",
        fields: [
          { name: "summary", label: "Summary", type: "textarea" },
          { name: "backstory", label: "Backstory", type: "textarea" },
          { name: "age", label: "Age", type: "text" },
        ],
      },
      {
        name: "Location",
        fields: [
          { name: "description", label: "Description", type: "textarea" },
          { name: "region", label: "Region", type: "text" },
        ],
      },
      {
        name: "Item",
        fields: [
          { name: "description", label: "Description", type: "textarea" },
          { name: "function", label: "Function", type: "text" },
          { name: "owner", label: "Owner", type: "text" },
        ],
      },
      {
        name: "Species/Race",
        fields: [
          { name: "description", label: "Description", type: "textarea" },
          { name: "abilities", label: "Abilities", type: "textarea" },
        ],
      },
      {
        name: "Creature",
        fields: [
          { name: "description", label: "Description", type: "textarea" },
          { name: "habitat", label: "Habitat", type: "text" },
        ],
      },
    ],
    "Social & Political": [
      {
        name: "Faction",
        fields: [
          { name: "description", label: "Description", type: "textarea" },
          { name: "goals", label: "Goals", type: "textarea" },
          { name: "leader", label: "Leader", type: "text" },
        ],
      },
      {
        name: "Culture",
        fields: [
          { name: "description", label: "Description", type: "textarea" },
          { name: "customs", label: "Customs", type: "textarea" },
        ],
      },
      {
        name: "Government",
        fields: [
          { name: "type", label: "Type of Government", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
        ],
      },
      {
        name: "Religion/Mythology",
        fields: [
          { name: "description", label: "Description", type: "textarea" },
          { name: "deities", label: "Deities", type: "textarea" },
        ],
      },
    ],
    "Narrative & Abstract": [
      {
        name: "Event",
        fields: [
          { name: "description", label: "Description", type: "textarea" },
          { name: "date", label: "Date", type: "text" },
          { name: "participants", label: "Participants", type: "textarea" },
        ],
      },
      {
        name: "Lore Entry",
        fields: [{ name: "text", label: "Lore Text", type: "textarea" }],
      },
      {
        name: "Theme",
        fields: [
          { name: "description", label: "Description", type: "textarea" },
        ],
      },
      {
        name: "Plot Point",
        fields: [
          { name: "description", label: "Description", type: "textarea" },
        ],
      },
    ],
    "Systems & Rules": [
      {
        name: "Magic System / Technology",
        fields: [
          { name: "description", label: "Description", type: "textarea" },
          { name: "rules", label: "Rules & Limitations", type: "textarea" },
        ],
      },
      {
        name: "Language",
        fields: [
          { name: "description", label: "Description", type: "textarea" },
          { name: "alphabet", label: "Alphabet/Symbols", type: "textarea" },
        ],
      },
      {
        name: "Calendar/Time",
        fields: [
          { name: "description", label: "Description", type: "textarea" },
        ],
      },
    ],
  }

  // Find the fields for the current element type
  $: currentFields =
    Object.values(elementTypes)
      .flat()
      .find((t) => t.name === data.elementType)?.fields ?? []

  $: lat = $page.url.searchParams.get("lat")
  $: lng = $page.url.searchParams.get("lng")
</script>

<div class="container space-y-6">
  <!-- Header -->
  <div class="flex flex-col space-y-2">
    <div>
      <a
        href={`/account/teams/${$page.params.teamId}/worlds/${$page.params.worldId}`}
        class="text-primary-500 hover:underline"
      >
        &larr; Back to {data.world.name}
      </a>
    </div>
    <div>
      <h1>Create {data.elementType}</h1>
      <p class="text-surface-400">
        Adding a new {data.elementType.toLowerCase()} to
        <strong>{data.world.name}</strong>
        in team <strong>{data.team.name}</strong>
      </p>
    </div>
  </div>

  <!-- Creation Form -->
  <div class="card">
    <div class="card-body">
      <h2>Element Details</h2>

      {#if lat && lng}
        <div class="my-4 rounded-lg overflow-hidden border border-surface-300">
          <p class="p-4 bg-surface-100 text-sm">
            📍 Placing new element at the selected map coordinates.
          </p>
          <InteractiveMap
            mapImageUrl={data.world.map_image_url}
            mapType={data.world.map_type}
            editable={false}
            singleMarkerLocation={{
              lat: parseFloat(lat),
              lng: parseFloat(lng),
            }}
          />
        </div>
      {/if}

      <form method="POST" action="?/create" use:enhance class="space-y-4">
        {#if lat && lng}
          <input type="hidden" name="latitude" value={lat} />
          <input type="hidden" name="longitude" value={lng} />
        {/if}

        <!-- Element Name -->
        <div>
          <label for="name" class="block text-sm font-medium mb-2">
            {data.elementType} Name *
          </label>
          <input
            type="text"
            name="name"
            id="name"
            class="input"
            placeholder="Enter the name of this {data.elementType.toLowerCase()}"
            required
          />
        </div>

        <!-- Dynamic Property Fields -->
        {#if currentFields.length > 0}
          <div class="pt-4 border-t space-y-4">
            <h3 class="text-lg font-semibold">Properties</h3>
            {#each currentFields as field}
              <div>
                <label
                  for="prop_{field.name}"
                  class="block text-sm font-medium mb-2"
                >
                  {field.label}
                </label>
                {#if field.type === "textarea"}
                  <textarea
                    name="prop_{field.name}"
                    id="prop_{field.name}"
                    rows="3"
                    class="input"
                    placeholder="Enter {field.label.toLowerCase()}"
                  ></textarea>
                {:else}
                  <input
                    type={field.type}
                    name="prop_{field.name}"
                    id="prop_{field.name}"
                    class="input"
                    placeholder="Enter {field.label.toLowerCase()}"
                  />
                {/if}
              </div>
            {/each}
          </div>
        {/if}

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-4 border-t">
          <a
            href="/account/teams/{$page.params.teamId}/worlds/{$page.params
              .worldId}"
            class="btn variant-soft"
          >
            Cancel
          </a>
          <button type="submit" class="btn variant-filled-primary">
            Create {data.elementType}
          </button>
        </div>

        <!-- Error/Success Messages -->
        {#if form?.error}
          <div class="alert variant-filled-error">
            <p>{form.error}</p>
          </div>
        {/if}
      </form>
    </div>
  </div>
</div>
