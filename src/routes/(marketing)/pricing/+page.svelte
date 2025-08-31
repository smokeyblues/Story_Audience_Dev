<script lang="ts">
  import PricingModule from "./pricing_module.svelte"
  import { WebsiteName } from "./../../../config"
  import { MetaTags } from "svelte-meta-tags"
  import { pricingPlans } from "./pricing_plans"

  type PlanFeatureRow = {
    name: string
    header?: boolean
    tooltip?: string
    creatorString?: string
    creatorIncluded?: boolean
    producerString?: string
    producerIncluded?: boolean
    studioString?: string
    studioIncluded?: boolean
    partnerString?: string
    partnerIncluded?: boolean
  }

  // --- REVISED FEATURE TABLE ---
  const planFeatures: PlanFeatureRow[] = [
    // --- IP Development Platform ---
    { name: "IP Development Platform", header: true },
    {
      name: "Projects",
      creatorString: "1",
      producerString: "5",
      studioString: "Unlimited",
      partnerString: "Unlimited",
    },
    {
      name: "Narrative Graph Engine",
      creatorIncluded: true,
      producerIncluded: true,
      studioIncluded: true,
      partnerIncluded: true,
      tooltip:
        "Structure your world, characters, and lore in a dynamic knowledge graph.",
    },
    {
      name: "Team Members",
      creatorString: "1 (Solo)",
      producerString: "Up to 5",
      studioString: "15+",
      partnerString: "Custom",
    },
    {
      name: "Asset Storage",
      creatorString: "100 MB",
      producerString: "1 GB",
      studioString: "10 GB+",
      partnerString: "Custom",
    },

    // --- Audience Development ---
    { name: "Audience Development", header: true },
    {
      name: "Audience Touchpoint Planner",
      creatorIncluded: false,
      producerIncluded: true,
      studioIncluded: true,
      partnerIncluded: true,
    },
    {
      name: "Community Feedback Logging",
      creatorIncluded: true,
      producerIncluded: true,
      studioIncluded: true,
      partnerIncluded: true,
    },
    {
      name: "Validated Audience Analytics (Future)",
      creatorIncluded: false,
      producerIncluded: false,
      studioIncluded: true,
      partnerIncluded: true,
    },

    // --- Production & Services ---
    { name: "Production & Services", header: true },
    {
      name: "Professional Pitch Package Export",
      creatorIncluded: false,
      producerIncluded: true,
      studioIncluded: true,
      partnerIncluded: true,
    },
    {
      name: "Priority Support",
      creatorIncluded: false,
      producerIncluded: false,
      studioIncluded: true,
      partnerIncluded: true,
    },
    {
      name: "Executive Producer Services",
      creatorIncluded: false,
      producerIncluded: false,
      studioIncluded: false,
      partnerIncluded: true,
      tooltip: "Bespoke production services for select projects.",
    },
    {
      name: "Pitch Deck & Packaging Support",
      creatorIncluded: false,
      producerIncluded: false,
      studioIncluded: false,
      partnerIncluded: true,
    },
    {
      name: "Financing & Distribution Strategy",
      creatorIncluded: false,
      producerIncluded: false,
      studioIncluded: false,
      partnerIncluded: true,
    },
  ]

  let interval: "monthly" | "annual" = $state("annual")

  // --- REVISED LOGIC TO ALWAYS INCLUDE 'creator' and 'production-partner' ---
  const displayedPlans = $derived(
    pricingPlans.filter((plan) => {
      const idLower = plan.id.toLowerCase()
      if (idLower === "creator" || idLower === "production-partner") return true

      const isAnnual = idLower.includes("annual")
      if (interval === "monthly") {
        return !isAnnual
      } else {
        return isAnnual
      }
    }),
  )
</script>

<svelte:head>
  <title>Pricing - {WebsiteName}</title>
  <meta
    name="description"
    content="Plans for the Nanowrit Labs story development platform and producer services."
  />
</svelte:head>

