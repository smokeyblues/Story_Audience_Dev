<script lang="ts">
  import { enhance } from "$app/forms"
  import { invalidateAll } from "$app/navigation"
  import { page } from "$app/stores"
  import type { ActionData, PageData, SubmitFunction } from "./$types"

  let { data }: { data: PageData } = $props()
  let scripts = $derived(data.scripts ?? [])

  const form = $derived(($page as { form: ActionData }).form)

  $effect(() => {
    if (form?.success) {
      // Clear the file input after a successful upload
      const fileInput = document.getElementById(
        "script-file",
      ) as HTMLInputElement
      if (fileInput) {
        fileInput.value = ""
      }
      invalidateAll()
    }
  })

  function formatBytes(bytes: number | null | undefined, decimals = 2) {
    if (!bytes || bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  const handleDelete: SubmitFunction = ({ formData, cancel }) => {
    const fileName = formData.get("fileName")
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      cancel()
    }
  }
</script>

<section>
  <h2 class="text-2xl font-semibold mb-4 border-b pb-2">Scripts</h2>
  <p class="text-sm mb-6">
    Upload scripts, treatments, or other documents related to your story.
  </p>

  <!-- List of Uploaded Scripts -->
  <div class="space-y-3 mb-8">
    {#if scripts.length > 0}
      {#each scripts as script (script.id)}
        <div
          class="card card-side bg-base-200 shadow-sm transition-shadow hover:shadow-md"
        >
          <div class="card-body p-4">
            <div class="flex justify-between items-center gap-4">
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold truncate" title={script.file_name}>
                  {script.file_name}
                </h3>
                <p class="text-xs text-base-content/70">
                  {formatBytes(script.size_bytes)}
                </p>
              </div>
              <div class="card-actions flex-shrink-0">
                <a
                  href={script.signedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-sm btn-outline"
                  aria-disabled={!script.signedUrl}
                  title={script.signedUrl ? "View Script" : "Processing..."}
                >
                  View
                </a>
                <form
                  method="POST"
                  action="?/deleteScript"
                  use:enhance={handleDelete}
                >
                  <input type="hidden" name="assetId" value={script.id} />
                  <input
                    type="hidden"
                    name="filePath"
                    value={script.file_path}
                  />
                  <input
                    type="hidden"
                    name="fileName"
                    value={script.file_name}
                  />
                  <button type="submit" class="btn btn-sm btn-ghost text-error"
                    >Delete</button
                  >
                </form>
              </div>
            </div>
          </div>
        </div>
      {/each}
    {:else}
      <div class="text-center p-6 bg-base-200 rounded-lg">
        <p>No scripts have been uploaded for this world yet.</p>
      </div>
    {/if}
  </div>

  <!-- Upload Form -->
  <form
    method="POST"
    action="?/uploadScript"
    enctype="multipart/form-data"
    use:enhance
  >
    <div class="form-control w-full max-w-md">
      <label for="script-file" class="label">
        <span class="label-text">Upload a new script</span>
      </label>
      <input
        type="file"
        name="scriptFile"
        id="script-file"
        class="file-input file-input-bordered w-full"
        required
      />
    </div>
    <button type="submit" class="btn btn-secondary mt-4">Upload Script</button>

    {#if form?.action === "uploadScript" || form?.action === "deleteScript"}
      {#if form.success}
        <p class="text-success text-sm mt-2 inline-block ml-2">
          {form.message}
        </p>
      {/if}
      {#if form.error}
        <p class="text-error text-sm mt-2 inline-block ml-2">{form.error}</p>
      {/if}
    {/if}
  </form>
</section>
