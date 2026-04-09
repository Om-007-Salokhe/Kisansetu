const axios = require('axios');
const schemes = require('../data/schemes.json');
const knowledgeBase = require('../data/knowledge_base.json');

// Mock data for fallback
const mockWeather = {
  main: { temp: 28, humidity: 65 },
  weather: [{ description: 'partly cloudy', icon: '02d' }],
  name: 'Pune'
};

const mockMarketPrices = [
  { crop: 'Wheat', price: 2150, unit: 'Quintal', trend: 'up', market: 'Pune Mandi' },
  { crop: 'Tomato', price: 1800, unit: 'Quintal', trend: 'down', market: 'Mumbai Mandi' },
  { crop: 'Rice', price: 3200, unit: 'Quintal', trend: 'stable', market: 'Nagpur Mandi' }
];

exports.getChatResponse = async (req, res) => {
  try {
    const { message, language = 'en' } = req.body;

    // Create a summarized string of schemes for the prompt
    const schemesSummary = schemes.map(s => `- ${s.name}: ${s.description}`).join('\n');
    
    // Create a summarized string of knowledge base for the prompt
    const kbSummary = knowledgeBase.map(kb => `[${kb.topic}]: ${kb.fact}`).join('\n');
    
    const systemPrompt = `You are the KisanSetu AI Assistant, a world-class expert in Indian agriculture and a helpful guide for the KisanSetu platform.
    
    EXTENDED KNOWLEDGE (FOR TRAINING):
    ${kbSummary}

    TONE & PERSONALITY:
    - You are respectful, professional, and empathetic to the challenges of farmers.
    - Use simple, clear language. Avoid overly technical jargon unless explaining it simply.
    - Encourage sustainable and profitable farming practices.

    YOUR KNOWLEDGE BASE:
    - CROP ADVICE: Expert knowledge on Kharif, Rabi, and Zaid crops in India. Advice on sowing, irrigation, fertilizers, and harvesting.
    - PEST & DISEASE: Identify common pests (like aphids, bollworms) and diseases (like blight, rust). Suggest organic and chemical solutions.
    - SOIL HEALTH: Guidance on Soil Health Cards, NPK ratios, and organic manuring.
    - GOVERNMENT SCHEMES: You know about these schemes in detail:
    ${schemesSummary}
    - KISANSETU PLATFORM: You can explain features like "Marketplace" (buying/selling), "AI Disease Detection" (uploading photos), "Expense Tracker", and "Live Mandi Prices".

    RULES:
    1. PURPOSE: Strictly answer questions related to agriculture, livestock, rural business, and the KisanSetu app.
    2. REFUSAL: If asked about non-farming topics (movies, celebrities, politics), say: "I am specialized in agricultural assistance and KisanSetu services. I cannot help with that, but I can tell you about the best time to sow Wheat!"
    3. LANGUAGE: Always respond in the user's language: ${language === 'hi' ? 'Hindi (हिन्दी)' : language === 'mr' ? 'Marathi (मराठी)' : 'English'}.
    4. ACCURACY: If you don't know something specific (like a very local price), state it clearly and provide a general estimate or advice on where to check.

    CURRENT USER CONTEXT:
    - User is using: ${language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English'}.
    - The platform is KisanSetu, which connects farmers directly to buyers.`;

      // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      const lowerMsg = message.toLowerCase();
      
      // 1. Check for Schemes
      const matchedScheme = schemes.find(s => 
        lowerMsg.includes(s.name.toLowerCase()) || 
        lowerMsg.includes(s.id.toLowerCase()) ||
        (lowerMsg.includes('scheme') && lowerMsg.includes(s.name.split(' ')[0].toLowerCase()))
      );

      if (matchedScheme) {
        return res.json({ 
          reply: `[MOCK MODE] Information about ${matchedScheme.name}: ${matchedScheme.description} Benefits include: ${matchedScheme.benefits}.` 
        });
      }

      // 2. Check for Knowledge Base facts
      const matchedFact = knowledgeBase.find(kb => 
        lowerMsg.includes(kb.topic.toLowerCase()) || 
        kb.fact.toLowerCase().includes(lowerMsg) ||
        (lowerMsg.includes('crop') && kb.topic.toLowerCase().includes('soil'))
      );

      if (matchedFact) {
        return res.json({ 
          reply: `[MOCK MODE] Regarding ${matchedFact.topic}: ${matchedFact.fact}` 
        });
      }

      // 3. Check for specific keywords for generic but helpful agricultural advice
      if (lowerMsg.includes('crop') || lowerMsg.includes('sow') || lowerMsg.includes('plant')) {
        return res.json({ 
          reply: `[MOCK MODE] For crop suggestions, it's best to consider your soil type (Alluvial, Black, Red) and the current season (Kharif or Rabi). Typically, Rice and Cotton are great for Kharif, while Wheat and Mustard are preferred for Rabi.` 
        });
      }

      if (lowerMsg.includes('price') || lowerMsg.includes('market') || lowerMsg.includes('mandi')) {
        const prices = mockMarketPrices.map(p => `${p.crop}: ₹${p.price}`).join(', ');
        return res.json({ 
          reply: `[MOCK MODE] Current market prices are: ${prices}. You can see more details in the 'Market' tab.` 
        });
      }

      // Fallback for agriculture-related queries but no specific match
      const isAgriRelated = /crop|farm|soil|water|pest|price|market|wheat|rice|tomato|fertilizer|scheme|seed|agriculture|weather|kisansetu|projectsetu|sell|buy|listings|order|kisan/i.test(message);
      
      if (!isAgriRelated) {
        return res.json({ 
          reply: language === 'hi' ? "क्षमा करें, मैं केवल कृषि और खेती से संबंधित प्रश्नों में ही आपकी सहायता कर सकता हूँ।" : 
                 language === 'mr' ? "क्षमस्व, मी तुम्हाला फक्त कृषी आणि शेतीशी संबंधित प्रश्नांमध्ये मदत करू शकतो." :
                 "I'm sorry, I can only assist with questions related to agriculture and farming."
        });
      }

      return res.json({ 
        reply: `[MOCK MODE] I understand you are asking about "${message}". As an agricultural assistant, I recommend checking our 'Crop Advisory' or 'Govt Schemes' tabs for detailed information regarding this.` 
      });
    }

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    }, {
      headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
    });

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error('AI Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch AI response' });
  }
};

exports.getWeather = async (req, res) => {
  try {
    const { lat, lon, city } = req.query;
    if (!process.env.OPENWEATHERMAP_API_KEY) {
      return res.json(mockWeather);
    }
    
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`;
    if (city) url += `&q=${city}`;
    else if (lat && lon) url += `&lat=${lat}&lon=${lon}`;
    else url += `&q=Pune`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.json(mockWeather); // Fallback
  }
};

exports.getMarketPrices = async (req, res) => {
  // In a real app, this would fetch from Agmarknet or similar
  // For this project, we return high-quality mock data or use a proxy
  res.json(mockMarketPrices);
};

exports.getSchemes = async (req, res) => {
  res.json(schemes);
};

exports.detectDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    
    // Simulate AI model processing time
    setTimeout(() => {
      res.json({
        detection: "Early Blight",
        probability: 0.92,
        treatment: "Apply Copper-based fungicides. Remove infected lower leaves.",
        pesticide: "Mancozeb or Chlorothalonil"
      });
    }, 1500);
    
  } catch (error) {
    res.status(500).json({ error: 'Disease detection failed' });
  }
};
