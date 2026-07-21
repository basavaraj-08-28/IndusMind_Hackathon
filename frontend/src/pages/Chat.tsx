import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockStore, Document } from '../utils/mockData';
import { 
  Send, Mic, MicOff, Copy, Download, RefreshCw, FileText, Check, 
  HelpCircle, Terminal, Bot, User, Volume2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  citations?: string[]; // IDs of documents cited
  timestamp: string;
}

export const Chat: React.FC = () => {
  const { isBackendConnected, backendUrl } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "IndusMind AI stand-by. I have indexed plant blueprints, ASME boiler guidelines, Factory Act parameters, and maintenance logs. Ask me anything regarding equipment health, SOP checklists, or past incident reports.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const documents = mockStore.getDocuments();

  const suggestedQuestions = [
    'Why did Pump P101 fail?',
    'Show maintenance history of Boiler 2.',
    'Which SOP should be followed before maintenance?',
    'What inspections are pending for Boiler 2?',
    'Suggest preventive maintenance for Compressor A.'
  ];

  // Speech Recognition (Web Speech API)
  let recognition: any = null;
  if ('webkitSpeechRecognition' in window) {
    const Speech = (window as any).webkitSpeechRecognition;
    recognition = new Speech();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSpeech = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome.');
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognition.start();
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setQuery(text);
        setIsListening(false);
      };
      recognition.onerror = () => {
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
    }
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    // Call Real Backend RAG API if online
    if (isBackendConnected) {
      try {
        const response = await fetch(`${backendUrl}/api/chat/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: textToSend }),
        });
        if (response.ok) {
          const data = await response.json();
          // Simulate streaming back in UI
          streamResponse(data.answer, data.citations);
          return;
        }
      } catch {
        // Fallback to simulation on connection failure
      }
    }

    // Mock In-Browser RAG solver fallback
    setTimeout(() => {
      const { answer, citations } = solveMockQuery(textToSend);
      streamResponse(answer, citations);
    }, 1000);
  };

  const streamResponse = (fullText: string, citations: string[]) => {
    const aiMsgId = 'msg-' + Math.random().toString(36).substr(2, 9);
    
    // Add empty message
    const newMsg: ChatMessage = {
      id: aiMsgId,
      sender: 'ai',
      text: '',
      citations,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages((prev) => [...prev, newMsg]);
    setIsLoading(false);

    let currentLength = 0;
    const words = fullText.split(' ');
    
    const interval = setInterval(() => {
      if (currentLength >= words.length) {
        clearInterval(interval);
        return;
      }
      const partialText = words.slice(0, currentLength + 1).join(' ');
      setMessages((prev) => 
        prev.map((msg) => msg.id === aiMsgId ? { ...msg, text: partialText } : msg)
      );
      currentLength++;
    }, 45); // Speed multiplier
  };

  const solveMockQuery = (text: string): { answer: string; citations: string[] } => {
    const q = text.toLowerCase();
    
    if (q.includes('p101') && q.includes('fail')) {
      return {
        answer: "According to standard Incident Report [doc-1], Centrifugal Pump P101 experienced structural failures due to excessive shaft misalignment (measured deviation at 0.45mm, exceeding limit of 0.05mm). This led to thermal expansion of the bearings, resulting in structural seize. The associated SOP checklist requires checking mechanical shaft alignment during weekly logs.",
        citations: ['doc-1']
      };
    }
    
    if (q.includes('boiler 2') || q.includes('b202')) {
      if (q.includes('history') || q.includes('maintenance')) {
        return {
          answer: "Steam Boiler B202 has two key logs inside our records [doc-2] [doc-4]. The last pressure relief check was on 2025-11-15 by Marcus Vance. Annual safety validation check [doc-4] noted safety valve SV-B seat leakage. It currently has a critical pending maintenance item to replace pressure valve SV-B, due by 2026-07-20.",
          citations: ['doc-2', 'doc-4']
        };
      }
      return {
        answer: "Steam Boiler B202 has a pending inspection for pressure valve recertification [doc-4]. It currently exhibits a critical status rating (Health: 48%) due to steam micro-leakage around gasket flange at 520°C detected on 2026-07-05.",
        citations: ['doc-4']
      };
    }

    if (q.includes('sop') || q.includes('maintenance checklist')) {
      return {
        answer: "Before starting pump operations or maintenance checks, technicians must execute the LOTO protocols detailed in SOP-Pump-P101-Startup [doc-1]. Ensure electrical switches are locked out and verification tags are attached in line with OSHA 1910.147 requirements.",
        citations: ['doc-1']
      };
    }

    if (q.includes('compressor a') || q.includes('c303')) {
      return {
        answer: "Preventive maintenance recommendations for Reciprocating Compressor C303 [doc-3] include:\n1. Inspecting differential pressure gauges across the oil filter (every 90 days) to prevent clogging.\n2. Checking vibration thresholds on piston cylinder casings.\n3. Checking piston ring wear parameters during oil changes.",
        citations: ['doc-3']
      };
    }

    // Default RAG mock response
    return {
      answer: "I parsed your query against our indexed manuals and compliance parameters [doc-5]. Based on statutory Factory Act safety regulations, please make sure lockouts are tagged, safety guards are mounted on belts, and a licensed plant operator is notified before initiating this inspection. Let me know if you would like me to list related SOP manuals.",
      citations: ['doc-5']
    };
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadChat = () => {
    const content = messages.map(m => `[${m.timestamp}] ${m.sender === 'user' ? 'Operator' : 'IndusMind AI'}: ${m.text}`).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `indusmind_chat_log_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[800px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Banner */}
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              Operations Copilot <span className="text-[9px] bg-indigo-650/40 text-indigo-400 px-1.5 py-0.5 rounded-full">Gemini RAG</span>
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">ChromaDB index: 5 documents, 75 chunks</p>
          </div>
        </div>

        <button 
          onClick={handleDownloadChat}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors border border-slate-800"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Conversation</span>
        </button>
      </div>

      {/* Messages Canvas */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/40">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-xs ${
              msg.sender === 'user' 
                ? 'bg-slate-800 text-slate-300' 
                : 'bg-indigo-600 text-white'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className={`p-4 rounded-2xl relative group ${
              msg.sender === 'user'
                ? 'bg-indigo-650 text-slate-100 rounded-tr-none'
                : 'bg-slate-950 text-slate-300 border border-slate-850 rounded-tl-none'
            }`}>
              <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              
              {/* Citations Bubble */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-slate-850 flex items-center flex-wrap gap-2 text-[10px]">
                  <span className="text-slate-500 font-semibold font-mono">Sources cited:</span>
                  {msg.citations.map((docId) => {
                    const linkedDoc = documents.find(d => d.id === docId);
                    return (
                      <span 
                        key={docId}
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-550/20 text-indigo-400 font-mono text-[9px]"
                        title={linkedDoc?.name || 'Manual'}
                      >
                        <FileText className="w-3 h-3" />
                        {linkedDoc?.name.slice(0, 15) || 'Document'}...
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Timestamp and Copy Actions */}
              <div className="flex justify-between items-center mt-3 text-[9px] text-slate-500">
                <span className="font-mono">{msg.timestamp}</span>
                <button
                  onClick={() => handleCopy(msg.id, msg.text)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-850 text-slate-400 rounded transition-all"
                  title="Copy text"
                >
                  {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-lg">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex-shrink-0 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl rounded-tl-none border border-slate-850 flex items-center gap-3">
              <span className="text-xs text-slate-500">Gemini retrieving vectors...</span>
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions panel */}
      {messages.length === 1 && (
        <div className="px-6 py-4 bg-slate-950/20 border-t border-slate-850 space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Suggested Plant Queries:
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="px-3 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-350 hover:text-indigo-400 hover:border-indigo-500/35 transition-all text-left truncate max-w-sm"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form Panel */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(query);
        }}
        className="px-6 py-4 border-t border-slate-850 bg-slate-950 flex items-center gap-3"
      >
        {/* Voice dictation button */}
        <button
          type="button"
          onClick={handleSpeech}
          className={`p-2.5 rounded-lg transition-colors border ${
            isListening 
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse' 
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
          title={isListening ? 'Listening... click to stop' : 'Record voice query'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Query plant assets, SOP checklists or regulatory details..."
          className="flex-1 py-2.5 px-4 bg-slate-900 border border-slate-850 rounded-lg text-xs outline-none text-slate-100 placeholder-slate-500 focus:border-indigo-500/60"
        />

        {/* Send */}
        <button
          type="submit"
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
