import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X, Send, HelpCircle, User, Loader2, BookOpen, ChevronRight } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface HelpTopic {
  id: string;
  title: string;
  content: string;
}

const helpTopics: HelpTopic[] = [
  {
    id: "getting-started",
    title: "Memulai Aplikasi",
    content: `Selamat datang di Platform Generator Dokumen Multi-Industri!

Untuk memulai:
1. Pilih industri Anda di sidebar atau halaman Pengaturan Industri
2. Isi Profil Perusahaan dengan data lengkap
3. Akses menu Template Dokumen untuk membuat dokumen
4. Gunakan AI Generator untuk membuat dokumen otomatis

Tips: Semakin lengkap data profil perusahaan, semakin akurat dokumen yang dihasilkan.`
  },
  {
    id: "industry-selection",
    title: "Memilih Industri",
    content: `Platform mendukung 20 industri berbeda, masing-masing dengan template dan fitur spesifik:

- SMAP: Sertifikasi ISO 37001 Anti Penyuapan
- Pancek: Panduan Cegah Korupsi KPK
- Konstruksi: Perijinan SBU, SKA, SKT
- Energi, Migas, Lingkungan
- UMKM, ISO, K3, Tender, Keuangan
- Kesehatan, Pendidikan, Teknologi
- Pertanian, Manufaktur, Properti
- Logistik, Pariwisata, Telekomunikasi

Cara mengganti industri:
1. Klik Pengaturan Industri di sidebar
2. Pilih industri yang sesuai
3. Semua template dan menu akan menyesuaikan`
  },
  {
    id: "document-templates",
    title: "Template Dokumen",
    content: `Setiap industri memiliki template dokumen spesifik:

Cara menggunakan template:
1. Buka menu Template Dokumen
2. Filter berdasarkan kategori
3. Klik template yang diinginkan
4. Isi data yang diperlukan
5. Generate dokumen dengan AI

Template mencakup:
- Dokumen perijinan dan sertifikasi
- Kontrak dan perjanjian
- SOP dan instruksi kerja
- Laporan dan formulir standar`
  },
  {
    id: "ai-generator",
    title: "AI Document Generator",
    content: `AI Generator membantu membuat dokumen otomatis:

Cara menggunakan:
1. Pilih template atau mulai dari kosong
2. Masukkan prompt atau deskripsi dokumen
3. AI akan generate draft dokumen
4. Edit dan sesuaikan hasilnya
5. Download atau simpan dokumen

Tips untuk prompt yang baik:
- Jelaskan tujuan dokumen dengan spesifik
- Sertakan data penting yang harus ada
- Tentukan format atau struktur yang diinginkan`
  },
  {
    id: "subscription",
    title: "Berlangganan & Pembayaran",
    content: `Platform menawarkan paket berlangganan per industri:

Cara berlangganan:
1. Pilih paket di halaman Pricing
2. Pilih metode pembayaran (Transfer Bank/QRIS)
3. Lakukan pembayaran
4. Konfirmasi via WhatsApp
5. Akun akan diaktifkan

Metode pembayaran:
- Transfer Bank: BCA, Mandiri, BRI, BNI
- E-Wallet via QRIS: GoPay, OVO, Dana, ShopeePay

Hubungi 0812-3456-7890 untuk bantuan pembayaran.`
  },
  {
    id: "chatbot-mentor",
    title: "AI Mentor Chatbot",
    content: `Setiap industri memiliki AI Mentor dengan keahlian spesifik:

Cara menggunakan Mentor:
1. Klik ikon chat di pojok kanan bawah
2. Pilih industri jika perlu (ikon settings)
3. Ketik pertanyaan Anda
4. Mentor akan memberikan panduan

Mentor dapat membantu:
- Menjawab pertanyaan regulasi
- Memberikan panduan perijinan
- Membantu menyusun dokumen
- Menjelaskan persyaratan sertifikasi`
  }
];

export default function HelpChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTopics, setShowTopics] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: "greeting",
        role: "assistant",
        content: "Halo! Saya Help Bot, siap membantu Anda memahami cara menggunakan platform ini. Pilih topik di bawah atau ketik pertanyaan Anda.",
        timestamp: new Date()
      }]);
    }
  }, [isOpen, messages.length]);

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

  const handleTopicClick = (topic: HelpTopic) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: topic.title,
      timestamp: new Date()
    };
    
    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: topic.content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setShowTopics(false);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setShowTopics(false);

    try {
      const response = await fetch("/api/ai/help-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content.trim(),
          history: messages.slice(-10).map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const fallbackMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "Maaf, saya tidak dapat menemukan jawaban spesifik untuk pertanyaan Anda. Silakan pilih salah satu topik bantuan atau hubungi tim support kami.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
      setShowTopics(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-24 right-6 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full shadow-lg bg-slate-600"
          size="icon"
          data-testid="button-open-help-chatbot"
        >
          <HelpCircle className="h-5 w-5 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-24 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col" data-testid="help-chatbot-container">
      <CardHeader className="pb-3 bg-slate-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <HelpCircle className="h-4 w-4" />
            </div>
            <CardTitle className="text-lg font-semibold">
              Help Bot
            </CardTitle>
            <Badge variant="secondary" className="text-xs" data-testid="badge-help">Bantuan</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowTopics(!showTopics)}
              data-testid="button-toggle-topics"
            >
              <BookOpen className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(false)}
              data-testid="button-close-help-chatbot"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
                    <HelpCircle className="h-4 w-4 text-slate-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                    message.role === "user"
                      ? "bg-slate-600 text-white"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-600">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {showTopics && (
              <div className="space-y-2 mt-4">
                <p className="text-xs text-muted-foreground font-medium">Topik Bantuan:</p>
                {helpTopics.map((topic) => (
                  <Button
                    key={topic.id}
                    variant="outline"
                    size="sm"
                    className="w-full justify-between text-left h-auto py-2"
                    onClick={() => handleTopicClick(topic)}
                    data-testid={`button-topic-${topic.id}`}
                  >
                    <span className="text-sm">{topic.title}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            )}
            
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
                  <HelpCircle className="h-4 w-4 text-slate-600" />
                </div>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya tentang cara pakai..."
              disabled={isLoading}
              className="flex-1"
              data-testid="input-help-message"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || !input.trim()}
              className="bg-slate-600"
              data-testid="button-send-help"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
