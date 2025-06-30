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
  <div>
    <div class="font-bold">
      <div class="text-lg">
        Welcome, {data.profile?.full_name ?? data.user?.email ?? "User"}!
      </div>
    </div>
  </div>
</div>

<!-- step 1 -->
<div class="my-6">
  <div>
    <h1 class="text-xl font-bold mb-1">Step 1</h1>
    <div class="flex flex-col gap-2">
      Make a wish list of everything you want to see in a movie. Any characters,
      any twists, themes, or genres you're passionate about. Don't filter. You
      can get started by clicking the <a href="account/wish-list" class="link"
        >Wish List</a
      >
      link.

      <div>
        <div>
          <h1 class="text-xl font-bold mb-1">Step 2</h1>
          <div>
            Then make a list of every premise that intrigues you. You'll find
            your way through the link that says <a
              href="account/premises"
              class="link">Premises</a
            >.
          </div>
        </div>
        <div>
          <div>
            <h1 class="text-xl font-bold mb-1">Step 3</h1>
            <div>a. Pick a premise from your list.</div>
            <div>
              b. Add any of the items in your wish list you wish to include in
              the story you are making.
            </div>
            <div>c. Click the 'Generate Spark' button.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- <div class="my-6">
  <a href="account/wish-list" class="text-xl font-bold mb-1 link">Wish List</a>
  <div
    class="stats shadow-sm stats-vertical sm:stats-horizontal sm:w-[420px]"
  ></div>
</div>
<div class="my-6">
  <a href="account/premises" class="text-xl font-bold mb-1 link">Premises</a>
  <div
    class="stats shadow-sm stats-vertical sm:stats-horizontal sm:w-[420px]"
  ></div>
</div> -->
