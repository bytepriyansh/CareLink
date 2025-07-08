/* eslint-disable react-hooks/exhaustive-deps */
import  { useState, useRef, useEffect } from 'react';
import { Send, Mic, Volume2, AlertTriangle, Stethoscope, Trash2, Clipboard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { GlassCard } from '../components/ui/glass-card';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../hooks/use-auth';
import { HealthAssistant } from '../lib/gemini';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  severity?: 'low' | 'medium' | 'high';
  mood?: string;
  recommendations?: string[];
  followUpQuestions?: string[];
  emergency?: boolean;
}

const serializeMessages = (messages: Message[]) => {
  return messages.map(msg => ({
    ...msg,
    timestamp: msg.timestamp.toISOString()
  }));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deserializeMessages = (messages: any[]): Message[] => {
  return messages.map(msg => ({
    ...msg,
    timestamp: new Date(msg.timestamp)
  }));
};

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('carelink-chat-history');
      return saved ? deserializeMessages(JSON.parse(saved)) : getInitialMessage();
    }
    return getInitialMessage();
  });

  const { user } = useAuth(); 
  const getStorageKey = () => {
    return user ? `carelink-chat-history-${user.uid}` : 'carelink-chat-history-anon';
  };




  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [assistant] = useState(new HealthAssistant());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any | null>(null);
  const { toast } = useToast();

  function getInitialMessage(): Message[] {
    return [
      {
        id: '1',
        text: "Hello! I'm your CareLink AI assistant. I'm here to help you with any health concerns you might have. Please describe what you're experiencing, and I'll provide guidance and assess the severity of your situation.",
        isUser: false,
        timestamp: new Date(),
        severity: 'low',
        mood: 'Calm'
      }
    ];
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(getStorageKey());
      setMessages(saved ? deserializeMessages(JSON.parse(saved)) : getInitialMessage());
    }
  }, [user]); 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(getStorageKey(), JSON.stringify(serializeMessages(messages)));
    }
  }, [messages, user]); 

  const clearChatHistory = () => {
    setMessages(getInitialMessage());
    if (typeof window !== 'undefined') {
      localStorage.removeItem(getStorageKey());
    }
    toast({
      title: "Chat History Cleared",
      description: "Starting a new conversation",
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: { results: { transcript: unknown; }[][]; }) => {
          const transcript = event.results[0][0].transcript;
          setInputText(prev => prev + ' ' + transcript);
        };

        recognitionRef.current.onerror = (event: { error: string; }) => {
          console.error('Speech recognition error', event.error);
          toast({
            title: "Speech Recognition Error",
            description: event.error === 'not-allowed'
              ? "Microphone access was denied. Please enable microphone permissions."
              : `Error: ${event.error}`,
            variant: "destructive"
          });
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          if (isListening) {
            recognitionRef.current?.start();
          }
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening, toast]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('carelink-chat-history', JSON.stringify(serializeMessages(messages)));
    }
  }, [messages]);

  useEffect(() => {
    assistant.initializeContext({
      age: undefined,
      gender: undefined,
      knownConditions: [],
      medications: [],
      allergies: []
    });
  }, [assistant]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    try {
      const response = await assistant.assessHealthConcern(inputText);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        isUser: false,
        timestamp: new Date(),
        severity: response.severity,
        mood: response.mood,
        recommendations: response.recommendations,
        followUpQuestions: response.followUpQuestions,
        emergency: response.emergency
      };

      setMessages(prev => [...prev, aiResponse]);

      if (response.emergency) {
        toast({
          title: "Emergency Alert",
          description: "This appears to be a serious medical concern. Please seek immediate medical attention.",
          variant: "destructive",
          duration: 10000,
          action: (
            <Button variant="destructive" size="sm" onClick={() => window.open('tel:911')}>
              Call Emergency
            </Button>
          )
        });
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      });
      return;
    }

    if (!isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast({
          title: "Listening...",
          description: "Speak now, I'm listening to your symptoms",
        });
      } catch (err) {
        console.error('Speech recognition start failed:', err);
        toast({
          title: "Microphone Access Required",
          description: "Please allow microphone access to use voice input",
          variant: "destructive"
        });
      }
    } else {
      recognitionRef.current.stop();
      setIsListening(false);
      toast({
        title: "Stopped Listening",
        description: "Processing your voice input...",
      });
    }
  };

  const handleVoiceOutput = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Text-to-Speech Not Supported",
        description: "Your browser doesn't support text-to-speech functionality",
        variant: "destructive"
      });
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  const copyToClipboard = () => {
    const chatText = messages.map(m =>
      `${m.isUser ? 'You' : 'CareLink AI'}: ${m.text}`
    ).join('\n\n');

    navigator.clipboard.writeText(chatText).then(() => {
      toast({
        title: "Copied to Clipboard",
        description: "The conversation has been copied to your clipboard",
      });
    }).catch(() => {
      toast({
        title: "Failed to Copy",
        description: "Couldn't copy the conversation to clipboard",
        variant: "destructive"
      });
    });
  };

  return (
    <div className="min-h-screen mt-8 bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 pt-20 pb-4">
      <div className="max-w-4xl mx-auto px-4 h-[calc(100vh-6rem)] flex flex-col">
        <div className="mb-6 text-center relative">
          <div className="absolute right-0 top-0 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChatHistory}
              className="text-gray-500 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="text-gray-500 hover:text-blue-500"
            >
              <Clipboard className="h-4 w-4 mr-1" />
              Copy
            </Button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
            <Stethoscope className="h-8 w-8 text-teal-600 dark:text-teal-400" />
            CareLink AI Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Describe your symptoms and get immediate guidance
          </p>
        </div>

        <GlassCard className="flex-1 flex flex-col p-4 mb-4 overflow-hidden">
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl p-4 rounded-2xl ${message.isUser
                      ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white ml-12'
                      : 'bg-white/80 dark:bg-slate-800/80 text-gray-900 dark:text-white mr-12'
                    } shadow-lg backdrop-blur-sm animate-fade-in`}
                >
                  {message.emergency && (
                    <div className="flex items-center bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 px-3 py-2 rounded-lg mb-3 -mt-2 -mx-2">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      <span className="font-semibold">Urgent Medical Concern</span>
                    </div>
                  )}

                  <p className="text-sm leading-relaxed">{message.text}</p>

                  {!message.isUser && (
                    <div className="space-y-3 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      {message.recommendations && message.recommendations.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Recommendations</h4>
                          <ul className="space-y-1">
                            {message.recommendations.map((rec, i) => (
                              <li key={i} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {message.severity && (
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${getSeverityColor(message.severity)} animate-pulse`}></div>
                              <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                                {message.severity} Priority
                              </span>
                            </div>
                          )}
                          {message.mood && (
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-600 dark:text-gray-400">
                              {message.mood}
                            </span>
                          )}
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleVoiceOutput(message.text)}
                          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                          disabled={isSpeaking}
                        >
                          {isSpeaking ? (
                            <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                        <div className="pt-2">
                          <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Follow-up Questions</h4>
                          <div className="flex flex-wrap gap-2">
                            {message.followUpQuestions.map((q, i) => (
                              <Button
                                key={i}
                                variant="outline"
                                size="sm"
                                className="text-xs h-auto py-1 px-2"
                                onClick={() => handleQuickQuestion(q)}
                              >
                                {q}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center space-x-3 mt-auto">
            <div className="flex-1 relative">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Describe your symptoms or health concerns..."
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="pr-12 bg-white/50 dark:bg-slate-800/50 border-white/30 dark:border-slate-700/50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-300"
                disabled={isProcessing}
              />
            </div>

            <Button
              onClick={handleVoiceInput}
              variant={isListening ? "destructive" : "outline"}
              size="sm"
              className={`h-10 w-10 p-0 transition-all duration-300 ${isListening ? 'animate-pulse' : 'hover:bg-white/20'
                }`}
              disabled={isProcessing || !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)}
            >
              <Mic className="h-4 w-4" />
            </Button>

            <Button
              onClick={handleSend}
              disabled={!inputText.trim() || isProcessing}
              className="h-10 w-10 p-0 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-300 hover:scale-105"
            >
              {isProcessing ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </GlassCard>

        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>AI Assistant is online and ready to help</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Note: This is not a substitute for professional medical advice
          </p>
        </div>
      </div>
    </div>
  );
}