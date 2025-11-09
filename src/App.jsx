import React, { useState, useEffect, useRef } from 'react';
import { BrainCircuit, Send, MessageSquareText, Loader2, Zap, LayoutGrid } from 'lucide-react';

// --- Component: MessageBubble ---
// This component displays a single chat message
const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  // Use different icons and styles based on who sent the message
  const roleIcon = isUser ? <Zap className="w-5 h-5 text-indigo-400" /> : <BrainCircuit className="w-5 h-5 text-yellow-400" />;
  const roleName = isUser ? 'You' : 'Translator';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-3xl flex items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Icon */}
        <div className={`p-2 rounded-full ${isUser ? 'ml-3 bg-indigo-900' : 'mr-3 bg-yellow-900'} flex-shrink-0 shadow-lg`}>
          {roleIcon}
        </div>
        {/* Message Content */}
        <div className={`p-4 rounded-xl shadow-xl ${
          isUser 
            ? 'bg-indigo-600/30 text-gray-100 rounded-tr-none border border-indigo-500/50' 
            : 'bg-gray-800/60 text-gray-200 rounded-tl-none border border-gray-700'
        }`}>
          <p className="font-semibold text-sm mb-1 opacity-70">{roleName}</p>
          {/* Render text with bolding (**) and newlines (\n) */}
          <div 
            className="text-base whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ 
              __html: message.content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                .replace(/\n/g, '<br />')
            }}
          />
        </div>
      </div>
    </div>
  );
};

// --- Component: LandingPage ---
// This is the homepage of the app
const LandingPage = ({ startChat }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-900">
      <BrainCircuit className="w-24 h-24 text-indigo-400 mb-6 animate-pulse-slow" />
      <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
        AI Thought Translator
      </h1>
      <p className="text-xl text-gray-400 max-w-lg mb-10 font-light">
        Decode the underlying concept behind your raw ideas. Read what you <span className='font-semibold'>meant</span>, not just what you wrote.
      </p>
      {/* Feature tags */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-12 text-gray-300 font-medium">
        <span className="flex items-center space-x-2 p-3 rounded-full bg-gray-800 shadow-md"><Zap className="w-5 h-5 text-green-400"/> Learning Mode</span>
        <span className="flex items-center space-x-2 p-3 rounded-full bg-gray-800 shadow-md"><LayoutGrid className="w-5 h-5 text-orange-400"/> Productivity Mode</span>
        <span className="flex items-center space-x-2 p-3 rounded-full bg-gray-800 shadow-md"><MessageSquareText className="w-5 h-5 text-sky-400"/> Creative Mode</span>
      </div>
      {/* "Get Started" button */}
      <button
        onClick={startChat}
        className="px-10 py-4 text-lg font-semibold rounded-full bg-indigo-600 text-white shadow-2xl shadow-indigo-500/50 hover:bg-indigo-500 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-indigo-500"
      >
        Get Started
      </button>
    </div>
  );
};

// --- Component: ChatPage ---
// This is the main chat interface
const ChatPage = ({ messages, sendMessage, isLoading, goHome }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null); // Used to auto-scroll to the bottom

  // Handle form submission
  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;
    sendMessage(input);
    setInput(''); // Clear input field
  };

  // Auto-scroll logic
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]); // Scroll every time messages change

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header Bar */}
      <header className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-950/70 backdrop-blur-sm sticky top-0 z-10 shadow-lg">
        <button onClick={goHome} className="text-gray-400 hover:text-indigo-400 transition">
          <BrainCircuit className="w-6 h-6 inline mr-2" />
          <span className="font-bold text-lg">Thought Translator</span>
        </button>
        <div className="text-sm text-gray-500">
          Phase 2 Prototype (Lazy Bat)
        </div>
      </header>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
        <div className="max-w-5xl mx-auto">
          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))}
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start mb-6">
                <div className="mr-3 p-2 rounded-full bg-yellow-900 flex-shrink-0 shadow-lg">
                    <BrainCircuit className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="p-4 bg-gray-800/60 rounded-xl rounded-tl-none text-gray-300 shadow-xl border border-gray-700">
                    <Loader2 className="w-5 h-5 animate-spin mr-2 inline" /> Decoding your thought...
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form Footer */}
      <footer className="p-4 border-t border-gray-700 bg-gray-950/70 sticky bottom-0 z-10">
        <form onSubmit={handleSend} className="max-w-5xl mx-auto flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Type your raw, unclear thought here..."
            className="flex-1 p-4 rounded-l-full bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 placeholder-gray-500 text-base"
          />
          <button
            type="submit"
            disabled={input.trim() === '' || isLoading}
            className={`p-4 rounded-r-full flex items-center justify-center transition duration-200 ${
              input.trim() === '' || isLoading
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/30'
            }`}
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </footer>
    </div>
  );
};


