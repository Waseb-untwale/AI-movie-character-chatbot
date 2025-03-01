import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Clapperboard, Sparkles, Sliders, Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FaBackward } from "react-icons/fa";

function Character() {
  const [character, setCharacter] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFineTune, setShowFineTune] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [voiceGender, setVoiceGender] = useState('male'); // Changed default to male
  const [personality, setPersonality] = useState(50);
  const [creativity, setCreativity] = useState(50);
  const [isPaused, setIsPaused] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const messagesEndRef = useRef(null);
  const synth = window.speechSynthesis;
  const currentUtteranceRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = synth.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
        setVoicesLoaded(true);
        
        // Filter voices based on gender
        const genderVoices = voices.filter(voice => {
          const voiceName = voice.name.toLowerCase();
          if (voiceGender === 'female') {
            return voiceName.includes('female') || voiceName.includes('woman') || voiceName.includes('girl');
          } else {
            return voiceName.includes('male') || voiceName.includes('man') || voiceName.includes('boy');
          }
        });
        
        if (genderVoices.length > 0) {
          setSelectedVoice(genderVoices[0]);
        } else {
          // If no gender-specific voice is found, try to make an educated guess
          const defaultVoice = voices.find(voice => {
            const name = voice.name.toLowerCase();
            return voiceGender === 'female' 
              ? !name.includes('male') && !name.includes('man') && !name.includes('boy')
              : !name.includes('female') && !name.includes('woman') && !name.includes('girl');
          }) || voices[0];
          setSelectedVoice(defaultVoice);
        }
      } else {
        // If voices aren't available yet, try again after a short delay
        setTimeout(loadVoices, 100);
      }
    };

    loadVoices();
    synth.onvoiceschanged = loadVoices;

    return () => {
      synth.onvoiceschanged = null;
      if (currentUtteranceRef.current) {
        synth.cancel();
      }
    };
  }, [voiceGender]); // This effect runs when voiceGender changes

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleVoiceGenderChange = (gender) => {
    setVoiceGender(gender);
    // Stop any current speech when changing voice
    if (currentUtteranceRef.current) {
      stopSpeaking();
    }
  };

  const togglePause = () => {
    if (synth.speaking) {
      if (synth.paused) {
        synth.resume();
        setIsPaused(false);
      } else {
        synth.pause();
        setIsPaused(true);
      }
    }
  };

  const stopSpeaking = () => {
    if (currentUtteranceRef.current) {
      synth.cancel();
      currentUtteranceRef.current = null;
      setIsPaused(false);
    }
  };

  const speak = (text) => {
    if (!voiceEnabled || !voicesLoaded || !selectedVoice) return;

    // Stop any ongoing speech
    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = 1.0;
    utterance.pitch = voiceGender === 'female' ? 1.2 : 0.9;
    utterance.volume = 1.0;

    // Handle speech events
    utterance.onend = () => {
      currentUtteranceRef.current = null;
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      currentUtteranceRef.current = null;
      setIsPaused(false);
    };

    currentUtteranceRef.current = utterance;
    synth.speak(utterance);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !character.trim()) return;

    const userMessage = { 
      text: message, 
      isUser: true,
      character: character 
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('https://ai-character-chatbot.vercel.app/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          character: character,
          user_message: message,
          personality: personality,
          creativity: creativity
        }),
      });

      const data = await response.json();
      
      const characterMessage = { 
        text: data.response, 
        isUser: false,
        character: character
      };
      setMessages((prev) => [...prev, characterMessage]);

      speak(data.response);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        text: "Action cut! We're experiencing technical difficulties connecting with the character.", 
        isUser: false,
        character: character
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-4xl mx-auto p-4 h-screen flex flex-col">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-4 border border-gray-700">
          <Link to='/' className="p-1">
            <FaBackward size={21}/>
          </Link>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clapperboard className="w-8 h-8 text-yellow-500" />
              <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent">
                Movie Character Chat
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFineTune(!showFineTune)}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                title="Fine-tune AI"
              >
                <Sliders className="w-5 h-5 text-yellow-500" />
              </button>
              {voiceEnabled && synth.speaking && (
                <button
                  onClick={togglePause}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                  title={isPaused ? "Resume speech" : "Pause speech"}
                >
                  {isPaused ? (
                    <Play className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Pause className="w-5 h-5 text-yellow-500" />
                  )}
                </button>
              )}
              <button
                onClick={() => {
                  setVoiceEnabled(!voiceEnabled);
                  if (voiceEnabled) {
                    stopSpeaking();
                  }
                }}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                title="Toggle voice"
              >
                {voiceEnabled ? (
                  <Volume2 className="w-5 h-5 text-yellow-500" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>
          
          {showFineTune && (
            <div className="mb-4 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Personality Depth</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={personality}
                    onChange={(e) => setPersonality(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Basic</span>
                    <span>Complex</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Creativity Level</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={creativity}
                    onChange={(e) => setCreativity(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Focused</span>
                    <span>Creative</span>
                  </div>
                </div>
                {voiceEnabled && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Voice Gender</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVoiceGenderChange('female')}
                          className={`flex-1 p-2 rounded-lg border transition-colors ${
                            voiceGender === 'female'
                              ? 'bg-yellow-500 text-gray-900 border-yellow-500'
                              : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                          }`}
                        >
                          Female
                        </button>
                        <button
                          onClick={() => handleVoiceGenderChange('male')}
                          className={`flex-1 p-2 rounded-lg border transition-colors ${
                            voiceGender === 'male'
                              ? 'bg-yellow-500 text-gray-900 border-yellow-500'
                              : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                          }`}
                        >
                          Male
                        </button>
                      </div>
                    </div>
                    {voicesLoaded && (
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Advanced Voice Selection</label>
                        <select
                          value={selectedVoice ? availableVoices.indexOf(selectedVoice) : ""}
                          onChange={(e) => setSelectedVoice(availableVoices[e.target.value])}
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                        >
                          {availableVoices.map((voice, index) => (
                            <option key={index} value={index}>
                              {voice.name} ({voice.lang})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          <div className="relative">
            <input
              type="text"
              value={character}
              onChange={(e) => setCharacter(e.target.value)}
              placeholder="Enter any movie character name..."
              className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-400"
            />
            <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-500 w-5 h-5" />
          </div>
        </div>

        <div className="flex-1 bg-black/50 backdrop-blur-sm rounded-lg shadow-lg p-4 mb-4 border border-gray-700 overflow-hidden flex flex-col">
          <div className="overflow-y-auto flex-1">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Bot size={48} className="mb-2 text-yellow-500" />
                <p className="text-center">
                  Enter a character name and start your scene!<br/>
                  <span className="text-sm text-gray-500">The camera is rolling...</span>
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-lg ${msg.isUser ? 'bg-blue-600/70 text-white rounded-br-none' : 'bg-yellow-500/10 border border-yellow-500/30 text-white rounded-bl-none'}`}>
                      {!msg.isUser && (
                        <div className="text-yellow-500 text-sm mb-1">{msg.character}</div>
                      )}
                      <div className={msg.isUser ? 'text-white' : 'text-gray-200'}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-yellow-500/10 border border-yellow-500/30 text-white p-4 rounded-lg rounded-bl-none">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="bg-black/50 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={character ? `Type your message to ${character}...` : "Enter a character name first..."}
              className="flex-1 p-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-400"
              disabled={isLoading || !character}
            />
            <button
              type="submit"
              disabled={isLoading || !message.trim() || !character}
              className="bg-yellow-500 text-gray-900 p-3 rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Send size={24} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Character;