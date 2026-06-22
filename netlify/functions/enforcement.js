exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { query } = JSON.parse(event.body || "{}");

  if (!query) {
    return { statusCode: 400, body: JSON.stringify({ error: "Query is required" }) };
  }

  const apiKey = process.env.COHERE_API_KEY;
  if (!apiKey) {
    // Return a mock response if no API key is set for demo purposes
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        response: `[DEMO MODE - No Cohere API Key] You asked: "${query}". \n\nIn Hyderabad today, the AQI is Moderate (150). If you are asking in Telugu: ఈ రోజు హైదరాబాద్‌లో గాలి నాణ్యత మితంగా ఉంది.` 
      }),
    };
  }

  try {
    const systemPrompt = `You are CitizenSaathi, an AI assistant for the VayuSense air quality platform in Hyderabad, India. 
Your goal is to provide accurate, hyper-local air quality information, health advisories, and enforcement updates to citizens. 
If the user asks in Telugu, reply in Telugu. If they ask in English, reply in English. 
Always be polite, concise, and prioritize public health. Mention real areas in Hyderabad (like Ameerpet, Sanathnagar, Charminar).`;

    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        message: query,
        model: "command-r-plus",
        preamble: systemPrompt,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      throw new Error(`Cohere API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.text || "I'm sorry, I couldn't process that request right now.";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ response: content }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Synthesis failed." }),
    };
  }
};
