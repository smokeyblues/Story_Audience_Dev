<script lang="ts">
  import { enhance } from "$app/forms"
  import { tick } from "svelte"
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
  let chatContainer: HTMLElement

  // State for the final form submission
  let worldDataJSON = $state("")
  let formElement: HTMLFormElement

  // Auto-scroll to bottom of chat
  $effect(() => {
    if (messages.length && chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  })

  async function sendMessage() {
    if (!userInput.trim() || isLoading) return

    // 1. Add user message to UI
    const newMsg = { role: "user", content: userInput }
    messages = [...messages, newMsg]
    userInput = ""
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
          {msg.content}
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
    <div class="join w-full">
      <input
        type="text"
        class="input input-bordered join-item w-full"
        placeholder="Describe your world..."
        bind:value={userInput}
        onkeydown={(e) => e.key === "Enter" && sendMessage()}
        disabled={isLoading}
      />
      <button
        class="btn btn-primary join-item"
        onclick={sendMessage}
        disabled={isLoading}
      >
        Send
      </button>
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
