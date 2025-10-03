// Google Generative AI (Gemini) helper
// Comments in English only
// ESM-friendly dynamic import with graceful fallback

let client = null;

export async function getGeminiClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  if (client) return client;
  try {
    const mod = await import('@google/generative-ai');
    const { GoogleGenerativeAI } = mod;
    client = new GoogleGenerativeAI(key);
    return client;
  } catch (e) {
    // Package not installed or import failed
    return null;
  }
}

export async function chatWithGemini({ message, context = {} }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    // Safe stub response when no GEMINI_API_KEY
    return {
      role: 'assistant',
      text: `Stub response (no GEMINI_API_KEY). You said: ${message}`,
      contextSummary: Object.keys(context)
    };
  }

  const cli = await getGeminiClient();
  if (!cli) {
    return {
      role: 'assistant',
      text: 'Gemini client not available. Please install @google/generative-ai and set GEMINI_API_KEY.',
      contextSummary: Object.keys(context)
    };
  }

  // Minimal placeholder flow (adjust model as needed)
  try {
    // The SDK usage may vary; keep as placeholder to avoid runtime errors until configured
    return {
      role: 'assistant',
      text: 'Gemini integration placeholder. Replace with actual SDK calls.',
      contextSummary: Object.keys(context)
    };
  } catch (e) {
    return {
      role: 'assistant',
      text: `Gemini error: ${e?.message || e}`,
      contextSummary: Object.keys(context)
    };
  }
}
