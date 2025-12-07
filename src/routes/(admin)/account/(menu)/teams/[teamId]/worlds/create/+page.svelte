<script lang="ts">
  import { enhance } from "$app/forms"
  import { tick } from "svelte"
  import { supabase } from "$lib/supabaseClient" //

  // State for the chat
  let messages = $state([
    {
      role: "model",
      text: "I'm ready to help you build a new world. What kind of story are you trying to tell?",
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
    const newMsg = { role: "user", text: userInput }
    messages = [...messages, newMsg]
    userInput = ""
    isLoading = true

    try {
      console.log("Sending message to agent:", newMsg)
      // 2. Call the Edge Function using supabase.functions.invoke/+page.svelte]
      const { data, error } = await supabase.functions.invoke(
        "world-creator-agent",
        {
          body: {
            messages: messages.map((m) => ({
              role: m.role === "model" ? "model" : "user",
              parts: [{ text: m.text }],
            })),
          },
        },
      )
      console.log("Agent response:", { data, error })

      if (error) {
        throw error
      }

      if (data.error) {
        throw new Error(data.error)
      }

      if (data.reply) {
        messages = [...messages, { role: "model", text: data.reply }]
      }

      // 3. Handle Completion
      if (data.is_finished && data.extracted_data) {
        isFinished = true
        worldDataJSON = JSON.stringify(data.extracted_data)

        // Wait for the hidden input to populate, then submit
        await tick()
        if (formElement) formElement.requestSubmit()
      }
    } catch (e) {
      console.error("Agent Error:", e)
      messages = [
        ...messages,
        {
          role: "model",
          text: "I encountered an error trying to process that. Could you try again?",
        },
      ]
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
          {msg.text}
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
    <input type="hidden" name="worldData" value={worldDataJSON} />
  </form>
</div>
