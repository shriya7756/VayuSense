exports.handler = async (event) => {
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  let query = "";
  try {
    const body = JSON.parse(event.body || "{}");
    query = body.query || "";
  } catch {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Invalid JSON body" }) };
  }

  if (!query) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Query is required" }) };
  }

  const apiKey = process.env.COHERE_API_KEY;
  if (!apiKey) {
    // Graceful demo fallback
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        response: `[Demo Mode] You asked: "${query}"\n\nTo enable live AI responses, please add the COHERE_API_KEY environment variable in your Netlify site settings. You can get a free key at dashboard.cohere.com.\n\nFor Hyderabad's current air quality, the AQI is generally moderate (100-200) during peak hours. Please check the Dashboard page for live readings.`
      }),
    };
  }

  try {
    const systemPrompt = `You are CitizenSaathi, an expert AI assistant for the VayuSense urban air quality platform in Hyderabad, India. 

Your specialties:
- Real-time AQI interpretations and health advisories for Hyderabad
- Ward-level air quality insights (Sanathnagar, Madhapur, Charminar, Jubilee Hills, HITEC City, etc.)
- Advice for vulnerable populations (children, elderly, pregnant women)
- Recommendations for outdoor activities based on AQI levels
- Information about pollution sources (vehicular, industrial, construction)
- CPCB guidelines and NAAQS standards

Language: If the user writes in Telugu, respond in Telugu. Otherwise respond in English.
Tone: Empathetic, precise, and helpful. Always provide actionable health advice.
Format: Use clear paragraphs. Use emojis sparingly but appropriately.`;

    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        message: query,
        model: "command-r-plus",
        preamble: systemPrompt,
        temperature: 0.3,
        connectors: [{ id: "web-search" }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Cohere API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const content = data.text || "I'm sorry, I couldn't generate a response right now.";

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ response: content }),
    };
  } catch (err) {
    console.error("Enforcement function error:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message || "Server error" }),
    };
  }
};
