<script lang="ts">
  import { marked } from "marked"
  import DOMPurify from "dompurify"
  import { browser } from "$app/environment"

  let { content } = $props()
  let htmlContent = $state<string | null>(null)

  $effect(() => {
    if (!browser) return

    // Ensure content is a string
    const markdownText = content || ""

    // marked.parse can be async if async options are set, but default is sync.
    // We handle both just in case.
    const raw = marked.parse(markdownText)

    if (raw instanceof Promise) {
      raw.then((res) => {
        htmlContent = DOMPurify.sanitize(res)
      })
    } else {
      htmlContent = DOMPurify.sanitize(raw)
    }
  })
</script>

{#if htmlContent !== null}
  <!-- 
    prose: Adds typography styles
    prose-sm: Smaller font size suitable for chat
    max-w-none: Allow full width of the container
    break-words: Prevent overflow
    prose-headings:text-inherit etc: Try to inherit colors from the chat bubble
  -->
  <div
    class="prose prose-sm max-w-none wrap-break-word text-black prose-headings:text-black prose-p:text-black prose-strong:text-black prose-a:text-black prose-ul:text-black prose-ol:text-black"
  >
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html htmlContent}
  </div>
{:else}
  <div class="whitespace-pre-wrap wrap-break-word text-black">{content}</div>
{/if}