// --- Main App Component ---
// This component manages the state and logic for the entire app
export default function App() {
  // State to toggle between LandingPage and ChatPage
  const [isChatMode, setIsChatMode] = useState(false);
  // State to hold all chat messages
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      content: "Hello! I am the AI Thought Translator. What raw, unclear thought can I decode into a structured concept for you?" 
    }
  ]);
  // State to show the loading indicator
  const [isLoading, setIsLoading] = useState(false);
  
  // ==================================================================
  // THIS IS THE SECURE, FRONTEND-ONLY API CALL FUNCTION
  // It calls *your* backend (/api/translate), not Google's.
  // ==================================================================
  const handleSendMessage = async (userInput) => {
    const newUserMessage = { role: 'user', content: userInput };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);
    
    // This is the beginner-friendly system prompt we created
    const systemPrompt = `You are the 'AI Thought Translator'. Your mission is to decode a user's raw, unclear, or incomplete thought and translate it into a clear, structured concept.

**CRITICAL RULE: Your tone must be simple, clear, and beginner-friendly. Explain it like you would to a smart friend. Avoid all academic or business jargon.**

Your response MUST follow this exact 4-part structure using Markdown:

1.  **Concept Decoded:** [Identify the core idea in 1-3 simple words. e.g., 'Keeping things in Orbit' or 'Wasted Meeting Time'.]
2.  **Clear Explanation:** [Provide a concise, simple definition. Explain *why* the user's thought is important, using plain English.]
3.  **Helpful Analogy:** [Provide a simple, real-world analogy to make the- concept stick. e.g., 'It's like throwing a ball...']
4.  **Actionable Next Steps:** [Suggest 2-3 simple, practical next steps. Do not suggest complex frameworks like 'RACI Matrix' unless you explain it simply.]
`;
    
    // This is the user's query
    const userQuery = `User's raw thought: "${userInput}"`;

    try {
      // 1. Call YOUR backend, not Google's
      const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // 2. Send the prompts to your backend
          body: JSON.stringify({ userQuery, systemPrompt })
      });

      // 3. This is the robust error handling for a Vercel function
      if (!response.ok) {
        // We received an error (e.g., 500, 404, 401).
        // We will try to read the error message as text first,
        // as it might be an HTML error page from Vercel, not JSON.
        const errorText = await response.text();
        
        try {
          // See if the error text is valid JSON (like we send from our backend)
          const errorData = JSON.parse(errorText);
          // If it is, use the helpful error message from our API
          throw new Error(errorData.error || `API call failed with status: ${response.status}`);
        } catch (e) {
          // If it's not JSON, it's a server crash.
          // This will show "Vercel: Function timed out" or "API key not configured"
          throw new Error(errorText || `API call failed with status: ${response.status}`);
        }
      }

      // 4. Get the same Gemini response back from your backend
      const result = await response.json();
      
      if (!result.candidates || result.candidates.length === 0 || !result.candidates[0].content) {
        throw new Error("API returned no content. Check safety settings or prompt.");
      }
      
      const text = result.candidates[0].content.parts[0].text;
      setMessages((prev) => [...prev, { role: 'ai', content: text }]);

    } catch (error) {
      console.error("API Call Error:", error);
      // 5. Show a safe error message
      setMessages((prev) => [...prev, { role: 'ai', content: `Sorry, I encountered an error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };
  // ==================================================================
  // END OF API CALL FUNCTION
  // ==================================================================

  return (
    // This is the main container for the app
    <div className="h-screen w-full bg-gray-900 font-sans">
      <style>{`
        /* Custom scrollbar styling for a darker theme */
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1f2937; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280; }
        /* Animation for the landing page icon */
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
      
      {/* View switching logic */}
      {isChatMode ? (
        // Show the chat page
        <ChatPage 
          messages={messages} 
          sendMessage={handleSendMessage} 
          isLoading={isLoading} 
          goHome={() => setIsChatMode(false)} // Button to go back to landing
        />
      ) : (
        // Show the landing page
        <LandingPage startChat={() => setIsChatMode(true)} /> // Button to enter chat
      )}
    </div>
  );
}