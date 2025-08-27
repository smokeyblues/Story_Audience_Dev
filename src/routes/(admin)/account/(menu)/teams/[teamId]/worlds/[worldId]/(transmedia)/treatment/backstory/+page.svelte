<script lang="ts">
  import { enhance } from "$app/forms"
  import { page } from "$app/stores"
  import type { PageData, ActionData } from "./$types"
  import RichTextEditor from "$lib/components/RichTextEditor.svelte"

  let { data }: { data: PageData } = $props()

  // Use the universal $page.form store for form results with the correct type
  const form = $derived(($page as { form: ActionData }).form)

  // Bind the editor's value directly to the data from the load function.
  // Svelte's reactivity will handle keeping it in sync.
  let backstoryContent = $state(data.treatment.backstory_context ?? "")

  $effect(() => {
    backstoryContent = data.treatment.backstory_context ?? ""
  })
</script>

<section>
  <h2 class="text-2xl font-semibold mb-4 border-b pb-2">Backstory & Context</h2>
  <p class="text-sm text-base-content/70 mb-4">
    Describe the world's history, mythology, or any essential context needed to
    understand the story.
  </p>

  <form method="POST" action="?/saveBackstory" use:enhance>
    <div class="mb-3">
      <RichTextEditor
        name="backstory_context"
        placeholder="In the beginning, there was..."
        bind:value={backstoryContent}
      />
    </div>

    <div class="flex items-center gap-4">
      <button type="submit" class="btn btn-sm btn-primary"
        >Save Backstory</button
      >

      {#if form?.success}
        <p class="text-success text-sm">{form.message}</p>
      {/if}
      {#if form?.error}
        <p class="text-error text-sm">{form.error}</p>
      {/if}
    </div>
  </form>
</section>
