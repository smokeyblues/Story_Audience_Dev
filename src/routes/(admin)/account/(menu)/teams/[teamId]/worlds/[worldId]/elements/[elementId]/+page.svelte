<!-- src/routes/(admin)/account/(menu)/teams/[teamId]/worlds/[worldId]/elements/[elementId]/+page.svelte -->
<script lang="ts">
  import { enhance } from "$app/forms"
  import type { PageData, ActionData } from "./$types"
  import { page } from "$app/stores"

  export let data: PageData
  export let form: ActionData

  let isEditing = false
  let selectedTargetId = ""
  let relationshipDescription = ""
  let availableRelationshipTypes: string[] = []

  // --- NEW: Relationship Ontology ---
  // This object defines the valid relationships between different element types.
  // Format: { SourceType: { TargetType: ['RELATIONSHIP_1', 'RELATIONSHIP_2'] } }
  const relationshipOntology: Record<string, Record<string, string[]>> = {
    Character: {
      Character: [
        "ALLY_OF",
        "ENEMY_OF",
        "PARENT_OF",
        "CHILD_OF",
        "SIBLING_OF",
        "SPOUSE_OF",
      ],
      Location: ["LIVES_IN", "BORN_IN", "DIED_IN", "VISITED"],
      Item: ["OWNS", "WIELDS", "CREATED"],
      Faction: ["MEMBER_OF", "LEADS", "FOUNDED"],
      Event: ["PARTICIPATED_IN"],
      Culture: ["BELONGS_TO"],
    },
    Location: {
      Location: ["LOCATED_IN", "CONTAINS"],
      Faction: ["HEADQUARTERS_OF", "TERRITORY_OF"],
      Event: ["SITE_OF"],
      Culture: ["HEARTLAND_OF"],
    },
    Item: {
      Character: ["OWNED_BY", "CREATED_BY"],
      Location: ["LOCATED_AT", "FORGED_AT"],
      Faction: ["SYMBOL_OF"],
    },
    Faction: {
      Character: ["LED_BY", "FOUNDED_BY"],
      Location: ["BASED_IN"],
      Faction: ["ALLIED_WITH", "AT_WAR_WITH"],
    },
    Event: {
      Character: ["INVOLVED"],
      Location: ["TOOK_PLACE_AT"],
      Faction: ["PARTICIPANT"],
    },
    Culture: {
      Character: ["PRACTICED_BY"],
      Location: ["ORIGINATED_IN"],
    },
    // Add more rules for other types as needed
  }

  // --- Configuration for Element Types and their Properties ---
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

  // Helper to get the fields for the current element's type
  $: currentFields =
    Object.values(elementTypes)
      .flat()
      .find((t) => t.name === data.element.type)?.fields ?? []

  // Helper to format property keys for display
  function formatKey(key: string) {
    const result = key.replace(/([A-Z])/g, " $1")
    return result.charAt(0).toUpperCase() + result.slice(1)
  }

  // When form submission is done, exit editing mode
  $: if (form?.success) {
    isEditing = false
  }

  // --- NEW: Reactive logic to update the relationship types dropdown ---
  $: {
    if (selectedTargetId) {
      const sourceType = data.element.type
      const targetElement = data.worldElements.find(
        (el) => el.id === selectedTargetId,
      )
      if (sourceType && targetElement && targetElement.type) {
        const targetType = targetElement.type
        // Look up the valid relationships in our ontology
        availableRelationshipTypes =
          relationshipOntology[sourceType]?.[targetType] || []
      } else {
        availableRelationshipTypes = []
      }
    } else {
      availableRelationshipTypes = []
    }
  }
</script>

