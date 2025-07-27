<script lang="ts">
  import type { Snippet } from "svelte"
  import type { PageData } from "./$types"

  let { children, data }: { children: Snippet; data: PageData } = $props()
</script>

<div class="my-6 flex items-center space-x-2">
  {#each data.breadcrumbs as crumb, i}
    <a
      href={crumb.href}
      class={`text-xl ${i === data.breadcrumbs.length - 1 ? "font-bold" : ""}`}
    >
      {crumb.label}
    </a>
    {#if i < data.breadcrumbs.length - 1}
      <span class="mx-2">></span>
    {/if}
  {/each}
</div>

{@render children()}
