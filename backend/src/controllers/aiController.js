const axios = require('axios');
const schemes = require('../data/schemes.json');

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
    
    const systemPrompt = `You are the KisanSetu AI Assistant, a specialized expert in Indian agriculture.
    RULES:
    1. Only answer questions related to agriculture, farming, crops, pests, fertilizers, irrigation, market prices, and government schemes for farmers.
    2. If a user asks something unrelated to farming or the KisanSetu project (e.g., politics, movies, general trivia), politely decline and state that you only assist with agricultural queries.
    3. You must respond in the language requested by the user. Supported languages: English, Hindi (हिन्दी), and Marathi (मराठी).
    4. Provide practical, accurate, and season-specific advice for Indian farmers.
    5. Currently, the user is interacting in: ${language}.`;

    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      // Improved mock response logic for testing
      const isAgriRelated = /crop|farm|soil|water|pest|price|market|wheat|rice|tomato|fertilizer|scheme|seed|agriculture|weather|kisansetu|projectsetu|sell|buy|listings|order/i.test(message);
      
      if (!isAgriRelated) {
        return res.json({ 
          reply: language === 'hi' ? "क्षमा करें, मैं केवल कृषि और खेती से संबंधित प्रश्नों में ही आपकी सहायता कर सकता हूँ।" : 
                 language === 'mr' ? "क्षमस्व, मी तुम्हाला फक्त कृषी आणि शेतीशी संबंधित प्रश्नांमध्ये मदत करू शकतो." :
                 "I'm sorry, I can only assist with questions related to agriculture and farming."
        });
      }

      return res.json({ 
        reply: `[MOCK MODE] Language: ${language}. AI suggests: For your query about "${message}", ensure you follow best practices for ${language === 'hi' ? 'भारतीय खेती' : 'Indian farming'}.` 
      });
    }

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
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
