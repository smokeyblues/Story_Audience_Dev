<script lang="ts">
  // import type { PageData } from "./$types"

  // let { data }: { data: PageData } = $props()
</script>

<div class="p-6">
  <h1 class="text-2xl font-bold mb-8">Story Building</h1>

  <!-- Save the Cat Method Section -->
  <div class="mb-8">
    <h2 class="text-xl font-bold mb-4">Save the Cat Method</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Wish List Card -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h3 class="card-title text-lg font-bold mb-3">Wish List</h3>
          <p class="text-base-content/80 mb-4">
            When ever you feel the urge, as a warm up or when ever you feel
            inspired, feel free to add items to your wish list. These can be
            anything you would love to see in a movie, game, or story. We will
            use these later when we are developing stories to take place in your
            universe.
          </p>
          <div class="card-actions justify-end">
            <a href="/account/wish-list" class="btn btn-primary"
              >Go to Wish List</a
            >
          </div>
        </div>
      </div>

      <!-- Premises Card -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h3 class="card-title text-lg font-bold mb-3">Premises</h3>
          <p class="text-base-content/80 mb-4">
            Or you can add any premise that strikes you into the Premises
            collection and save them for when the come in handy. When you are
            ready, you can take items from your wish list and combine them with
            any of these premises and produce a pitch package for a story to
            develop and produce.
          </p>
          <div class="card-actions justify-end">
            <a href="/account/premises" class="btn btn-primary"
              >Go to Premises</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Story Sparks Section -->
  <div class="mb-8">
    <h2 class="text-xl font-bold mb-4">Story Sparks</h2>
    <div class="grid grid-cols-1 gap-6">
      <!-- Story Sparks Card -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h3 class="card-title text-lg font-bold mb-3">Your Pitches</h3>
          <p class="text-base-content/80 mb-4">
            Your pitches will live here. You can revise them as many times as
            you like and share them or download them when you are ready to
            present.
          </p>
          <div class="card-actions justify-end">
            <a href="/account/story-sparks" class="btn btn-primary"
              >Go to Story Sparks</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
