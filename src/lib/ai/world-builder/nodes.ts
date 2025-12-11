import { SystemMessage } from "@langchain/core/messages"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { elementTypes } from "$lib/worldBuilding"
import { type GraphState } from "./state"
import { extractionSchema } from "./schema"
import { GEMINI_API_KEY } from "$env/static/private"

// REMOVE the top-level model instantiation
// const model = new ChatGoogleGenerativeAI({ ... })

// ADD a helper to get the model lazily
function getModel() {
  return new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.7,
    apiKey: GEMINI_API_KEY,
  })
}

/**
 * NODE 1: THE INTERVIEWER 🎤
 * Goal: Chat with the user to flesh out the world.
 * We removed the "extraction" instructions because this node ONLY chats.
 */
const INTERVIEWER_SYSTEM_PROMPT = `
You are an expert World-Building Assistant. Your goal is to interview the user to help them create a rich, immersive fictional world.

FOCUS AREAS:
- Genre and Tone
- Key Locations and Geography
- Major Factions or Groups
- Magic Systems or Technology
- Important Characters

GUIDELINES:
- Be creative, encouraging, and concise. 
- Ask one probing question at a time.
- Do not try to extract data or output JSON. Just chat.
`

export async function interviewerNode(state: GraphState) {
  // Use the helper here
  const model = getModel()

  const messages = [
    new SystemMessage(INTERVIEWER_SYSTEM_PROMPT),
    ...state.messages,
  ]

  const response = await model.invoke(messages)

  // We return a partial state update.
  // LangGraph appends this new message to the existing history.
  return {
    messages: [response],
  }
}

/**
 * NODE 2: THE ARCHITECT 🏗️
 * Goal: Silently analyze the conversation and build the database.
 * This runs ONLY when the graph decides the interview is over.
 */
export async function architectNode(state: GraphState) {
  // Use the helper here
  const model = getModel()
  const structuredModel = model.withStructuredOutput(extractionSchema)

  // 1. Create a "Rulebook" from your config
  // This creates a string like:
  // "Character: summary, backstory, age"
  // "Location: description, region, latitude..."
  const typeDefinitions = Object.values(elementTypes)
    .flat()
    .map((e) => `- ${e.name}: [${e.fields.map((f) => f.name).join(", ")}]`)
    .join("\n")

  const SYSTEM_PROMPT = `
  You are the World Architect. Analyze the conversation and extract the world details.
  
  CRITICAL INSTRUCTIONS:
  1. You must ONLY use the Element Types listed below. Do not invent new types like "Supernatural Being".
  2. For each element, you must ONLY use the valid fields listed for that type.
  
  VALID TYPES AND FIELDS:
  ${typeDefinitions}
  `

  const messages = [new SystemMessage(SYSTEM_PROMPT), ...state.messages]

  const extractedData = await structuredModel.invoke(messages)

  // TRANSFORMATION STEP 🔄
  // We convert the AI's "Key-Value Array" back into the "Record<string, any>"
  // that our State and Database expect.
  const normalizedElements = extractedData.elements.map((element) => {
    // 1. Create a clean object
    const propsObject: Record<string, unknown> = {}

    // 2. Flatten the array into the object
    if (Array.isArray(element.properties)) {
      element.properties.forEach((prop: { key: string; value: string }) => {
        propsObject[prop.key] = prop.value
      })
    }

    // 3. Return the element in the shape our GraphState expects
    return {
      name: element.name,
      type: element.type,
      properties: propsObject,
    }
  })

  return {
    // Overwrite the state with the final structured data
    world: extractedData.world,
    elements: normalizedElements,
    relationships: extractedData.relationships,
    isFinished: true,
  }
}
