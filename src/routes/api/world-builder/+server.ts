import { json } from "@sveltejs/kit"
import { HumanMessage, AIMessage } from "@langchain/core/messages"
import { worldBuildingGraph } from "$lib/ai/world-builder/graph"

export const POST = async ({ request, locals }) => {
  // 1. SECURITY CHECK 🔒
  // We ensure only authenticated users can trigger the expensive AI agents.
  const { session } = await locals.safeGetSession()
  if (!session) {
    return json({ error: "Unauthorized" }, { status: 401 })
  }

  // 2. PARSE & TRANSLATE 🗣️
  // The frontend sends a JSON body with the conversation history.
  const body = await request.json()
  const { messages } = body

  // We map the simple JSON objects to LangChain's strictly typed Message objects.
  // This is crucial because LangGraph relies on these types to know who said what.
  const langchainMessages = messages.map(
    (m: { role: string; content: string }) => {
      if (m.role === "user") {
        return new HumanMessage(m.content)
      } else {
        return new AIMessage(m.content)
      }
    },
  )

  // 3. INVOKE THE GRAPH 🏎️
  // We pass the conversation history into the graph.
  // Because our graph state defines messages as "append-only" (x.concat(y)),
  // we usually just pass the NEW messages in a real persistent app.
  // BUT, since this is a stateless API, we pass the *entire* history,
  // and the graph treats it as the starting state for this run.
  const finalState = await worldBuildingGraph.invoke({
    messages: langchainMessages,
  })

  // 4. RETURN THE RESULT 📦
  // We return the extracted extracted data (if any) and the updated messages.
  // The frontend will use this to update the UI.
  return json({
    messages: finalState.messages,
    world: finalState.world,
    elements: finalState.elements,
    relationships: finalState.relationships,
    isFinished: finalState.isFinished,
  })
}
