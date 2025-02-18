import React from 'react';
import { MessageCircle, Sparkles, Brain, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
function Home() {


  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-purple-900 to-violet-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div className="container mx-auto px-4 py-24 relative z-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <MessageCircle className="w-20 h-20 text-purple-400" />
            </div>
            <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-8">
              Talk to Your Character
            </h1>
            <p className="text-3xl text-gray-300 mb-12">
              Experience unique conversations with characters that understand and respond to you
            </p>
            
            <Link
              to='character'
              className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white text-xl px-12 py-6 rounded-full transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
            >
              <MessageCircle className="w-8 h-8 mr-3" />
              Start Chatting Now
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl">
            <div className="bg-purple-600/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Intelligent Conversations</h3>
            <p className="text-gray-300">
              Engage in meaningful dialogues with characters that understand context and nuance
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl">
            <div className="bg-purple-600/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Unique Personalities</h3>
            <p className="text-gray-300">
              Each character has their own distinct personality and way of communicating
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl">
            <div className="bg-purple-600/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Real-time Responses</h3>
            <p className="text-gray-300">
              Get instant, contextual responses that keep the conversation flowing naturally
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-sm rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Conversation?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Jump into an engaging chat experience with unique characters
          </p>
          <Link
            to='character'
            className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl transform transition-all duration-300 hover:scale-105"
          >
            <MessageCircle className="w-6 h-6 mr-2" />
            Begin Your Chat Adventure
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;