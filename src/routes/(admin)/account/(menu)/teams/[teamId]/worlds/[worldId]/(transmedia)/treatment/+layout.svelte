<script lang="ts">
  import type { Snippet } from "svelte"
  // import type { LayoutData } from "./$types"
  import { page } from "$app/stores"
  let { children }: { children: Snippet } = $props()
  let worldId = $derived($page.params.worldId)
  let teamId = $derived($page.params.teamId)
</script>

<div class="flex flex-col md:flex-row gap-8">
  <!-- Sub-navigation Sidebar -->
  <aside class="md:w-1/4 lg:w-1/5 md:sticky md:top-24 self-start">
    <ul class="menu bg-base-200 rounded-box p-2">
      <li>
        <a
          href={`/account/teams/${teamId}/worlds/${worldId}/treatment/tagline`}
          class={$page.url.pathname.endsWith("/tagline") ? "active" : ""}
          >Tagline</a
        >
      </li>
      <li>
        <a
          href={`/account/teams/${teamId}/worlds/${worldId}/treatment/backstory`}
          class={$page.url.pathname.endsWith("/backstory") ? "active" : ""}
          >Back Story & Context</a
        >
      </li>
      <li>
        <a
          href={`/account/teams/${teamId}/worlds/${worldId}/treatment/synopsis`}
          class={$page.url.pathname.endsWith("/synopsis") ? "active" : ""}
          >Synopsis</a
        >
      </li>
      <li>
        <a
          href={`/account/teams/${teamId}/worlds/${worldId}/treatment/plotpoints`}
          class={$page.url.pathname.endsWith("/plotpoints") ? "active" : ""}
          >Plot Points</a
        >
      </li>
      <li>
        <a
          href={`/account/teams/${teamId}/worlds/${worldId}/treatment/characterization`}
          class={$page.url.pathname.endsWith("/characterization")
            ? "active"
            : ""}>Characterization & Attitude</a
        >
      </li>
      <li>
        <a
          href={`/account/teams/${teamId}/worlds/${worldId}/treatment/scripts`}
          class={$page.url.pathname.endsWith("/scripts") ? "active" : ""}
          >Scripts</a
        >
      </li>
      <li>
        <a
          href={`/account/teams/${teamId}/worlds/${worldId}/treatment/scenarios`}
          class={$page.url.pathname.endsWith("/scenarios") ? "active" : ""}
          >User-centric Scenarios</a
        >
      </li>
    </ul>
  </aside>
  <main class="md:w-3/4 lg:w-4/5">
    {@render children()}
  </main>
</div>
