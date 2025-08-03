<script lang="ts">
  import { enhance } from "$app/forms"
  import type { ActionData, PageData } from "./$types"
  import { page } from "$app/stores"
  import type { RelationshipProperties } from "$lib/types"
  import InteractiveMap from "$lib/components/InteractiveMap.svelte"

  export let data: PageData
  export let form: ActionData

  // --- Configuration for Element Types and their Properties ---
  // This object defines the structure of your worldbuilding elements.
  // It's used to dynamically generate the "Add Element" form.
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

  // --- Component State ---
  let selectedType = "" // The currently selected element type from the dropdown
  let elementName = "" // The name of the new element
  let properties: { [key: string]: string } = {} // Holds the data for the dynamic fields

  // Reactive statement: This code runs whenever `selectedType` changes.
  $: {
    // Reset properties when the type changes
    properties = {}
    if (selectedType) {
      const allTypes = Object.values(elementTypes).flat()
      const typeConfig = allTypes.find((t) => t.name === selectedType)
      if (typeConfig) {
        // Initialize the properties object with empty strings for the new fields
        typeConfig.fields.forEach((field) => {
          properties[field.name] = ""
        })
      }
    }
  }

  // Helper to get the fields for the currently selected type
  $: currentFields = selectedType
    ? (Object.values(elementTypes)
        .flat()
        .find((t) => t.name === selectedType)?.fields ?? [])
    : []
</script>

<div class="container">
  <h1 class="text-2xl font-bold">World: {data.world?.name}</h1>
  <!-- Interactive Map -->
  <section class="card p-4">
    <h2 class="text-2xl font-bold mb-4">Interactive Map</h2>
    <InteractiveMap />
  </section>

  <!-- Section for Adding New Elements -->
  <section class="card">
    <h2>Add New Element</h2>
    <form method="POST" action="?/createElement" use:enhance class="space-y-4">
      <!-- Element Name Input -->
      <div>
        <label for="name">Element Name</label>
        <input
          type="text"
          name="name"
          id="name"
          class="input"
          bind:value={elementName}
          required
        />
      </div>

      <!-- Element Type Selection -->
      <div>
        <label for="type">Element Type</label>
        <select
          name="type"
          id="type"
          class="input"
          bind:value={selectedType}
          required
        >
          <option value="" disabled>Select a type...</option>
          {#each Object.entries(elementTypes) as [category, types]}
            <optgroup label={category}>
              {#each types as type}
                <option value={type.name}>{type.name}</option>
              {/each}
            </optgroup>
          {/each}
        </select>
      </div>

      <!-- Dynamic Properties Section -->
      {#if selectedType}
        <div class="pt-4 border-t space-y-4">
          <h3>{selectedType} Properties</h3>
          {#each currentFields as field}
            <div>
              <label for="prop_{field.name}">{field.label}</label>
              {#if field.type === "textarea"}
                <textarea
                  name="prop_{field.name}"
                  id="prop_{field.name}"
                  rows="3"
                  class="input"
                  bind:value={properties[field.name]}
                ></textarea>
              {:else}
                <input
                  type={field.type}
                  name="prop_{field.name}"
                  id="prop_{field.name}"
                  class="input"
                  bind:value={properties[field.name]}
                />
              {/if}
            </div>
          {/each}
        </div>
      {/if}

      <!-- Submission Button -->
      <div>
        <button
          type="submit"
          class="btn"
          disabled={!selectedType || !elementName}
        >
          Create Element
        </button>
      </div>
    </form>
    {#if form?.error}
      <p class="error-message">{form.error}</p>
    {/if}
    {#if form?.success}
      <p class="success-message">Element created successfully!</p>
    {/if}
  </section>

  <!-- Section for Listing Existing Elements -->
  <section class="card p-4">
    <h1 class="text-2xl font-bold">Existing Elements</h1>
    {#if data.elements && data.elements.length > 0}
      <ul class="space-y-3">
        {#each data.elements as element}
          <li class="p-4 border rounded-md flex justify-between items-center">
            <a
              href={`/account/teams/${$page.params.teamId}/worlds/${$page.params.worldId}/elements/${element.id}`}
              class="block w-full"
            >
              <div>
                <p class="font-semibold text-lg">{element.name}</p>
                <p class="text-sm text-surface-400">{element.type}</p>
              </div>
            </a>
            <!-- Future actions like 'View Details' or 'Delete' can go here -->
          </li>
        {/each}
      </ul>
    {:else}
      <p>No elements have been created for this world yet.</p>
    {/if}
  </section>

  <!-- Section for Listing Existing Relationships -->
  <section class="card p-4 mt-4">
    <h1 class="text-2xl font-bold">Relationships</h1>
    {#if data.relationships && data.relationships.length > 0}
      <ul class="space-y-3">
        {#each data.relationships as relationship}
          <li class="p-4 border rounded-md">
            <p class="text-lg">
              <span class="font-semibold"
                >{relationship.source_element_name}</span
              >
              <span class="text-surface-500"> — {relationship.type} — </span>
              <span class="font-semibold"
                >{relationship.target_element_name}</span
              >
            </p>
            {#if (relationship.properties as RelationshipProperties)?.description}
              <p class="text-sm text-surface-400 pt-1">
                {(relationship.properties as RelationshipProperties)
                  .description}
              </p>
            {/if}
          </li>
        {/each}
      </ul>
    {:else}
      <p>No relationships have been created for this world yet.</p>
    {/if}
  </section>
</div>
