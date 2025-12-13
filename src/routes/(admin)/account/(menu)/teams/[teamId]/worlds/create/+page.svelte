<script lang="ts">
  import { enhance } from "$app/forms"
  import { tick } from "svelte"
  import MarkdownDisplay from "$lib/components/MarkdownDisplay.svelte"
  import { Send, Maximize2, Minimize2 } from "lucide-svelte"
  // import { supabase } from "$lib/supabaseClient" // Remove this import

  // let { data } = $props() // unused
  // let supabase = $derived(data.supabase) // unused

  // State for the chat
  let messages = $state([
    {
      role: "model",
      content:
        "I'm ready to help you build a new world. What kind of story are you trying to tell?",
    },
  ])
  let userInput = $state("")
  let isLoading = $state(false)
  let isFinished = $state(false)
  let isFullscreen = $state(false)
  let chatContainer: HTMLElement
  let textareaElement = $state<HTMLTextAreaElement>()

  // State for the final form submission
  let worldDataJSON = $state("")
  let formElement: HTMLFormElement

  // Auto-scroll to bottom of chat
  $effect(() => {
    if (messages.length && chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  })

  function adjustHeight() {
    if (!textareaElement) return
    textareaElement.style.height = "auto"

    if (!isFullscreen) {
      textareaElement.style.height =
        Math.min(textareaElement.scrollHeight, 150) + "px"
    } else {
      textareaElement.style.height = "100%"
    }
  }

  // Watch isFullscreen changes to reset height if needed
  $effect(() => {
    if (isFullscreen && textareaElement) {
      // When entering fullscreen, let CSS handle height (h-full)
      textareaElement.style.height = ""
    } else if (!isFullscreen && textareaElement) {
      // When exiting, re-adjust to content
      adjustHeight()
    }
  })

  async function sendMessage() {
    if (!userInput.trim() || isLoading) return

    // 1. Add user message to UI
    const newMsg = { role: "user", content: userInput }
    messages = [...messages, newMsg]
    userInput = ""
    if (textareaElement) {
      textareaElement.style.height = "auto"
    }
    isLoading = true

    try {
      const response = await fetch("/api/world-builder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch")
      }

      // 3. Update the conversation
      // The graph returns the full updated history, so we sync with that.
      // NEW code to add
      // 3. Update the conversation
      messages = data.messages.map(
        (m: {
          type: string
          id?: string[]
          content?: string
          kwargs?: { content: string }
        }) => {
          // ROLE: Check both the simple 'type' and the serialized 'id' array
          const isHuman =
            m.type === "human" ||
            (Array.isArray(m.id) && m.id.includes("HumanMessage"))

          // CONTENT: content might be at the top level OR hidden inside 'kwargs'
          const content = m.content || m.kwargs?.content || ""

          return {
            role: isHuman ? "user" : "model",
            content: content,
          }
        },
      )

      // 4. Check for the "Finish" signal
      if (data.isFinished) {
        isFinished = true

        // This is where we receive the structured data from the Architect!
        // You can save this to your form state or display a preview.
        console.log("Architect Output:", data.world, data.elements)

        // Example: Auto-fill the hidden form field if you want to save it immediately
        worldDataJSON = JSON.stringify({
          world: data.world,
          elements: data.elements,
          relationships: data.relationships,
        })

        await tick()
        formElement.requestSubmit()
      }
    } catch (e) {
      console.error(e)
      // Handle error state here (e.g., show a toast)
    } finally {
      isLoading = false
    }
  }
</script>

<div class="max-w-2xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
  <h2 class="text-2xl font-bold mb-4">World Architect</h2>

  <div
    bind:this={chatContainer}
    class="flex-1 overflow-y-auto bg-base-200 rounded-box p-4 space-y-4 mb-4 border border-base-300"
  >
    {#each messages as msg}
      <div class="chat {msg.role === 'user' ? 'chat-end' : 'chat-start'}">
        <div
          class="chat-bubble {msg.role === 'user'
            ? 'chat-bubble-primary'
            : 'chat-bubble-secondary'}"
        >
          <MarkdownDisplay content={msg.content} />
        </div>
      </div>
    {/each}
    {#if isLoading}
      <div class="chat chat-start">
        <div class="chat-bubble chat-bubble-secondary animate-pulse">
          Thinking...
        </div>
      </div>
    {/if}
  </div>

  {#if !isFinished}
    <div
      class={isFullscreen
        ? "fixed inset-0 z-50 bg-base-100/90 backdrop-blur-sm p-4 flex flex-col justify-center items-center"
        : "join w-full relative"}
    >
      <div
        class="w-full flex flex-col {isFullscreen
          ? 'max-w-2xl h-[calc(100vh-4rem)] bg-base-100 rounded-box shadow-xl border border-base-300 p-4'
          : ''}"
      >
        {#if isFullscreen}
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-bold text-lg">Expanded Editor</h3>
            <button
              class="btn btn-ghost btn-sm"
              onclick={() => (isFullscreen = false)}
              aria-label="Exit fullscreen"
            >
              <Minimize2 size={20} />
            </button>
          </div>
        {/if}

        <div
          class="relative w-full {isFullscreen ? 'flex-1 h-full' : 'join-item'}"
        >
          {#if !isFullscreen && (userInput.length > 50 || userInput.includes("\n"))}
            <button
              class="absolute top-2 right-2 btn btn-xs btn-circle btn-ghost z-10"
              onclick={() => (isFullscreen = true)}
              title="Expand to fullscreen"
            >
              <Maximize2 size={16} />
            </button>
          {/if}

          <textarea
            bind:this={textareaElement}
            class="textarea w-full {isFullscreen
              ? 'h-full resize-none p-4 text-lg focus:outline-none border-none shadow-none'
              : 'textarea-bordered resize-none min-h-12 py-3'}"
            placeholder="Describe your world..."
            bind:value={userInput}
            oninput={adjustHeight}
            onkeydown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            disabled={isLoading}
            rows="1"
          ></textarea>
        </div>

        {#if !isFullscreen}
          <button
            class="btn btn-primary join-item"
            onclick={sendMessage}
            disabled={isLoading}
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        {/if}

        {#if isFullscreen}
          <div class="mt-4 flex justify-end">
            <button
              class="btn btn-primary"
              onclick={() => {
                isFullscreen = false
                sendMessage()
              }}
              disabled={isLoading}
            >
              Send <Send size={20} class="ml-2" />
            </button>
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <div class="alert alert-success">
      <span>World Architect has finished. Constructing your database...</span>
      <span class="loading loading-spinner loading-sm"></span>
    </div>
  {/if}

  <form
    method="POST"
    action="?/createWorldFromAgent"
    use:enhance
    bind:this={formElement}
    class="hidden"
  >
    <input type="hidden" name="worldDataJSON" value={worldDataJSON} />
  </form>
</div>
