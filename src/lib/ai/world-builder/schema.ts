import { z } from "zod"
import { elementTypes, relationshipOntology } from "$lib/worldBuilding"

// 1. Flatten ALL Element Types into one list
// Result: ["Character", "Location", "Item", ...]
const validElementTypes = Object.values(elementTypes).flatMap((category) =>
  category.map((e) => e.name),
) as [string, ...string[]]

// 2. Flatten ALL Property Keys into one massive list
// Result: ["summary", "backstory", "age", "latitude", "owner", ...]
const allFieldNames = Object.values(elementTypes).flatMap((category) =>
  category.flatMap((e) => e.fields.map((f) => f.name)),
)
const validPropertyKeys = Array.from(new Set(allFieldNames)) as [
  string,
  ...string[],
]

// 3. Relationships Helper
const allRelationshipTypes = Object.values(relationshipOntology)
  .flatMap((targetMap) => Object.values(targetMap))
  .flat()
const uniqueRelationshipTypes = Array.from(new Set(allRelationshipTypes)) as [
  string,
  ...string[],
]

// 4. THE SIMPLIFIED SCHEMA
// No "const", no "oneOf". Just simple Enums.
export const extractionSchema = z.object({
  world: z.object({
    title: z.string(),
    description: z.string(),
  }),

  elements: z.array(
    z.object({
      name: z.string(),
      // Strict validation: Must be one of your defined types
      type: z
        .enum(validElementTypes)
        .describe("The classification of this element."),

      // We allow ANY valid key here. The Prompt (in nodes.ts) will ensure
      // the AI picks the *correct* keys for the chosen type.
      properties: z.array(
        z.object({
          key: z
            .enum(validPropertyKeys)
            .describe("The field name (e.g. 'summary', 'age')."),
          value: z.string().describe("The content for this field."),
        }),
      ),
    }),
  ),

  relationships: z.array(
    z.object({
      sourceName: z.string(),
      targetName: z.string(),
      type: z.enum(uniqueRelationshipTypes),
    }),
  ),

  isFinished: z.boolean(),
})
