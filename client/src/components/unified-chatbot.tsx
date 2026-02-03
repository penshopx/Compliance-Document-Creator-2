import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X, Send, Bot, User, Loader2, Settings2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIndustry } from "@/hooks/use-industry";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/`{3}[\s\S]*?`{3}/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '- ')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/^>\s*/gm, '')
    .replace(/---+/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export default function UnifiedChatbot() {
  const { toast } = useToast();
  const { currentIndustry, industries, setIndustry, currentIndustryId } = useIndustry();
  const [isOpen, setIsOpen] = useState(false);
  const [showIndustrySelector, setShowIndustrySelector] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const chatbotConfig = currentIndustry?.chatbot;
  
  const colorMap: Record<string, { bg: string; iconColor: string; iconBg: string }> = {
    blue: { bg: "bg-blue-600", iconColor: "text-blue-600", iconBg: "bg-blue-100" },
    green: { bg: "bg-green-600", iconColor: "text-green-600", iconBg: "bg-green-100" },
    amber: { bg: "bg-amber-600", iconColor: "text-amber-600", iconBg: "bg-amber-100" },
    yellow: { bg: "bg-yellow-600", iconColor: "text-yellow-600", iconBg: "bg-yellow-100" },
    orange: { bg: "bg-orange-600", iconColor: "text-orange-600", iconBg: "bg-orange-100" },
    purple: { bg: "bg-purple-600", iconColor: "text-purple-600", iconBg: "bg-purple-100" },
    indigo: { bg: "bg-indigo-600", iconColor: "text-indigo-600", iconBg: "bg-indigo-100" },
    red: { bg: "bg-red-600", iconColor: "text-red-600", iconBg: "bg-red-100" },
    cyan: { bg: "bg-cyan-600", iconColor: "text-cyan-600", iconBg: "bg-cyan-100" },
    emerald: { bg: "bg-emerald-600", iconColor: "text-emerald-600", iconBg: "bg-emerald-100" },
  };
  
  const colors = colorMap[currentIndustry?.color || "blue"] || colorMap.blue;
  const colorClass = colors.bg;
  const iconColorClass = colors.iconColor;
  const iconBgClass = colors.iconBg;

  useEffect(() => {
    if (isOpen && !hasGreeted && chatbotConfig) {
      const greeting = chatbotConfig.greetings[Math.floor(Math.random() * chatbotConfig.greetings.length)];
      setMessages([{
        id: "greeting",
        role: "assistant",
        content: greeting,
        timestamp: new Date()
      }]);
      setHasGreeted(true);
    }
  }, [isOpen, hasGreeted, chatbotConfig]);

  useEffect(() => {
    setMessages([]);
    setHasGreeted(false);
  }, [currentIndustryId]);

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

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
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
          industryId: currentIndustryId 
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
        description: error instanceof Error ? error.message : "Gagal menghubungi AI.",
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
      <div className="fixed bottom-4 right-6 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className={`rounded-full shadow-lg ${colorClass}`}
          size="icon"
          data-testid="button-open-chatbot"
        >
          <Bot className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-6 w-96 h-[520px] shadow-xl z-50 flex flex-col" data-testid="card-chatbot">
      <CardHeader className={`pb-2 border-b ${colorClass} text-white rounded-t-lg`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <CardTitle className="text-base" data-testid="text-chatbot-title">
              {chatbotConfig?.name || "AI Mentor"}
            </CardTitle>
            <Badge variant="secondary" className="text-xs" data-testid="badge-ai">AI</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowIndustrySelector(!showIndustrySelector)}
              data-testid="button-industry-selector"
            >
              <Settings2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(false)}
              data-testid="button-close-chatbot"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {showIndustrySelector && (
          <div className="mt-2 p-2 bg-white/10 rounded-lg">
            <p className="text-xs mb-2 opacity-80">Pilih Industri:</p>
            <div className="flex flex-wrap gap-1">
              {industries.map((ind) => (
                <Button
                  key={ind.id}
                  variant={currentIndustryId === ind.id ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setIndustry(ind.id);
                    setShowIndustrySelector(false);
                  }}
                  className="text-xs"
                  data-testid={`button-industry-${ind.id}`}
                >
                  {ind.shortName}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-3" ref={scrollRef}>
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                data-testid={`message-${msg.role}-${msg.id}`}
              >
                {msg.role === "assistant" && (
                  <div className={`h-7 w-7 rounded-full ${iconBgClass} flex items-center justify-center shrink-0`}>
                    <Bot className={`h-4 w-4 ${iconColorClass}`} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? `${colorClass} text-white`
                      : "bg-muted"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.role === "assistant" ? stripMarkdown(msg.content) : msg.content}</p>
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
                <div className={`h-7 w-7 rounded-full ${iconBgClass} flex items-center justify-center`}>
                  <Bot className={`h-4 w-4 ${iconColorClass}`} />
                </div>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {messages.length <= 1 && chatbotConfig && (
          <div className="px-3 py-2 border-t">
            <p className="text-xs text-muted-foreground mb-2" data-testid="text-suggested-topics">Topik yang disarankan:</p>
            <div className="flex flex-wrap gap-1">
              {chatbotConfig.suggestedTopics.slice(0, 4).map((topic, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-1"
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
              className={colorClass}
              data-testid="button-send-message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
