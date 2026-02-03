import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useIndustry } from "@/hooks/use-industry";

export default function KnowledgeChatbot() {
  const { currentIndustry } = useIndustry();

  const colorMap: Record<string, string> = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    amber: "bg-amber-600",
    yellow: "bg-yellow-600",
    orange: "bg-orange-600",
    purple: "bg-purple-600",
    indigo: "bg-indigo-600",
    red: "bg-red-600",
    cyan: "bg-cyan-600",
    emerald: "bg-emerald-600",
  };

  const bgColor = colorMap[currentIndustry?.color || "blue"] || colorMap.blue;

  const openKnowledgeBase = () => {
    window.open("https://chat.dokumentender.com", "_blank");
  };

  return (
    <div className="fixed bottom-44 right-6 z-40">
      <Button
        onClick={openKnowledgeBase}
        className={`rounded-full shadow-lg ${bgColor}`}
        size="icon"
        title="Knowledge Base - dokumentender.com"
        data-testid="button-open-knowledge-chatbot"
      >
        <BookOpen className="h-5 w-5 text-white" />
      </Button>
    </div>
  );
}
