<script lang="ts">
  import { getContext } from "svelte"
  import type { PageData } from "./$types"
  import type { Writable } from "svelte/store"

  let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("home")

  let { data }: { data: PageData } = $props()
</script>

<svelte:head>
  <title>Account</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-1">Dashboard</h1>
<div class="max-w-lg mt-2">
  <!-- <svg
    xmlns="http://www.w3.org/2000/svg"
    class="stroke-current shrink-0 h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    ><path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    /></svg
  > -->
  <div>
    <div class="font-bold">
      <!-- Demo Content, Bitches -->
      <div class="text-lg">
        Welcome, {data.profile?.full_name ?? data.user?.email ?? "User"}!
      </div>
    </div>
    <!-- <div class="my-2">
      This page currently serves as a provisional placeholder. Kindly supplant
      this content with the bespoke features and refined functionality of your
      application.
    </div> -->
  </div>
</div>

<div class="my-6">
  <a href="account/wish-list" class="text-xl font-bold mb-1 link">Wish List</a>
  <div class="stats shadow-sm stats-vertical sm:stats-horizontal sm:w-[420px]">
    <!-- <div class="stat place-items-center">
      <div class="stat-title">Downloads</div>
      <div class="stat-value">31K</div>
      <div class="stat-desc">↗︎ 546 (2%)</div>
    </div>

    <div class="stat place-items-center">
      <div class="stat-title">Turkey Tits</div>
      <div class="stat-value text-secondary">4,200</div>
      <div class="stat-desc">↗︎ 40 (2%)</div>
    </div> -->
  </div>
</div>
<div class="my-6">
  <a href="account/premises" class="text-xl font-bold mb-1 link">Premises</a>
  <div class="stats shadow-sm stats-vertical sm:stats-horizontal sm:w-[420px]">
    <!-- <div class="stat place-items-center">
      <div class="stat-title">New Registers</div>
      <div class="stat-value">1,200</div>
      <div class="stat-desc">↘︎ 90 (14%)</div>
    </div>

    <div class="stat place-items-center">
      <div class="stat-title">Churned Accounts</div>
      <div class="stat-value">42</div>
      <div class="stat-desc">↘︎ 6 (12%)</div>
    </div> -->
  </div>
</div>
<div class="my-6">
  <h1 class="text-xl font-bold mb-1">Metrics / Sparks</h1>
  <div class="stats shadow-sm stats-vertical sm:stats-horizontal sm:w-[420px]">
    <!-- <div class="stat place-items-center">
      <div class="stat-title text-success">Revenue</div>
      <div class="stat-value text-success">$4200</div>
      <div class="stat-desc">↗︎ $180 (4%)</div>
    </div>

    <div class="stat place-items-center">
      <div class="stat-title">New Subscribers</div>
      <div class="stat-value">16</div>
      <div class="stat-desc">↘︎ 1 (%7)</div>
    </div> -->
  </div>
</div>
