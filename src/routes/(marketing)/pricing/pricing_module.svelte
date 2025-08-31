<script lang="ts">
  type PricingPlan = {
    id: string
    name: string
    description: string
    price: string
    priceIntervalName: string
    stripe_price_id: string | null
    stripe_product_id?: string | null // Modified to be optional or null
    features: string[]
  }

  interface Props {
    plansToDisplay: PricingPlan[]
    highlightedPlanId?: string
    callToAction: string
    currentPlanId?: string
    center?: boolean
  }

  let {
    plansToDisplay = [],
    highlightedPlanId = "",
    callToAction,
    currentPlanId = "",
    center = true,
  }: Props = $props()
</script>

<div
  class="flex flex-col lg:flex-row gap-10 {center
    ? 'place-content-center'
    : ''} flex-wrap items-stretch"
>
  {#each plansToDisplay as plan (plan.id)}
    <div
      class="card card-bordered {plan.id === highlightedPlanId ||
      plan.id.startsWith('producer') // Highlight both monthly and annual producer
        ? 'border-primary'
        : 'border-base-300'} shadow-lg flex flex-col w-full sm:w-[calc(50%-1.25rem)] lg:w-[calc(33.33%-1.8rem)] max-w-[340px] p-6"
    >
      <div class="flex-grow">
        <div class="text-xl font-bold mb-2">{plan.name}</div>
        <p
          class="mt-1 text-sm text-base-content/80 leading-relaxed min-h-[60px]"
        >
          {plan.description}
        </p>
        <div class="mt-4 pt-4 text-sm text-base-content/90">
          {#if plan.id !== "creator"}
            Includes Creator features, plus:
          {:else}
            Plan Includes:
          {/if}
          <ul class="list-disc list-inside mt-2 space-y-1 text-base-content/80">
            {#each plan.features as feature}
              <li>{feature}</li>
            {/each}
          </ul>
        </div>
      </div>

      <div class="pt-8 mt-auto">
        <div class="mb-4">
          <span class="text-4xl font-bold">{plan.price}</span>
          {#if plan.price !== "Contact Us" && plan.id !== "creator"}
            <span class="text-base-content/60"
              >/{plan.priceIntervalName.includes("year")
                ? "month (billed annually)"
                : "month"}</span
            >
          {:else if plan.price === "Contact Us"}
            <span class="text-base-content/60">/{plan.priceIntervalName}</span>
          {/if}
        </div>
        <div class="mt-6 pt-4">
          {#if plan.id === currentPlanId}
            <div
              class="btn btn-outline btn-success no-animation w-full cursor-default"
            >
              Current Plan
            </div>
          {:else if plan.id === "production-partner"}
            <a href="/contact_us" class="btn btn-accent w-full shadow-md">
              Contact Sales
            </a>
          {:else}
            <a
              href={"/account/subscribe/" +
                (plan.stripe_price_id === null
                  ? "free_plan"
                  : plan.stripe_price_id)}
              class="btn {plan.id === 'creator'
                ? 'btn-outline'
                : 'btn-primary'} w-full shadow-md"
              data-sveltekit-preload-data="off"
            >
              {plan.id === "creator" ? "Start for Free" : callToAction}
            </a>
          {/if}
        </div>
      </div>
    </div>
  {/each}
</div>
