import { StateGraph, START, END } from "@langchain/langgraph"
import { type GraphState } from "./state"
import { interviewerNode, architectNode } from "./nodes"

// 1. DEFINE THE LOGIC 🧠
function shouldContinue(state: GraphState) {
  const { messages } = state

  // If we have 10 or more messages, switch to the architect
  if (messages.length >= 10) {
    return "architect"
  }

  // Otherwise, stop and return to the user
  return END
}

// 2. BUILD THE GRAPH 🏗️
// We use chaining (the dots) so TypeScript tracks the node names correctly.
const workflow = new StateGraph<GraphState>({
  channels: {
    messages: {
      value: (x: GraphState["messages"], y: GraphState["messages"]) =>
        x.concat(y),
      default: () => [],
    },
    world: {
      value: (x: GraphState["world"], y: GraphState["world"]) => y,
      default: () => ({ title: "", description: "" }),
    },
    elements: {
      value: (x: GraphState["elements"], y: GraphState["elements"]) => y,
      default: () => [],
    },
    relationships: {
      value: (x: GraphState["relationships"], y: GraphState["relationships"]) =>
        y,
      default: () => [],
    },
    isFinished: {
      value: (x: GraphState["isFinished"], y: GraphState["isFinished"]) => y,
      default: () => false,
    },
  },
})
  .addNode("interviewer", interviewerNode)
  .addNode("architect", architectNode)
  // Instead of setEntryPoint, we add an edge from START
  .addEdge(START, "interviewer")
  .addConditionalEdges("interviewer", shouldContinue, {
    architect: "architect",
    [END]: END,
  })
  .addEdge("architect", END)

// 3. COMPILE
export const worldBuildingGraph = workflow.compile()
