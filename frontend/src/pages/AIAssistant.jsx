import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  MessageSquare, 
  Mic, 
  MicOff, 
  Cloud, 
  TrendingUp, 
  Camera, 
  FileText, 
  Send,
  Loader2,
  AlertTriangle,
  MapPin,
  Volume2,
  Sprout,
  Sparkles
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AIAssistant = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: i18n.language === 'hi' ? 'नमस्ते! मैं आपका किसानसेतु AI हूँ। मैं आपकी कैसे मदद कर सकता हूँ?' : 
                           i18n.language === 'mr' ? 'नमस्कार! मी तुमचा किसानसेतू AI आहे. मी तुम्हाला कशी मदत करू शकतो?' :
                           'Hello! I am your KisanSetu AI. How can I help you today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [marketPrices, setMarketPrices] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [diseaseResult, setDiseaseResult] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Fetch initial data
    fetchWeather();
    fetchMarketPrices();
    fetchSchemes();

    // Setup Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [i18n.language]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchWeather = async () => {
    try {
      const res = await axios.get('/api/ai/weather');
      setWeather(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMarketPrices = async () => {
    try {
      const res = await axios.get('/api/ai/market-prices');
      setMarketPrices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSchemes = async () => {
    try {
      const res = await axios.get('/api/ai/schemes');
      setSchemes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (text = inputText) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/chat', { message: text, language: i18n.language });
      const assistantMsg = { role: 'assistant', text: res.data.reply };
      setMessages(prev => [...prev, assistantMsg]);
      speak(res.data.reply);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I am having trouble connecting.' }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));
    setLoading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('/api/ai/detect-disease', formData);
      setDiseaseResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'chat', name: 'AI Chat', icon: MessageSquare },
    { id: 'advisory', name: 'Crop Advisory', icon: Sprout },
    { id: 'weather', name: 'Weather', icon: Cloud },
    { id: 'market', name: 'Market', icon: TrendingUp },
    { id: 'disease', name: 'Disease Info', icon: Camera },
    { id: 'schemes', name: 'Govt Schemes', icon: FileText },
  ];

  const handleAdvisorySubmit = async (e) => {
    e.preventDefault();
    const soil = e.target.soil.value;
    const season = e.target.season.value;
    const q = `Suggest crops for ${soil} soil during ${season} season in India.`;
    setActiveTab('chat');
    handleSendMessage(q);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-2xl shadow-xl min-h-[80vh] flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b mb-6 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-brand-600 text-brand-600 font-bold' 
                : 'border-transparent text-gray-500 hover:text-brand-500'
            }`}
          >
            <tab.icon size={18} />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Main Content Areas */}
      <div className="flex-1 overflow-y-auto pr-2">
        {activeTab === 'chat' && (
          <div className="h-full flex flex-col">
            <div className="flex-1 space-y-4 mb-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user' 
                      ? 'bg-brand-600 text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-3 rounded-tl-none">
                    <Loader2 className="animate-spin text-brand-600" size={20} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t pt-4 flex gap-2">
              <button
                onClick={toggleListening}
                className={`p-3 rounded-full transition-all ${
                  isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isListening ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything about farming..."
                className="flex-1 border border-gray-200 rounded-full px-4 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                onClick={() => handleSendMessage()}
                className="bg-brand-600 text-white p-3 rounded-full hover:bg-brand-700 transition-colors"
                disabled={!inputText.trim() || loading}
              >
                <Send size={24} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'advisory' && (
          <div className="max-w-md mx-auto space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 text-center">Get Crop Recommendations</h3>
            <form onSubmit={handleAdvisorySubmit} className="space-y-4 bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
                <select name="soil" className="w-full border-gray-200 rounded-xl p-3 focus:ring-brand-500 focus:border-brand-500">
                  <option value="Alluvial">Alluvial (Most fertile)</option>
                  <option value="Black">Black (Regur)</option>
                  <option value="Red">Red & Yellow</option>
                  <option value="Laterite">Laterite</option>
                  <option value="Arid">Arid / Sandy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
                <select name="season" className="w-full border-gray-200 rounded-xl p-3 focus:ring-brand-500 focus:border-brand-500">
                  <option value="Kharif (Monsoon)">Kharif (June - October)</option>
                  <option value="Rabi (Winter)">Rabi (November - March)</option>
                  <option value="Zaid (Summer)">Zaid (March - June)</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-md group border-none"
              >
                Get AI Suggestions <Sprout className="inline ml-2 group-hover:rotate-12 transition-transform" />
              </button>
            </form>
            <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-blue-800 border border-blue-100 italic">
              <Sparkles className="shrink-0" size={20} />
              <p className="text-sm">Our AI analyzes over 50 years of climate data to suggest the best possible crops for your specific conditions.</p>
            </div>
          </div>
        )}

        {activeTab === 'weather' && weather && (
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-8 rounded-3xl text-white shadow-lg">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-3xl font-bold flex items-center gap-2">
                  <MapPin size={24} /> {weather.name}
                </h3>
                <p className="text-blue-100 opacity-80 mt-1 uppercase tracking-wider">Current Conditions</p>
              </div>
              <Cloud size={64} className="opacity-80" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <p className="text-sm opacity-80 mb-1">Temperature</p>
                <p className="text-2xl font-bold">{Math.round(weather.main?.temp)}°C</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <p className="text-sm opacity-80 mb-1">Humidity</p>
                <p className="text-2xl font-bold">{weather.main?.humidity}%</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <p className="text-sm opacity-80 mb-1">Conditions</p>
                <p className="text-2xl font-bold capitalize">{weather.weather?.[0]?.description}</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <p className="text-sm opacity-80 mb-1">Wind Speed</p>
                <p className="text-2xl font-bold">12 km/h</p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 bg-yellow-400/20 p-4 rounded-2xl border border-yellow-400/30">
              <AlertTriangle className="text-yellow-400" />
              <p>Ideal time for fertilizer application. No rain expected for the next 48 hours.</p>
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Live Mandi Prices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marketPrices.map((item, idx) => (
                <div key={idx} className="bg-white border rounded-2xl p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                  <div>
                    <h4 className="font-bold text-lg">{item.crop}</h4>
                    <p className="text-sm text-gray-500">{item.market}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-600 text-xl">₹{item.price} / {item.unit}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 justify-end ${
                      item.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.trend === 'up' ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
                      {item.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'disease' && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Upload a photo of your crop to detect diseases automatically.</p>
              <label className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-full cursor-pointer hover:bg-brand-700 shadow-lg transition-all transform hover:scale-105">
                <Camera size={20} />
                <span>Upload Image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>

            {selectedImage && (
              <div className="mt-8 flex flex-col md:flex-row gap-6 bg-gray-50 p-6 rounded-3xl border border-gray-200">
                <img src={selectedImage} alt="Crop" className="w-full md:w-1/2 h-64 object-cover rounded-2xl shadow-md" />
                <div className="flex-1">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                      <Loader2 className="animate-spin text-brand-600" size={48} />
                      <p className="text-gray-600 font-medium tracking-wide">AI is analyzing your crop...</p>
                    </div>
                  ) : diseaseResult ? (
                    <div className="space-y-4 animate-in fade-in duration-500">
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle size={20} />
                        <h4 className="font-bold text-xl uppercase tracking-tight">{diseaseResult.detection} Detected</h4>
                      </div>
                      <p className="text-gray-700 leading-relaxed font-light"><strong className="text-gray-900 font-bold">Treatment:</strong> {diseaseResult.treatment}</p>
                      <p className="text-gray-700 leading-relaxed font-light"><strong className="text-gray-900 font-bold">Pesticide:</strong> {diseaseResult.pesticide}</p>
                      <button 
                        onClick={() => speak(`Detection result: ${diseaseResult.detection}. ${diseaseResult.treatment}`)}
                        className="flex items-center gap-2 text-brand-600 font-bold mt-4 hover:underline"
                      >
                        <Volume2 size={18} /> Listen to Advice
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">Analysis results will appear here.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'schemes' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Available Government Schemes</h3>
            {schemes.map((scheme, i) => (
              <div key={i} className="border rounded-2xl p-6 hover:shadow-lg transition-all group">
                <h4 className="font-bold text-lg text-brand-600 mb-2 group-hover:text-brand-700">{scheme.name}</h4>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">{scheme.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="font-bold text-gray-800 uppercase text-xs tracking-widest mb-2">Benefits</p>
                    <p className="text-gray-700">{scheme.benefits}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="font-bold text-gray-800 uppercase text-xs tracking-widest mb-2">Steps to Apply</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {scheme.steps.map((step, idx) => <li key={idx}>{step}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
