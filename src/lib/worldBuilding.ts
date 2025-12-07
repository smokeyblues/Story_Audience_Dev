// Element Type Definitions
export const elementTypes = {
  "Core Entities": [
    {
      name: "Character",
      fields: [
        { name: "summary", label: "Summary", type: "textarea" },
        { name: "backstory", label: "Backstory", type: "textarea" },
        { name: "age", label: "Age", type: "text" },
      ],
    },
    {
      name: "Location",
      fields: [
        { name: "description", label: "Description", type: "textarea" },
        { name: "region", label: "Region", type: "text" },
        { name: "latitude", label: "Latitude", type: "number" },
        { name: "longitude", label: "Longitude", type: "number" },
      ],
    },
    {
      name: "Item",
      fields: [
        { name: "description", label: "Description", type: "textarea" },
        { name: "function", label: "Function", type: "text" },
        { name: "owner", label: "Owner", type: "text" },
      ],
    },
    {
      name: "Species/Race",
      fields: [
        { name: "description", label: "Description", type: "textarea" },
        { name: "abilities", label: "Abilities", type: "textarea" },
      ],
    },
    {
      name: "Creature",
      fields: [
        { name: "description", label: "Description", type: "textarea" },
        { name: "habitat", label: "Habitat", type: "text" },
      ],
    },
  ],
  "Social & Political": [
    {
      name: "Faction",
      fields: [
        { name: "description", label: "Description", type: "textarea" },
        { name: "goals", label: "Goals", type: "textarea" },
        { name: "leader", label: "Leader", type: "text" },
      ],
    },
    {
      name: "Culture",
      fields: [
        { name: "description", label: "Description", type: "textarea" },
        { name: "customs", label: "Customs", type: "textarea" },
      ],
    },
    {
      name: "Government",
      fields: [
        { name: "type", label: "Type of Government", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
      ],
    },
    {
      name: "Religion/Mythology",
      fields: [
        { name: "description", label: "Description", type: "textarea" },
        { name: "deities", label: "Deities", type: "textarea" },
      ],
    },
  ],
  "Narrative & Abstract": [
    {
      name: "Event",
      fields: [
        { name: "description", label: "Description", type: "textarea" },
        { name: "date", label: "Date", type: "text" },
        { name: "participants", label: "Participants", type: "textarea" },
      ],
    },
    {
      name: "Lore Entry",
      fields: [{ name: "text", label: "Lore Text", type: "textarea" }],
    },
    {
      name: "Theme",
      fields: [{ name: "description", label: "Description", type: "textarea" }],
    },
    {
      name: "Plot Point",
      fields: [{ name: "description", label: "Description", type: "textarea" }],
    },
  ],
  "Systems & Rules": [
    {
      name: "Magic System / Technology",
      fields: [
        { name: "description", label: "Description", type: "textarea" },
        { name: "rules", label: "Rules & Limitations", type: "textarea" },
      ],
    },
    {
      name: "Language",
      fields: [
        { name: "description", label: "Description", type: "textarea" },
        { name: "alphabet", label: "Alphabet/Symbols", type: "textarea" },
      ],
    },
    {
      name: "Calendar/Time",
      fields: [{ name: "description", label: "Description", type: "textarea" }],
    },
  ],
}

// Relationship Ontology
export const relationshipOntology: Record<string, Record<string, string[]>> = {
  Character: {
    Character: [
      "ALLY_OF",
      "ENEMY_OF",
      "PARENT_OF",
      "CHILD_OF",
      "SIBLING_OF",
      "SPOUSE_OF",
    ],
    Location: ["LIVES_IN", "BORN_IN", "DIED_IN", "VISITED"],
    Item: ["OWNS", "WIELDS", "CREATED"],
    Faction: ["MEMBER_OF", "LEADS", "FOUNDED"],
    Event: ["PARTICIPATED_IN"],
    Culture: ["BELONGS_TO"],
  },
  Location: {
    Location: ["LOCATED_IN", "CONTAINS"],
    Faction: ["HEADQUARTERS_OF", "TERRITORY_OF"],
    Event: ["SITE_OF"],
    Culture: ["HEARTLAND_OF"],
  },
  Item: {
    Character: ["OWNED_BY", "CREATED_BY"],
    Location: ["LOCATED_AT", "FORGED_AT"],
    Faction: ["SYMBOL_OF"],
  },
  Faction: {
    Character: ["LED_BY", "FOUNDED_BY"],
    Location: ["BASED_IN"],
    Faction: ["ALLIED_WITH", "AT_WAR_WITH"],
  },
  Event: {
    Character: ["INVOLVED"],
    Location: ["TOOK_PLACE_AT"],
    Faction: ["PARTICIPANT"],
  },
  Culture: {
    Character: ["PRACTICED_BY"],
    Location: ["ORIGINATED_IN"],
  },
}
