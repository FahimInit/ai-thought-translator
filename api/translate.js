export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // 2. Get the prompts from the frontend's request body
  const { userQuery, systemPrompt } = req.body;

  // 3. Get the *secret* API key from Vercel's Environment Variables
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("API key is not configured.");
    return res.status(500).json({ error: "API key is not configured." });
  }
  
  // 4. Google API endpoint
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  // 5. Construct the payload to send to Google
  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] }
  };

  // 6. Call the Google Gemini API
  try {
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      // If Google returns an error (bad key, billing, etc.), send it to the frontend
      console.error("Gemini API Error:", data.error.message);
      return res.status(geminiResponse.status).json({ error: data.error.message || "Failed to fetch from Gemini." });
    }
    
    // 7. Success! Send Google's response back to your frontend
    return res.status(200).json(data);

  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}