<div class="container space-y-6">
  <!-- Header -->
  <div class="flex justify-between items-start">
    <div>
      <a
        href={`/account/teams/${$page.params.teamId}/worlds/${$page.params.worldId}`}
        class="text-primary-500 hover:underline"
      >
        &larr; Back to World
      </a>
      <h1 class="mt-2">{data.element.name}</h1>
      <p class="text-surface-400">{data.element.type}</p>
    </div>
    <button class="btn variant-soft" on:click={() => (isEditing = !isEditing)}>
      {isEditing ? "Cancel" : "Edit Element"}
    </button>
  </div>

  <!-- Element Properties Card -->
  <div class="card">
    {#if isEditing}
      <!-- EDITING MODE -->
      <form
        method="POST"
        action="?/updateElement"
        use:enhance
        class="space-y-4"
      >
        <h2>Edit Properties</h2>
        <!-- Element Name Input -->
        <div>
          <label for="name">Element Name</label>
          <input
            type="text"
            name="name"
            id="name"
            class="input"
            value={data.element.name}
            required
          />
        </div>

        <!-- Dynamic Properties Section -->
        <div class="pt-4 border-t space-y-4">
          {#each currentFields as field}
            {@const value =
              typeof data.element.properties === "object" &&
              data.element.properties !== null &&
              !Array.isArray(data.element.properties)
                ? data.element.properties[field.name] || ""
                : ""}
            <div>
              <label for="prop_{field.name}">{field.label}</label>
              {#if field.type === "textarea"}
                <textarea
                  name="prop_{field.name}"
                  id="prop_{field.name}"
                  rows="3"
                  class="input">{value}</textarea
                >
              {:else}
                <input
                  type={field.type}
                  name="prop_{field.name}"
                  id="prop_{field.name}"
                  class="input"
                  {value}
                />
              {/if}
            </div>
          {/each}
        </div>

        <!-- Submission Button -->
        <div>
          <button type="submit" class="btn variant-filled">Save Changes</button>
        </div>
        {#if form?.error}
          <p class="error-message">{form.error}</p>
        {/if}
        {#if form?.success && form.message === "Element updated successfully!"}
          <p class="success-message">{form.message}</p>
        {/if}
      </form>
    {:else}
      <!-- VIEWING MODE -->
      <h2>Properties</h2>
      <div class="space-y-4">
        {#if data.element.properties && typeof data.element.properties === "object" && Object.keys(data.element.properties).length > 0}
          {#each Object.entries(data.element.properties) as [key, value]}
            {#if value}
              <div>
                <h3 class="font-bold">{formatKey(key)}</h3>
                <p class="whitespace-pre-wrap">{String(value)}</p>
              </div>
            {/if}
          {/each}
        {:else}
          <p>This element has no additional properties.</p>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Relationships Card -->
  <div class="card">
    <h2>Relationships</h2>
    <ul class="space-y-3">
      {#if data.relationships.length > 0}
        {#each data.relationships as rel}
          {#if rel.source && typeof rel.source === "object" && "id" in rel.source && "name" in rel.source && rel.target && typeof rel.target === "object" && "id" in rel.target && "name" in rel.target}
            {@const isSource = rel.source.id === data.element.id}
            <li class="flex items-center space-x-2">
              <span class:font-bold={isSource}>{rel.source.name}</span>
              <span class="chip variant-filled"
                >{rel.type?.replace(/_/g, " ")}</span
              >
              <span class:font-bold={!isSource}>{rel.target.name}</span>
            </li>
          {/if}
        {/each}
      {:else}
        <p>This element has no relationships yet.</p>
      {/if}
    </ul>

    <!-- --- MODIFIED: Add Relationship Form --- -->
    <div class="mt-6 pt-6 border-t">
      <h3>Add New Relationship</h3>
      <form
        method="POST"
        action="?/createRelationship"
        use:enhance
        class="flex items-end space-x-2"
      >
        <!-- This element is the Source -->
        <div class="flex-1">
          <label for="targetElementId">Connect To</label>
          <select
            name="targetElementId"
            id="targetElementId"
            class="input"
            required
            bind:value={selectedTargetId}
          >
            <option value="" disabled>Select an element...</option>
            {#each data.worldElements.filter((el) => el.id !== data.element.id) as targetElement}
              <option value={targetElement.id}
                >{targetElement.name} ({targetElement.type})</option
              >
            {/each}
          </select>
        </div>

        <!-- Relationship Type Dropdown (now dynamic) -->
        <div class="flex-1">
          <label for="relationshipType">As</label>
          <select
            name="relationshipType"
            id="relationshipType"
            class="input"
            required
            disabled={availableRelationshipTypes.length === 0}
          >
            <option value="" disabled selected>Select a relationship...</option>
            {#each availableRelationshipTypes as relType}
              <option value={relType}>{relType.replace(/_/g, " ")}</option>
            {/each}
          </select>
        </div>

        <!-- NEW: Description Textarea -->
        <div class="pt-4">
          <label for="relationshipDescription">Description (Optional)</label>
          <textarea
            id="relationshipDescription"
            name="relationshipDescription"
            bind:value={relationshipDescription}
            rows="3"
            class="input"
            placeholder="How or why are these elements related?"
          ></textarea>
        </div>

        <button type="submit" class="btn variant-filled-primary">Add</button>
      </form>
      {#if form?.createRelationshipError}
        <p class="error-message mt-2">{form.createRelationshipError}</p>
      {/if}
      {#if form?.success && form.message === "Relationship created!"}
        <p class="success-message mt-2">{form.message}</p>
      {/if}
    </div>
  </div>
</div>
