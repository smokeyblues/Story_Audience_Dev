import { BaseMessage } from "@langchain/core/messages"

// 1. Define the shape of a single Element based on your DB & Logic
export interface WorldElement {
  name: string
  type: string // Matches 'elementTypes' from worldBuilding.ts (e.g., "Character", "Location")
  properties: Record<string, unknown> // Matches the 'fields' defined for that type
}

// 2. Define the shape of a Relationship
export interface WorldRelationship {
  sourceName: string // We use names to link them before they have DB IDs
  targetName: string
  type: string // Matches 'relationshipOntology' (e.g., "ALLY_OF", "LOCATED_IN")
  properties?: Record<string, unknown>
}

// 3. The Main Graph State
export interface GraphState {
  // The conversational history (for the Interviewer)
  messages: BaseMessage[]

  // The accumulated extraction (for the Architect)
  world: {
    title: string
    description: string
  }
  elements: WorldElement[]
  relationships: WorldRelationship[]

  // Control flow flags
  isFinished: boolean
}
