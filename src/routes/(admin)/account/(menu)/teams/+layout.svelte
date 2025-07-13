<script lang="ts">
  import type { Snippet } from "svelte"

  let { children }: { children: Snippet } = $props()

  // let { data }: { data: PageData } = $props()
</script>

<div class="my-6">
  <h1 class="text-xl font-bold mb-1">Teams</h1>
</div>
{@render children()}
