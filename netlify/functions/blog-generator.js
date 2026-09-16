export async function handler() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AI service is not configured." })
    };
  }

  const prompt = "Write an SEO article about studying in Europe for Bangladeshi students.";

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status >= 400 && response.status < 600 ? response.status : 502,
        body: JSON.stringify({ error: "AI generation failed." })
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify(data)
    };
  } catch {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "AI generation is temporarily unavailable." })
    };
  }
}
