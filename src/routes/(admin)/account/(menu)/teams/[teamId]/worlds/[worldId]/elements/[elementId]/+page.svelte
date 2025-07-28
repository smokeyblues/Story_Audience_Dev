<!-- src/routes/(admin)/account/(menu)/teams/[teamId]/worlds/[worldId]/elements/[elementId]/+page.svelte -->
<script lang="ts">
  import { enhance } from "$app/forms"
  import type { PageData, ActionData } from "./$types"
  import { page } from "$app/stores"
  import RelationshipGraph from "$lib/components/RelationshipGraph.svelte"

  export let data: PageData
  export let form: ActionData

  let isEditing = false
  let selectedTargetId = ""
  let availableRelationshipTypes: string[] = []

  // --- NEW: Prepare data for the D3 graph ---
  $: graphData = (() => {
    const nodes = new Map<string, { id: string; name: string; type: string }>()
    // Add the current element as the first node
    nodes.set(data.element.id, {
      id: data.element.id,
      name: data.element.name,
      type: data.element.type,
    })

    const links = data.relationships
      .map((rel) => {
        // Ensure the relationship has valid source and target objects
        if (
          rel.source &&
          typeof rel.source === "object" &&
          "id" in rel.source &&
          "name" in rel.source &&
          rel.target &&
          typeof rel.target === "object" &&
          "id" in rel.target &&
          "name" in rel.target
        ) {
          // Add the source and target to our nodes map (Map handles duplicates)
          nodes.set(rel.source.id as string, {
            id: rel.source.id as string,
            name: rel.source.name as string,
            type: "",
          }) // Type isn't needed for the graph node itself
          nodes.set(rel.target.id as string, {
            id: rel.target.id as string,
            name: rel.target.name as string,
            type: "",
          })

          return {
            source: rel.source.id as string,
            target: rel.target.id as string,
            type: rel.type || "",
          }
        }
        return null
      })
      .filter(
        (link): link is { source: string; target: string; type: string } =>
          link !== null,
      )

    return {
      nodes: Array.from(nodes.values()),
      links,
    }
  })()

  // --- Relationship Ontology ---
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

  $: currentFields =
    Object.values(elementTypes)
      .flat()
      .find((t) => t.name === data.element.type)?.fields ?? []

  function formatKey(key: string) {
    const result = key.replace(/([A-Z])/g, " $1")
    return result.charAt(0).toUpperCase() + result.slice(1)
  }

  $: if (form?.success) {
    isEditing = false
  }

  $: {
    if (selectedTargetId) {
      const sourceType = data.element.type
      const targetElement = data.worldElements.find(
        (el) => el.id === selectedTargetId,
      )
      if (sourceType && targetElement && targetElement.type) {
        const targetType = targetElement.type
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

  <!-- NEW: Relationship Graph Visualization -->
  {#if graphData.nodes.length > 1}
    <div class="card">
      <h2>Relationship Web</h2>
      <RelationshipGraph
        nodes={graphData.nodes}
        links={graphData.links}
        currentElementId={data.element.id}
      />
    </div>
  {/if}

  <!-- Element Properties Card -->
  <div class="card">
    <!-- ... (rest of the component is the same as before) ... -->
    {#if isEditing}
      <!-- EDITING MODE -->
      <form
        method="POST"
        action="?/updateElement"
        use:enhance
        class="space-y-4"
      >
        <h2>Edit Properties</h2>
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

    <div class="mt-6 pt-6 border-t">
      <h3>Add New Relationship</h3>
      <form
        method="POST"
        action="?/createRelationship"
        use:enhance
        class="flex items-end space-x-2"
      >
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
