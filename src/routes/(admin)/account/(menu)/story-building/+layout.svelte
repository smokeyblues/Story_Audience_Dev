<script lang="ts">
  import type { Snippet } from "svelte"

  let { children }: { children: Snippet } = $props()
  // let { data }: { data: PageData } = $props()
</script>

{@render children()}
