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
    epString?: string
    epIncluded?: boolean
  }

  // --- NEW FEATURE TABLE ---
  // This is completely rebuilt to match your new pricing_plans.ts
  const planFeatures: PlanFeatureRow[] = [
    // --- Core Platform ---
    { name: "Core Platform", header: true },
    {
      name: "Story Development Tools",
      creatorIncluded: true,
      producerIncluded: true,
      epIncluded: true,
      tooltip:
        "Free, pro-level tools to build your world and validate your idea.",
    },
    {
      name: "Community Discord Access",
      creatorIncluded: true,
      producerIncluded: true,
      epIncluded: true,
    },
    {
      name: "Projects",
      creatorString: "Unlimited", // <-- CHANGED
      producerString: "Unlimited", // <-- CHANGED
      epString: "Unlimited",
    },

    // --- Co-op Governance ---
    { name: "Co-op Governance", header: true },
    {
      name: "Annual Fund Contribution",
      creatorString: "—",
      producerString: "$250",
      epString: "$500",
      tooltip: "The annual fee that fills the Production Fund.",
    },
    {
      name: "Greenlight Votes",
      creatorString: "—", // <-- CHANGED (Creators don't get a base vote)
      producerString: "5",
      epString: "10",
      tooltip: "Votes you can cast on projects up for a greenlight vote.",
    },
    {
      name: "Vote Splitting",
      creatorIncluded: false,
      producerIncluded: true,
      epIncluded: true,
      tooltip: "Spread your votes across multiple projects you believe in.",
    },

    // --- Studio Perks ---
    { name: "Studio Perks", header: true },
    {
      name: "Name featured in Credits",
      creatorIncluded: true, // <-- CHANGED
      producerIncluded: true,
      epIncluded: true,
      tooltip: "Get your name in the credits of every project.",
    },
    {
      name: "Potential IMDb Credit",
      creatorIncluded: true, // <-- CHANGED
      producerIncluded: true,
      epIncluded: true,
      tooltip: "For film & TV projects, we submit all members for credit.",
    },
  ]

  // --- **** THIS IS THE FIX **** ---
  // We want to display ALL plans from pricing_plans.ts
  const displayedPlans = pricingPlans
</script>

<svelte:head>
  <title>Become a Producer - {WebsiteName}</title>
  <meta
    name="description"
    content="Join the co-op. Fund the projects you want to see made."
  />
</svelte:head>

<div class="min-h-[70vh] pb-16 pt-[8vh] px-4 bg-base-100 text-base-content">
  <MetaTags
    title={`Become a Producer - ${WebsiteName}`}
    description={`Join the co-op. Fund the projects you want to see made.`}
  />

  <div class="text-center max-w-3xl mx-auto mb-12">
    <h1 class="text-4xl md:text-5xl font-bold mb-4">
      Join the Greenlight Committee
    </h1>
    <p class="text-lg md:text-xl text-base-content/80">
      Your annual subscription isn't a fee—it's your contribution to the
      Production Fund and the power to vote on what we make next.
    </p>
  </div>

  <div class="w-full max-w-7xl mx-auto my-8">
    <PricingModule
      plansToDisplay={displayedPlans}
      callToAction="Select Plan"
      highlightedPlanId="producer_annual"
      center={true}
    />
  </div>

  <div class="max-w-6xl mx-auto mt-24">
    <h1 class="text-3xl font-bold text-center mb-4">Feature Comparison</h1>
    <p class="text-center text-base-content/70 mb-8">
      How the tiers stack up. All paid plans are billed annually.
    </p>

    <div class="overflow-x-auto shadow-md rounded-lg">
      <table class="table w-full text-sm">
        <thead class="text-base bg-base-200 sticky top-0 z-10 backdrop-blur-sm">
          <tr>
            <th class="w-2/5">Feature</th>
            <th class="text-center w-1/5"
              >Creator<br /><span class="text-xs font-normal">(Free)</span></th
            >
            <th class="text-center w-1/5 text-primary"
              >Producer<br /><span class="text-xs font-normal">($250/yr)</span
              ></th
            >
            <th class="text-center w-1/5 text-secondary"
              >Executive Producer<br /><span class="text-xs font-normal"
                >($500/yr)</span
              ></th
            >
          </tr>
        </thead>
        <tbody class="bg-base-100">
          {#each planFeatures as feature, i (feature.name)}
            {#if feature.header}
              <tr class="bg-base-300 font-semibold text-base">
                <td
                  colspan="4"
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
                  {#if feature.epString}
                    <span class="font-medium text-secondary"
                      >{feature.epString}</span
                    >
                  {:else if feature.epIncluded}
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
      <!-- <div class="collapse collapse-arrow join-item border border-base-300">
        <input type="radio" name="faq-accordion" id="faq-1" checked />
        <label
          for="faq-1"
          class="collapse-title text-lg font-medium cursor-pointer"
        >
          How does {WebsiteName} make money?
        </label>
        <div class="collapse-content bg-base-200/50">
          <p>
            We believe in 100% transparency. Our studio is funded in two ways:
          </p>
          <ul class="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong>Platform Fee:</strong> 10% of all incoming subscriptions is
              used to fund our platform operations, development, and staff.
            </li>
            <li>
              <strong>Project Revenue Share:</strong> When a project is successful,
              it shares 50% of its revenue back—half of that (25% of the total) goes
              to the platform, and the other half (25%) goes back into the Production
              Fund.
            </li>
          </ul>
        </div>
      </div> -->
      <div class="collapse collapse-arrow join-item border border-base-300">
        <input type="radio" name="faq-accordion" id="faq-2" />
        <label
          for="faq-2"
          class="collapse-title text-lg font-medium cursor-pointer"
        >
          Where does my subscription fee go?
        </label>
        <div class="collapse-content bg-base-200/50">
          <p>
            The vast majority—90%—of your annual subscription fee goes directly
            into the collective Production Fund. The other 10% is our Platform
            Fee (see above).
          </p>
        </div>
      </div>
      <div class="collapse collapse-arrow join-item border border-base-300">
        <input type="radio" name="faq-accordion" id="faq-3" />
        <label
          for="faq-3"
          class="collapse-title text-lg font-medium cursor-pointer"
        >
          What's the difference between Producer and Executive Producer?
        </label>
        <div class="collapse-content bg-base-200/50">
          <p>
            Both tiers give you the power to vote and get production credits.
            The difference is the scale of your influence:
          </p>
          <ul class="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong>Producers ($250/yr)</strong> contribute $250 to the fund and
              wield 5 Greenlight Votes.
            </li>
            <li>
              <strong>Executive Producers ($500/yr)</strong> contribute $500 to the
              fund and wield 10 Greenlight Votes.
            </li>
          </ul>
        </div>
      </div>
      <div class="collapse collapse-arrow join-item border border-base-300">
        <input type="radio" name="faq-accordion" id="faq-4" />
        <label
          for="faq-4"
          class="collapse-title text-lg font-medium cursor-pointer"
        >
          Can I upgrade from Producer to EP?
        </label>
        <div class="collapse-content bg-base-200/50">
          <p>
            Yes! You can upgrade your tier at any time through your account
            settings. You'll just pay the difference for the remainder of your
            annual subscription and your vote count will be updated immediately.
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
      </symbol>Address: 1 1st Street, City, State 12345
    </defs>
  </svg>
</div>
