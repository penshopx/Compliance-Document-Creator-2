import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  X, Send, Bot, User, Key, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const PROACTIVE_GREETINGS = [
  "Selamat datang di SMAP Mentor! Saya siap membantu Anda memahami SNI ISO 37001:2016 dan Pancek. Ada yang ingin Anda pelajari hari ini?",
  "Halo! Saya adalah asisten AI untuk pembelajaran SMAP. Apakah Anda ingin memulai dengan pengenalan dasar atau langsung ke topik spesifik?",
  "Selamat datang! Saya dapat membantu Anda memahami implementasi Sistem Manajemen Anti Penyuapan. Apa yang ingin Anda ketahui?"
];

const SUGGESTED_TOPICS = [
  "Apa itu SNI ISO 37001?",
  "Jelaskan 6 fase PDCAR Pancek",
  "Bagaimana implementasi SMAP?",
  "Apa saja dokumen wajib SMAP?"
];

export default function SMAPMentorChat() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  useEffect(() => {
    if (isOpen && !hasGreeted && apiKey) {
      const greeting = PROACTIVE_GREETINGS[Math.floor(Math.random() * PROACTIVE_GREETINGS.length)];
      setMessages([{
        id: "greeting",
        role: "assistant",
        content: greeting,
        timestamp: new Date()
      }]);
      setHasGreeted(true);
    }
  }, [isOpen, hasGreeted, apiKey]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("gemini_api_key", apiKey.trim());
      setShowApiKeyInput(false);
      toast({ title: "API Key tersimpan", description: "Gemini API Key berhasil disimpan" });
      
      if (!hasGreeted) {
        const greeting = PROACTIVE_GREETINGS[Math.floor(Math.random() * PROACTIVE_GREETINGS.length)];
        setMessages([{
          id: "greeting",
          role: "assistant",
          content: greeting,
          timestamp: new Date()
        }]);
        setHasGreeted(true);
      }
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !apiKey) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages
        .filter(m => m.id !== "greeting")
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/mentor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history,
          apiKey
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "API request failed");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Gagal menghubungi AI. Periksa API Key Anda.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (!isOpen) {
    return (
      <div 
        className="fixed shadow-lg"
        style={{ zIndex: 9999, bottom: '16px', left: '16px' }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-blue-600 h-14 w-14"
          data-testid="button-open-mentor-chat"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 w-96 h-[500px] shadow-xl flex flex-col" style={{ zIndex: 9999 }} data-testid="card-mentor-chat">
      <CardHeader className="pb-2 border-b bg-blue-600 text-white rounded-t-lg">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <CardTitle className="text-base" data-testid="text-mentor-title">SMAP Mentor</CardTitle>
            <Badge variant="secondary" className="text-xs" data-testid="badge-ai">AI</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              data-testid="button-api-key-toggle"
            >
              <Key className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(false)}
              data-testid="button-close-mentor-chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {showApiKeyInput && (
        <div className="p-3 bg-muted border-b">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium" data-testid="label-api-key">Gemini API Key</label>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Masukkan API Key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="text-xs"
                data-testid="input-api-key"
              />
              <Button size="sm" onClick={saveApiKey} data-testid="button-save-api-key">
                Simpan
              </Button>
            </div>
            <a 
              href="https://aistudio.google.com/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
              data-testid="link-get-api-key"
            >
              Dapatkan API Key dari Google AI Studio
            </a>
          </div>
        </div>
      )}

      <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
        {!apiKey ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <Key className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2" data-testid="text-api-key-required">API Key Diperlukan</h3>
            <p className="text-sm text-muted-foreground mb-4" data-testid="text-api-key-description">
              Masukkan Gemini API Key untuk memulai mentoring SMAP
            </p>
            <Button onClick={() => setShowApiKeyInput(true)} data-testid="button-setup-api-key">
              <Key className="h-4 w-4 mr-2" />
              Setup API Key
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-3" ref={scrollRef}>
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    data-testid={`message-${msg.role}-${msg.id}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-muted"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.role === "user" && (
                      <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2 justify-start" data-testid="loading-indicator">
                    <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="bg-muted rounded-lg px-3 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {messages.length <= 1 && (
              <div className="px-3 py-2 border-t">
                <p className="text-xs text-muted-foreground mb-2" data-testid="text-suggested-topics">Topik yang disarankan:</p>
                <div className="flex flex-wrap gap-1">
                  {SUGGESTED_TOPICS.map((topic, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => sendMessage(topic)}
                      data-testid={`button-topic-${idx}`}
                    >
                      {topic}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3 border-t">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  placeholder="Ketik pertanyaan Anda..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1"
                  data-testid="input-chat-message"
                />
                <Button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  data-testid="button-send-message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
