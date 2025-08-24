<script lang="ts">
  // import { enhance } from "$app/forms"
  import { page } from "$app/stores"
  import type { Snippet } from "svelte"
  import type { LayoutData } from "./$types"

  let { data, children }: { data: LayoutData; children: Snippet } = $props()

  const bibleSections = $derived([
    {
      name: "Treatment",
      slug: "treatment",
      isActive: true,
      isComplete:
        data.sectionStatus?.treatment?.hasSynopsis &&
        data.sectionStatus?.treatment?.hasCharacters,
    },
    {
      name: "Business & Marketing",
      slug: "business",
      isActive:
        data.sectionStatus?.treatment?.hasSynopsis &&
        data.sectionStatus?.treatment?.hasCharacters,
      isComplete:
        data.sectionStatus?.business?.hasAudience &&
        data.sectionStatus?.business?.hasGoals,
    },
    {
      name: "Design Spec",
      slug: "design",
      isActive:
        data.sectionStatus?.business?.hasAudience &&
        data.sectionStatus?.business?.hasGoals,
    },
    {
      name: "Functional Spec",
      slug: "functional",
      isActive:
        data.sectionStatus?.business?.hasAudience &&
        data.sectionStatus?.business?.hasGoals,
    },
    {
      name: "Tech Spec",
      slug: "technology",
      isActive: data.sectionStatus?.functional?.isStarted,
    },
    {
      name: "Feedback",
      slug: "feedback",
      isActive: data.sectionStatus?.treatment?.hasSynopsis,
      isComplete: false,
    },
  ])

  let activeSlug = $derived($page.url.pathname.split("/").pop() || "treatment")

  let showMarketTestingPrompt = $derived(
    data.sectionStatus?.business?.hasAudience &&
      data.sectionStatus?.business?.hasGoals,
  )
</script>

<div class="p-4 md:p-8 max-w-7xl mx-auto">
  <div role="tablist" class="tabs tabs-lifted tabs-lg mb-6">
    {#each bibleSections as section (section.slug)}
      {@const isDisabled = !section.isActive}
      {@const isCurrent = section.slug === activeSlug}
      <a
        role="tab"
        href={isDisabled
          ? undefined
          : `/account/teams/${data.team?.id}/worlds/${data.world?.id}/${section.slug}`}
        class:tab-active={!isDisabled && isCurrent}
        class:!bg-base-100={!isDisabled && isCurrent}
        class:text-primary={!isDisabled && isCurrent}
        class:font-semibold={!isDisabled && isCurrent}
        class:tab-disabled={isDisabled}
        class:opacity-50={isDisabled}
        class:cursor-not-allowed={isDisabled}
        class="tab [--tab-bg:hsl(var(--b2))] [--tab-border-color:hsl(var(--b3))] {isDisabled
          ? ''
          : 'hover:bg-base-200'}"
        aria-disabled={isDisabled}
        tabindex={isDisabled ? -1 : 0}
        onclick={(e) => {
          if (isDisabled) e.preventDefault()
        }}
      >
        {section.name}
        {#if isDisabled}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="w-4 h-4 ml-1 opacity-70 inline-block align-middle"
            ><path
              fill-rule="evenodd"
              d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v3A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-3A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z"
              clip-rule="evenodd"
            /></svg
          >
        {:else if section.slug === "treatment" && !bibleSections[0].isComplete}
          <span
            class="badge badge-xs badge-primary ml-1.5 align-middle hidden md:inline-block"
            >Start Here</span
          >
        {:else if section.slug === "business" && bibleSections[0].isComplete && !section.isComplete}
          <span
            class="badge badge-xs badge-secondary ml-1.5 align-middle hidden md:inline-block"
            >Next Step</span
          >
        {/if}
      </a>
    {/each}
  </div>

  {#if showMarketTestingPrompt}
    <div class="alert alert-info my-6 shadow-md max-w-4xl mx-auto">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="stroke-current shrink-0 w-6 h-6"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <div>
        <h3 class="font-bold">Ready for Feedback?</h3>
        <div class="text-xs">
          Consider testing your core concept! Exploring initial
          <a
            href="/account/teams/{data.team?.id}/worlds/{data.world?.id}/design"
            class="link link-primary">Design Aesthetics</a
          >
          and
          <a
            href="/account/teams/{data.team?.id}/worlds/{data.world
              ?.id}/functional"
            class="link link-primary">Functional User Journeys</a
          >
          can help create effective test materials.
          <br />
          Remember to log any insights in the
          <a
            href="/account/teams/{data.team?.id}/worlds/{data.world
              ?.id}/feedback"
            class="link link-primary">Feedback Log!</a
          >
        </div>
      </div>
    </div>
  {/if}

  <div class="mt-6">
    {@render children()}
  </div>
</div>

<style>
  .tab-disabled {
    color: hsl(var(--bc) / 0.4) !important;
    border-color: hsl(var(--b3) / 0.5) !important;
    border-bottom-width: 1px !important;
    cursor: not-allowed;
  }
  .tab-active.tab-disabled {
    opacity: 1;
    cursor: default;
    color: hsl(var(--pc)) !important;
  }
  .tab.tab-active {
    background-color: hsl(var(--b1));
  }
</style>
