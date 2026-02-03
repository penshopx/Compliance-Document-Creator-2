import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, BookOpen, ExternalLink, Maximize2, Minimize2 } from "lucide-react";
import { useIndustry } from "@/hooks/use-industry";

export default function KnowledgeChatbot() {
  const { currentIndustry } = useIndustry();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const colorMap: Record<string, { bg: string; iconBg: string }> = {
    blue: { bg: "bg-blue-600", iconBg: "bg-blue-100" },
    green: { bg: "bg-green-600", iconBg: "bg-green-100" },
    amber: { bg: "bg-amber-600", iconBg: "bg-amber-100" },
    yellow: { bg: "bg-yellow-600", iconBg: "bg-yellow-100" },
    orange: { bg: "bg-orange-600", iconBg: "bg-orange-100" },
    purple: { bg: "bg-purple-600", iconBg: "bg-purple-100" },
    indigo: { bg: "bg-indigo-600", iconBg: "bg-indigo-100" },
    red: { bg: "bg-red-600", iconBg: "bg-red-100" },
    cyan: { bg: "bg-cyan-600", iconBg: "bg-cyan-100" },
    emerald: { bg: "bg-emerald-600", iconBg: "bg-emerald-100" },
  };

  const colors = colorMap[currentIndustry?.color || "blue"] || colorMap.blue;

  const openExternalChat = () => {
    window.open("https://chat.dokumentender.com", "_blank");
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-44 right-6 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className={`rounded-full shadow-lg ${colors.bg}`}
          size="icon"
          data-testid="button-open-knowledge-chatbot"
        >
          <BookOpen className="h-5 w-5 text-white" />
        </Button>
      </div>
    );
  }

  const containerClasses = isMaximized 
    ? "fixed inset-4 z-50 flex flex-col" 
    : "fixed bottom-44 right-6 w-[450px] h-[600px] shadow-xl z-50 flex flex-col";

  return (
    <Card className={containerClasses} data-testid="knowledge-chatbot-container">
      <CardHeader className={`pb-3 ${colors.bg} text-white rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                Knowledge Base
              </CardTitle>
              <span className="text-xs text-white/80">
                {currentIndustry?.shortName || "Industri"}
              </span>
            </div>
            <Badge variant="secondary" className="text-xs" data-testid="badge-knowledge">AI</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={openExternalChat}
              title="Buka di tab baru"
              data-testid="button-open-external"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMaximized(!isMaximized)}
              title={isMaximized ? "Perkecil" : "Perbesar"}
              data-testid="button-toggle-maximize"
            >
              {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(false)}
              data-testid="button-close-knowledge-chatbot"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden">
        <iframe
          src="https://chat.dokumentender.com"
          className="w-full h-full border-0"
          title="Knowledge Base Chat"
          allow="microphone"
          data-testid="iframe-knowledge-chat"
        />
      </CardContent>
      
      <div className="p-2 border-t bg-muted/50 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Powered by dokumentender.com
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs h-auto p-1"
          onClick={openExternalChat}
          data-testid="button-open-fullscreen"
        >
          Buka Fullscreen <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </Card>
  );
}
