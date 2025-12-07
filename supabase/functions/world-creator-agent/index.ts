// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Edge function 'world-creator-agent' started")

Deno.serve(async (req) => {
  // --- 1. Handle CORS Preflight Request ---
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    })
  }

  try {
    // --- 2. Extract User Input ---
    const body = await req.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({
          error: "Missing or invalid 'messages' array in request body",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        },
      )
    }

    // --- 3. Construct the AI Prompt ---
    const systemPrompt = `
      You are an expert World-Building Assistant. Your goal is to interview the user to help them create a rich, immersive fictional world.
      
      PROCESS:
      1.  **Interview Phase**: Ask probing, creative questions to flesh out the world. Focus on:
          -   Genre and Tone.
          -   Core Conflicts.
          -   Key Locations and Geography.
          -   Major Factions or Groups.
          -   Magic Systems or Technology.
          -   Important Characters.
      2.  **Extraction Phase**: After about 5 turns of conversation (or if the user asks to finish), you MUST conclude the interview and extract the data into a structured format.
      
      OUTPUT FORMAT:
      You must always return a JSON object.
      
      If you are continuing the interview:
      {
        "reply": "Your conversational response and next question here.",
        "is_finished": false
      }
      
      If you are finishing the interview (approx 5 turns reached or user says "done"):
      {
        "reply": "Great! I've gathered enough information to build the foundation of your world. I'm creating it now along with some key elements we discussed.",
        "is_finished": true,
        "extracted_data": {
          "world": {
            "name": "Name of the World",
            "description": "A concise but evocative description of the world."
          },
          "elements": [
            {
              "name": "Name of Element",
              "type": "One of: Character, Location, Item, Species/Race, Creature, Faction, Culture, Government, Religion/Mythology, Event, Lore Entry, Theme, Plot Point, Magic System / Technology, Language, Calendar/Time",
              "properties": {
                "description": "Main description of the element",
                "details": "Any additional details or specific properties (e.g. age, goals, region) as a single string."
              }
            }
          ],
          "premises": [
            "A single sentence story premise set in this world.",
            "Another premise idea based on the discussion."
          ]
        }
      }
      
      CURRENT CONVERSATION HISTORY:
      ${JSON.stringify(messages)}
      
      INSTRUCTIONS:
      - Be creative, encouraging, and concise.
      - Do not ask more than one complex question at a time.
      - If the user provides a short or vague answer, ask for specific details to inspire them.
      - When extracting data, try to identify at least 3-5 distinct elements (Characters, Locations, Factions, etc.) and 2-3 Premises.
    `

    // --- 4. API Call to Google Gemini ---
    const apiKey = Deno.env.get("GEMINI_API_KEY")
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY environment variable.")
    }

    // Using gemini-2.5-pro
    // Note: The user mentioned "gemini-2.5-pro" was working before, but standard models are typically 1.0 or 1.5.
    // However, if they have access to a specific 2.5 endpoint or meant a different string, we revert to their exact provided code.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: systemPrompt,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            reply: { type: "STRING" },
            is_finished: { type: "BOOLEAN" },
            extracted_data: {
              type: "OBJECT",
              properties: {
                world: {
                  type: "OBJECT",
                  properties: {
                    name: { type: "STRING" },
                    description: { type: "STRING" },
                  },
                  required: ["name", "description"],
                },
                elements: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      name: { type: "STRING" },
                      type: { type: "STRING" },
                      properties: {
                        type: "OBJECT",
                        properties: {
                          description: { type: "STRING" },
                          details: { type: "STRING" },
                        },
                      },
                    },
                    required: ["name", "type", "properties"],
                  },
                },
                premises: {
                  type: "ARRAY",
                  items: { type: "STRING" },
                },
              },
            },
          },
          required: ["reply", "is_finished"],
        },
      },
    }

    const aiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!aiResponse.ok) {
      const errorBody = await aiResponse.text()
      throw new Error(
        `AI API request failed with status ${aiResponse.status}: ${errorBody}`,
      )
    }

    const result = await aiResponse.json()

    // --- 5. Parse and Return Response ---
    const responseText = result.candidates[0].content.parts[0].text
    const responseJson = JSON.parse(responseText)

    return new Response(JSON.stringify(responseJson), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 200,
    })
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  }
})