<div class="min-h-[70vh] pb-16 pt-[8vh] px-4 bg-base-100 text-base-content">
  <MetaTags
    title={`Pricing - ${WebsiteName}`}
    description={`From powerful IP development tools to full-service production, we have a plan to get your project made.`}
  />

  <div class="text-center max-w-3xl mx-auto mb-12">
    <h1 class="text-4xl md:text-5xl font-bold mb-4">
      Find the Right Partnership
    </h1>
    <p class="text-lg md:text-xl text-base-content/80">
      From powerful IP development tools to full-service production, we have a
      plan to help you get your project made. All plans start with a free
      Creator account.
    </p>
  </div>

  <div class="flex justify-center items-center space-x-4 mb-12">
    <span
      class={interval === "monthly"
        ? "font-semibold text-primary"
        : "text-base-content/70"}>Monthly</span
    >
    <input
      type="checkbox"
      class="toggle toggle-primary toggle-lg"
      checked={interval === "annual"}
      onchange={() =>
        (interval = interval === "monthly" ? "annual" : "monthly")}
      aria-label="Toggle Annual Pricing"
    />
    <span
      class={interval === "annual"
        ? "font-semibold text-primary"
        : "text-base-content/70"}>Annual</span
    >
    <span class="badge badge-primary badge-outline ml-2">Save ~17%</span>
  </div>

  <div class="w-full max-w-7xl mx-auto my-8">
    <PricingModule
      plansToDisplay={displayedPlans}
      callToAction="Select Plan"
      highlightedPlanId="producer"
      center={true}
    />
  </div>

  <div class="max-w-6xl mx-auto mt-24">
    <h1 class="text-3xl font-bold text-center mb-4">Feature Comparison</h1>
    <p class="text-center text-base-content/70 mb-8">How the plans stack up.</p>

    <div class="overflow-x-auto shadow-md rounded-lg">
      <table class="table w-full text-sm">
        <thead class="text-base bg-base-200 sticky top-0 z-10 backdrop-blur-sm">
          <tr>
            <th class="w-1/4">Feature</th>
            <th class="text-center w-1/4"
              >Creator<br /><span class="text-xs font-normal">(Free)</span></th
            >
            <th class="text-center w-1/4 text-primary"
              >Producer<br /><span class="text-xs font-normal">(Paid)</span></th
            >
            <th class="text-center w-1/4 text-secondary"
              >Studio<br /><span class="text-xs font-normal">(Paid+)</span></th
            >
            <th class="text-center w-1/4 text-accent"
              >Production Partner<br /><span class="text-xs font-normal"
                >(Services)</span
              ></th
            >
          </tr>
        </thead>
        <tbody class="bg-base-100">
          {#each planFeatures as feature, i (feature.name)}
            {#if feature.header}
              <tr class="bg-base-300 font-semibold text-base">
                <td
                  colspan="5"
                  class={i === 0 ? "pt-4 pb-2" : "mt-2 pt-4 pb-2"}
                >
                  {feature.name}
                </td>
              </tr>
            {:else}
              <tr
                class="hover:bg-base-200/50 border-b border-base-200 last:border-b-0"
              >
                <td class="py-3">
                  {feature.name}
                  {#if feature.tooltip}
                    <div
                      class="tooltip tooltip-right"
                      data-tip={feature.tooltip}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        class="stroke-info shrink-0 w-4 h-4 ml-1 inline align-middle cursor-pointer"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                  {/if}
                </td>
                <td class="text-center py-3">
                  {#if feature.creatorString}
                    <span class="font-medium">{feature.creatorString}</span>
                  {:else if feature.creatorIncluded}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-6 h-6 mx-auto inline text-success"
                      ><use href="#checkcircle" /></svg
                    >
                  {:else}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5 mx-auto inline text-base-300"
                      ><use href="#nocircle" /></svg
                    >
                  {/if}
                </td>
                <td class="text-center py-3 bg-primary/5">
                  {#if feature.producerString}
                    <span class="font-medium text-primary"
                      >{feature.producerString}</span
                    >
                  {:else if feature.producerIncluded}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-6 h-6 mx-auto inline text-success"
                      ><use href="#checkcircle" /></svg
                    >
                  {:else}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5 mx-auto inline text-base-300"
                      ><use href="#nocircle" /></svg
                    >
                  {/if}
                </td>
                <td class="text-center py-3">
                  {#if feature.studioString}
                    <span class="font-medium text-secondary"
                      >{feature.studioString}</span
                    >
                  {:else if feature.studioIncluded}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-6 h-6 mx-auto inline text-success"
                      ><use href="#checkcircle" /></svg
                    >
                  {:else}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5 mx-auto inline text-base-300"
                      ><use href="#nocircle" /></svg
                    >
                  {/if}
                </td>
                <td class="text-center py-3">
                  {#if feature.partnerString}
                    <span class="font-medium text-accent"
                      >{feature.partnerString}</span
                    >
                  {:else if feature.partnerIncluded}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-6 h-6 mx-auto inline text-success"
                      ><use href="#checkcircle" /></svg
                    >
                  {:else}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5 mx-auto inline text-base-300"
                      ><use href="#nocircle" /></svg
                    >
                  {/if}
                </td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <div class="max-w-3xl mx-auto mt-24">
    <h1 class="text-3xl font-bold text-center mb-8">
      Frequently Asked Questions
    </h1>
    <div class="join join-vertical w-full shadow-md rounded-lg">
      <div class="collapse collapse-arrow join-item border border-base-300">
        <input type="radio" name="faq-accordion" id="faq-1" checked />
        <label
          for="faq-1"
          class="collapse-title text-lg font-medium cursor-pointer"
        >
          What are the limits of the Free 'Creator' plan?
        </label>
        <div class="collapse-content bg-base-200/50">
          <p>
            The Creator plan is designed to get you started. It includes our
            core world-building tools for <strong>1 project</strong>, allows
            <strong>1 team member</strong>
            (solo creator), and provides <strong>100MB</strong> of asset storage.
            You also get full access to our Discord community.
          </p>
        </div>
      </div>
      <div class="collapse collapse-arrow join-item border border-base-300">
        <input type="radio" name="faq-accordion" id="faq-2" />
        <label
          for="faq-2"
          class="collapse-title text-lg font-medium cursor-pointer"
        >
          Can I change my plan later?
        </label>
        <div class="collapse-content bg-base-200/50">
          <p>
            Absolutely! You can upgrade or downgrade between paid plans at any
            time through your account settings. Changes take effect at the start
            of your next billing cycle.
          </p>
        </div>
      </div>
      <div class="collapse collapse-arrow join-item border border-base-300">
        <input type="radio" name="faq-accordion" id="faq-3" />
        <label
          for="faq-3"
          class="collapse-title text-lg font-medium cursor-pointer"
        >
          When will AI features be available?
        </label>
        <div class="collapse-content bg-base-200/50">
          <p>
            AI Co-Pilots are a key part of our vision. We plan to roll out
            initial AI integrations (like concept image generation) to our
            Studio tier first. Check our <a
              href="/roadmap"
              class="link link-primary">Roadmap page</a
            > for the latest updates.
          </p>
        </div>
      </div>
      <div class="collapse collapse-arrow join-item border border-base-300">
        <input type="radio" name="faq-accordion" id="faq-4" />
        <label
          for="faq-4"
          class="collapse-title text-lg font-medium cursor-pointer"
        >
          What is the 'Production Partner' plan?
        </label>
        <div class="collapse-content bg-base-200/50">
          <p>
            The Production Partner plan is our hands-on service offering. For
            the most promising projects developed on our platform, our team
            offers executive producer services. This can include everything from
            refining your pitch and packaging your IP to helping you secure
            financing and distribution. It's a true partnership designed to take
            your project from our platform to the screen.
          </p>
        </div>
      </div>
    </div>
  </div>

  <svg style="display:none" version="2.0">
    <defs>
      <symbol
        id="checkcircle"
        viewBox="0 0 24 24"
        stroke-width="2"
        fill="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-4.105-4.498a.791.791 0 0 0-1.082.29l-3.828 6.63-1.733-2.08a.791.791 0 1 0-1.216 1.014l2.459 2.952a.792.792 0 0 0 .608.285.83.83 0 0 0 .068-.003.791.791 0 0 0 .618-.393L12.6 6.866a.791.791 0 0 0-.29-1.081z"
        />
      </symbol>
      <symbol id="nocircle" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm4,11H8a1,1,0,0,1,0-2h8a1,1,0,0,1,0,2Z"
        />
      </symbol>
    </defs>
  </svg>
</div>
