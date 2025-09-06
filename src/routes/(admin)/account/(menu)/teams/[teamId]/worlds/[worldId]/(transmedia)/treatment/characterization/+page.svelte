<script lang="ts">
  import { enhance } from "$app/forms"
  import { invalidateAll } from "$app/navigation"
  import { page } from "$app/stores"
  import type { ActionData, PageData } from "./$types"
  import RichTextEditor from "$lib/components/RichTextEditor.svelte"

  let { data }: { data: PageData } = $props()

  // Use the generated ActionData type for the form
  const form = $derived(($page as { form: ActionData }).form)

  let showSuccess = $state(false)

  $effect(() => {
    if (form?.success) {
      invalidateAll()
      showSuccess = true
      const timer = setTimeout(() => {
        showSuccess = false
      }, 3000)
      return () => clearTimeout(timer)
    }
  })

  // Safely access treatment data, defaulting to an empty string
  let treatment = $derived(data.treatment ?? { characterization_attitude: "" })
</script>

<section>
  <h2 class="text-2xl font-semibold mb-4 border-b pb-2">
    Characterization & Attitude
  </h2>
  <form method="POST" action="?/saveCharacterization" use:enhance>
    <label class="form-control w-full">
      <RichTextEditor
        name="characterization_attitude"
        placeholder="Describe specific characters, their roles, and the overall attitude of the experience..."
        value={treatment.characterization_attitude ?? ""}
      />
    </label>
    <button type="submit" class="btn btn-sm btn-primary mt-3"
      >Save Characterization</button
    >
    {#if form?.action === "saveCharacterization"}
      {#if showSuccess}
        <p class="text-success text-sm mt-1 inline-block ml-2">
          {form.message}
        </p>
      {/if}
      {#if form?.error}
        <p class="text-error text-sm mt-1 inline-block ml-2">{form.error}</p>
      {/if}
    {/if}
  </form>
</section>
