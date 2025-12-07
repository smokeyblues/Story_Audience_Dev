<script lang="ts">
  import { enhance } from "$app/forms"
  import { page } from "$app/stores"
  import type { PageData, ActionData } from "./$types"
  import RichTextEditor from "$lib/components/RichTextEditor.svelte"

  let { data }: { data: PageData } = $props()

  const form = $derived(($page as { form: ActionData }).form)

  // svelte-ignore state_referenced_locally
  let synopsisContent = $state(data.treatment.synopsis ?? "")

  $effect(() => {
    synopsisContent = data.treatment.synopsis ?? ""
  })
</script>

<section>
  <h2 class="text-2xl font-semibold mb-4 border-b pb-2">Synopsis</h2>
  <p class="text-sm text-base-content/70 mb-4">
    Outline the actual project or service being produced. What is the core
    narrative or user experience?
  </p>

  <form method="POST" action="?/saveSynopsis" use:enhance>
    <div class="mb-3">
      <RichTextEditor
        name="synopsis"
        placeholder="A brief summary of the plot or main experience..."
        bind:value={synopsisContent}
      />
    </div>

    <div class="flex items-center gap-4">
      <button type="submit" class="btn btn-sm btn-primary">Save Synopsis</button
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
