function buildFallbackReply(profile = {}) {
  if (!profile.name) {
    return "Assalamu alaikum. Welcome to NextBorder. Please tell me your full name first so I can start your inquiry.";
  }

  if (!profile.mobile) {
    return `Thanks, ${profile.name}. Now share your mobile number so our team can reach you quickly.`;
  }

  if (!profile.email) {
    return "Great. Please add your email address for follow-up details and document updates.";
  }

  if (!profile.phone) {
    return "Please add an alternate phone number if you have one.";
  }

  if (!profile.service) {
    return "Which service do you need: Student Visa, Europe Job Visa, or Umrah Visa?";
  }

  if (!profile.question) {
    return "Almost done. Drop your main question so the team can prepare the right response.";
  }

  return `Thank you, ${profile.name}. I have your details for ${profile.service}. We will come back to you soon using your mobile number and email.`;
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  let payload = {};

  try {
    payload = JSON.parse(event.body || "{}");
  } catch (error) {
    payload = {};
  }

  const profile = payload.profile || {};
  const question = payload.message || profile.question || "";
  const apiKey = process.env.GEMINI_API_KEY;
  const fallbackReply = buildFallbackReply(profile);

  if (!apiKey) {
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: fallbackReply, source: "fallback" })
    };
  }

  try {
    const prompt = [
      "You are NextBorder AI, a short and helpful intake assistant for a visa consultancy.",
      "Your job is to collect user contact details and understand what service they need.",
      "Be concise and practical.",
      `Known profile: ${JSON.stringify(profile)}`,
      `User question: ${question}`
    ].join("\n");

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || fallbackReply;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply, source: "gemini" })
    };
  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: fallbackReply, source: "fallback" })
    };
  }
}
