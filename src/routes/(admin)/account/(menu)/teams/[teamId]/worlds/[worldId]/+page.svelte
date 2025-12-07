<script lang="ts">
  import { enhance } from "$app/forms"
  import type { ActionData, PageData } from "./$types"
  import { page } from "$app/stores"
  import type { ElementProperties, RelationshipProperties } from "$lib/types"
  import InteractiveMap from "$lib/components/InteractiveMap.svelte"
  import { elementTypes } from "$lib/worldBuilding"

  export let data: PageData
  export let form: ActionData

  // --- Configuration for Element Types and their Properties ---
  // Imported from $lib/worldBuilding

  // Component State
  let isEditingDescription = false
  let descriptionInput = data.world?.description || ""

  $: isFirstVisit = $page.url.searchParams.get("new") === "true"

  // Update descriptionInput if data changes (e.g. after save)
  $: if (data.world?.description) {
    descriptionInput = data.world.description
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

  // Split elements into suggested (from agent) and confirmed
  $: suggestedElements = (data.elements || []).filter(
    (e) => (e.properties as ElementProperties)?.agent_suggestion,
  )
  $: confirmedElements = (data.elements || []).filter(
    (e) => !(e.properties as ElementProperties)?.agent_suggestion,
  )

  function getFieldsForType(typeName: string) {
    const allTypes = Object.values(elementTypes).flat()
    return allTypes.find((t) => t.name === typeName)?.fields ?? []
  }
</script>

<div class="container">
  <!-- Top Navigation/Actions -->
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">{data.world?.name}</h1>
    <a
      href={`/account/teams/${$page.params.teamId}/worlds/${$page.params.worldId}/treatment`}
      class="btn btn-primary">Transmedia Production Bible</a
    >
  </div>

  <!-- Editable Description -->
  <form
    method="POST"
    action="?/updateWorld"
    use:enhance
    class="mb-8 relative group"
  >
    <input type="hidden" name="name" value={data.world?.name} />
    <textarea
      name="description"
      class="textarea w-full text-lg border-transparent focus:border-primary bg-transparent resize-none p-0"
      rows="3"
      placeholder="Add a description..."
      bind:value={descriptionInput}
      on:input={() => (isEditingDescription = true)}
    ></textarea>

    {#if isEditingDescription || descriptionInput !== data.world?.description}
      <button
        type="submit"
        class="btn btn-sm btn-primary absolute bottom-[-40px] right-0 z-10"
      >
        Save Description
      </button>
    {/if}
  </form>

  <!-- Review Agent Suggestions -->
  {#if suggestedElements.length > 0}
    <section class="card p-4 mb-6 border-2 border-primary/20 bg-primary/5">
      <h2 class="text-2xl font-bold mb-4">Review Agent Suggestions</h2>
      <p class="mb-4">
        The World Architect has suggested the following elements. Review and
        save them to add them to your world.
      </p>
      <div class="space-y-6">
        {#each suggestedElements as element (element.id)}
          <div class="card bg-base-100 p-4 border border-base-300">
            <h3 class="font-bold text-lg mb-2">{element.name}</h3>
            <form
              method="POST"
              action="?/updateElement"
              use:enhance
              class="space-y-4"
            >
              <input type="hidden" name="id" value={element.id} />
              <input type="hidden" name="type" value={element.type} />

              <!-- Element Name Input -->
              <div>
                <label for="name_{element.id}">Element Name</label>
                <input
                  type="text"
                  name="name"
                  id="name_{element.id}"
                  class="input w-full"
                  value={element.name}
                  required
                />
              </div>

              <!-- Dynamic Properties Section -->
              <div class="pt-2 space-y-2">
                <p class="text-sm font-semibold opacity-70">
                  {element.type} Properties
                </p>
                {#each getFieldsForType(element.type) as field}
                  <div>
                    <label for="prop_{element.id}_{field.name}"
                      >{field.label}</label
                    >
                    {#if field.type === "textarea"}
                      <textarea
                        name="prop_{field.name}"
                        id="prop_{element.id}_{field.name}"
                        rows="3"
                        class="input w-full"
                        value={((element.properties as ElementProperties)?.[
                          field.name
                        ] as string) ?? ""}
                      ></textarea>
                    {:else}
                      <input
                        type={field.type}
                        name="prop_{field.name}"
                        id="prop_{element.id}_{field.name}"
                        class="input w-full"
                        value={((element.properties as ElementProperties)?.[
                          field.name
                        ] as string) ?? ""}
                      />
                    {/if}
                  </div>
                {/each}
              </div>

              <div class="flex justify-end gap-2">
                <!-- Delete/Reject button could go here -->
                <button type="submit" class="btn btn-primary btn-sm">
                  Approve & Save
                </button>
              </div>
            </form>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Interactive Map -->
  {#if !isFirstVisit}
    <section class="card p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">World Map</h2>
        {#if data.world?.map_image_url}
          <form
            method="POST"
            action="?/toggleMapType"
            use:enhance
            class="flex items-center"
          >
            <input
              type="hidden"
              name="current_map_type"
              value={data.world.map_type}
            />
            <button type="submit" class="btn btn-sm">
              {#if data.world.map_type === "custom_image"}
                Switch to OpenStreetMap
              {:else}
                Switch to Custom Map
              {/if}
            </button>
          </form>
        {/if}
      </div>
      <InteractiveMap
        mapImageUrl={data.world?.map_image_url ?? null}
        mapType={data.world?.map_type}
        elements={data.elements || []}
        editable={true}
      />
    </section>

    <section class="card p-4 mt-6">
      <h2 class="text-2xl font-bold mb-4">Manage Map</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-semibold">Upload New Map</h3>
          <form
            method="POST"
            action="?/uploadMap"
            enctype="multipart/form-data"
            class="mt-2"
          >
            <div class="form-control w-full max-w-xs">
              <label class="label" for="map-upload">
                <span class="label-text">Select map image</span>
              </label>
              <input
                id="map-upload"
                name="mapImage"
                type="file"
                class="file-input file-input-bordered w-full max-w-xs"
                required
              />
            </div>
            <button type="submit" class="btn btn-primary mt-4">Upload</button>
          </form>
        </div>

        {#if data.world?.map_image_url}
          <div>
            <h3 class="text-lg font-semibold">Remove Custom Map</h3>
            <p class="text-sm text-gray-600 mt-2">
              This will remove your custom map and switch back to OpenStreetMap.
              Your custom map markers will be hidden but not deleted.
            </p>
            <form method="POST" action="?/removeMap" use:enhance class="mt-4">
              <button type="submit" class="btn btn-error"
                >Remove Custom Map</button
              >
            </form>
          </div>
        {/if}
      </div>
    </section>

    <!-- Section for Adding New Elements -->
    <section class="card">
      <h2>Add New Element</h2>
      <form
        method="POST"
        action="?/createElement"
        use:enhance
        class="space-y-4"
      >
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
  {/if}

  <!-- Section for Listing Existing Elements -->
  <section class="card p-4">
    <h1 class="text-2xl font-bold">Existing Elements</h1>
    {#if confirmedElements && confirmedElements.length > 0}
      <ul class="space-y-3">
        {#each confirmedElements as element}
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

  {#if !isFirstVisit}
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
  {/if}
</div>
