<!--
<script lang="ts">
  import PricingModule from "../../../(marketing)/pricing/pricing_module.svelte"
</script>

<svelte:head>
  <title>Select a Plan</title>
</svelte:head>

<div
  class="text-center content-center min-h-[100vh] pb-12 mt-4 flex items-center place-content-center"
>
  <div class="flex flex-col w-full px-6">
    <div>
      <h1 class="text-2xl font-bold mb-2">Select a Plan</h1>
      <div class="mb-6">
        View our <a href="/pricing" class="link">pricing page</a> for details.
      </div>
      <PricingModule callToAction="Select Plan" plansToDisplay={[]} />
    </div>
  </div>
</div>
-->
<script lang="ts">
  import { goto } from "$app/navigation"
  import { onMount } from "svelte"

  onMount(() => {
    goto("/account/subscribe/free_plan")
  })
</script>

<div class="text-center p-8">
  <h1 class="text-2xl font-bold">Setting up your free account...</h1>
  <p>Please wait while we redirect you.</p>
</div>
