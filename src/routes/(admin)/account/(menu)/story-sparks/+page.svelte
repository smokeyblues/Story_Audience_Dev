<script lang="ts">
  import type { PageData } from "./$types"

  let { data }: { data: PageData } = $props()
  let storySparks = $derived(data.storySparks ?? [])
</script>

<section>
  <h2 class="text-2xl font-semibold mb-6 border-b pb-2">Story Sparks</h2>

  {#if storySparks.length === 0}
    <div class="text-center py-10 bg-base-200 rounded-box">
      <p class="mb-4">You haven't generated any Story Sparks yet.</p>
      <a href="/account/premises" class="btn btn-primary"
        >Go to Premises to Generate</a
      >
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each storySparks as spark (spark.id)}
        <div
          class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
        >
          <div class="card-body">
            <h3 class="card-title">
              {spark.title?.[0] ?? "Untitled Spark"}
            </h3>
            <p class="text-sm text-gray-500 mb-2 line-clamp-3">
              {spark.logline}
            </p>
            {#if spark.premises}
              <div class="badge badge-outline text-xs">
                From: {spark.premises.premise.substring(0, 30)}...
              </div>
            {/if}
            <div class="card-actions justify-end mt-4">
              <a
                href={`/account/premises/${spark.premise_id}/sparks/${spark.id}`}
                class="btn btn-sm btn-secondary">View Spark</a
              >
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</section>
