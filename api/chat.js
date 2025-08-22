// api/chat.js - Test with alternative environment variable name
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, model = 'claude' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`🔄 Processing ${model} request for message: ${message}`);

    let response;

    switch (model) {
      case 'claude':
        response = await callClaude(message);
        break;
      case 'chatgpt':
        response = await callChatGPT(message);
        break;
      case 'gemini':
        response = await callGemini(message);
        break;
      case 'kimi':
        response = await callKimi(message);
        break;
      default:
        response = await callClaude(message);
    }

    console.log(`✅ ${model} API call successful`);

    return res.status(200).json({ 
      response: response,
      model: model,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Chat API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to get AI response',
      fallback: `I'm experiencing technical difficulties with the ${req.body?.model || 'AI'} service. Please try again in a moment.`
    });
  }
}

// Try multiple environment variable names
async function callChatGPT(message) {
  // Check multiple possible environment variable names
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || process.env.CHATGPT_API_KEY;
  
  const debugInfo = {
    hasOpenaiApiKey: !!process.env.OPENAI_API_KEY,
    hasOpenaiKey: !!process.env.OPENAI_KEY,
    hasChatgptApiKey: !!process.env.CHATGPT_API_KEY,
    foundKey: !!apiKey,
    keyLength: apiKey?.length || 0,
    keyPrefix: apiKey?.substring(0, 15) || 'none',
    allEnvKeys: Object.keys(process.env).sort(),
    vercelEnv: process.env.VERCEL_ENV,
    nodeEnv: process.env.NODE_ENV
  };
  
  if (!apiKey) {
    return `🔍 ENHANCED DEBUG INFO:
- OPENAI_API_KEY exists: ${debugInfo.hasOpenaiApiKey}
- OPENAI_KEY exists: ${debugInfo.hasOpenaiKey}
- CHATGPT_API_KEY exists: ${debugInfo.hasChatgptApiKey}
- Found any key: ${debugInfo.foundKey}
- Vercel Environment: ${debugInfo.vercelEnv}
- Node Environment: ${debugInfo.nodeEnv}
- Available env vars: ${debugInfo.allEnvKeys.slice(0, 10).join(', ')}...
- Total env vars: ${debugInfo.allEnvKeys.length}

Add environment variable to Vercel with name 'OPENAI_API_KEY', 'OPENAI_KEY', or 'CHATGPT_API_KEY'`;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are Northstar AI, Summit AI's intelligent assistant. Summit AI provides sovereign cloud infrastructure and enterprise AI solutions with three pricing tiers:

- Foundation Layer: $2,500/month for AI-ready infrastructure with 99.95% uptime SLA
- Agent Activation: $125/agent/month plus $0.45 per thousand actions for operational automation
- Enterprise Intelligence: Starting at $75K/month for complete AI transformation

Key features: Sovereign cloud compliance, HIPAA/SOC2 certified, healthcare specialization, geographic data boundaries, native compliance architecture.

Provide helpful, structured responses about Summit AI's offerings.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('ChatGPT API Error:', error);
    return `❌ ChatGPT API error: ${error.message}. Key found: ${!!apiKey}, Key length: ${apiKey?.length}`;
  }
}

// Claude API Integration
async function callClaude(message) {
  if (!process.env.CLAUDE_API_KEY) {
    return `🤖 Claude not configured. Add your Claude API key to Vercel environment variables as 'CLAUDE_API_KEY'.`;
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `You are Northstar AI, Summit AI's intelligent assistant specializing in sovereign cloud infrastructure and enterprise AI solutions. 

Summit AI offers three pricing tiers:
- Foundation Layer: $2,500/month for AI-ready infrastructure with 99.95% uptime SLA
- Agent Activation: $125/agent/month plus $0.45 per thousand actions for operational automation  
- Enterprise Intelligence: Starting at $75K/month for complete AI transformation

Key features: Sovereign cloud compliance, HIPAA/SOC2 certified, healthcare specialization, geographic data boundaries, native compliance architecture.

Provide helpful, structured responses about Summit AI's offerings.

User question: ${message}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Claude API Error Response:', errorData);
      throw new Error(`Claude API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Claude API Error:', error);
    throw new Error(`Claude API unavailable: ${error.message}`);
  }
}

// Google Gemini API Integration
async function callGemini(message) {
  if (!process.env.GOOGLE_API_KEY) {
    return `🤖 Gemini not configured yet. Add your Google API key to Vercel environment variables as 'GOOGLE_API_KEY' to enable Gemini responses.`;
  }
  // Gemini implementation...
  return "Gemini integration ready";
}

// Kimi API Integration  
async function callKimi(message) {
  if (!process.env.KIMI_API_KEY) {
    return `🌙 Kimi AI not configured yet. Add your Moonshot API key to Vercel environment variables as 'KIMI_API_KEY' to enable Kimi responses.`;
  }
  // Kimi implementation...
  return "Kimi integration ready";
}
