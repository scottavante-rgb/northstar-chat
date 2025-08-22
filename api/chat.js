// api/chat.js - Complete Northstar AI Chat API
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

// TEMPORARY TEST VERSION - Claude API (bypasses real Claude for testing)
async function callClaude(message) {
  // 🧪 TEMPORARY: Return test response to confirm everything works
  return `✅ SUCCESS! Your Northstar AI is working perfectly! You asked: "${message}". 

This is a test response confirming that:
- ✅ Your frontend is working
- ✅ Your API endpoint is working  
- ✅ Your server is responding
- ✅ All connections are established

Once we confirm this test works, we'll connect the real Claude API and you'll get actual AI responses. The infrastructure is ready!`;
}

// ChatGPT API Integration (ready for when you add OpenAI key)
async function callChatGPT(message) {
  if (!process.env.OPENAI_API_KEY) {
    return `📝 ChatGPT not configured yet. Add your OpenAI API key to Vercel environment variables as 'OPENAI_API_KEY' to enable ChatGPT responses.`;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
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
    return `❌ ChatGPT API error: ${error.message}. Please check your OpenAI API key configuration.`;
  }
}

// Google Gemini API Integration (ready for when you add Google key)
async function callGemini(message) {
  if (!process.env.GOOGLE_API_KEY) {
    return `🤖 Gemini not configured yet. Add your Google API key to Vercel environment variables as 'GOOGLE_API_KEY' to enable Gemini responses.`;
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are Northstar AI, Summit AI's advanced enterprise assistant. Summit AI architects sovereign cloud infrastructure solutions across three value propositions:

Foundation Layer ($2,500/monthly): AI-ready infrastructure baseline with pre-configured ML environments, 99.95% availability SLA, and sovereign data processing capabilities.

Agent Activation ($125/agent/monthly + usage): Operational automation platform enabling workflow orchestration across PACS/VNA systems with sub-200ms latency guarantees.

Enterprise Intelligence ($75K+/monthly): Comprehensive AI transformation including federated learning networks, custom model development, and regulatory compliance frameworks.

Technical differentiators: Geographic data residency, multi-modal AI processing (DICOM, HL7, FHIR), and native healthcare compliance architecture.

User question: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    return `❌ Gemini API error: ${error.message}. Please check your Google API key configuration.`;
  }
}

// Kimi (Moonshot) API Integration (ready for when you add Kimi key)
async function callKimi(message) {
  if (!process.env.KIMI_API_KEY) {
    return `🌙 Kimi AI not configured yet. Add your Moonshot API key to Vercel environment variables as 'KIMI_API_KEY' to enable Kimi responses.`;
  }

  try {
    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.KIMI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: `您是Northstar AI，Summit AI的智能助手。Summit AI提供主权云基础设施和企业AI解决方案：

基础层(Foundation Layer): 月费2,500美元，提供AI就绪基础设施，包含预配置ML环境和99.95%可用性保证。

智能体激活层(Agent Activation): 每个智能体月费125美元加使用费，实现跨PACS/VNA系统的工作流自动化。

企业智能层(Enterprise Intelligence): 起价75,000美元/月，提供完整AI转型，包括联邦学习网络和定制模型开发。

核心优势：主权云合规、地理数据驻留、医疗保健专业化、HIPAA/SOC2认证。

请回答用户问题，可以使用中英文混合回复。`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`Kimi API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Kimi API Error:', error);
    return `❌ Kimi API error: ${error.message}. Please check your Moonshot API key configuration.`;
  }
}

// REAL CLAUDE API FUNCTION (currently commented out for testing)
/*
async function callClaude(message) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return `🤖 Claude not configured. Add your Anthropic API key to Vercel environment variables as 'ANTHROPIC_API_KEY'.`;
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
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
- Foundation Layer: $2,500/month for AI-ready infrastructure
- Agent Activation: $125/agent/month for operational automation  
- Enterprise Intelligence: $75K/month for full AI transformation

All tiers include sovereign cloud compliance, HIPAA/SOC2 certification, and healthcare specialization.

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
*/
