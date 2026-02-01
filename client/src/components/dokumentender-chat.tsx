import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, X, ExternalLink, MessageSquare } from "lucide-react";

export default function DokumentenderChat() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <div 
        className="fixed shadow-lg"
        style={{ zIndex: 9999, bottom: '16px', right: '16px' }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-green-600 h-14 w-14"
          data-testid="button-open-dokumentender-chat"
        >
          <FileText className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[500px] shadow-xl flex flex-col" style={{ zIndex: 9999 }} data-testid="card-dokumentender-chat">
      <CardHeader className="pb-2 border-b bg-green-600 text-white rounded-t-lg">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle className="text-base" data-testid="text-dokumentender-title">Dokumentender AI</CardTitle>
            <Badge variant="secondary" className="text-xs" data-testid="badge-chat">Chat</Badge>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsOpen(false)}
            data-testid="button-close-dokumentender-chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2" data-testid="text-dokumentender-heading">Dokumentender AI Chat</h3>
          <p className="text-sm text-muted-foreground mb-4" data-testid="text-dokumentender-description">
            Platform AI untuk pembuatan dokumen tender dan pengetahuan tentang:
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Badge variant="outline" data-testid="badge-smap">SMAP</Badge>
            <Badge variant="outline" data-testid="badge-pancek">Pancek</Badge>
            <Badge variant="outline" data-testid="badge-konstruksi">Konstruksi</Badge>
            <Badge variant="outline" data-testid="badge-keteknikan">Keteknikan</Badge>
            <Badge variant="outline" data-testid="badge-pengadaan">Pengadaan</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-4" data-testid="text-open-instruction">
            Klik tombol di bawah untuk membuka chat di tab baru
          </p>
          <a 
            href="https://chat.dokumentender.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full"
            data-testid="link-dokumentender"
          >
            <Button className="w-full bg-green-600" data-testid="button-open-dokumentender">
              <ExternalLink className="h-4 w-4 mr-2" />
              Buka Dokumentender Chat
            </Button>
          </a>
        </div>

        <div className="p-4 border-t bg-muted/50">
          <h4 className="text-xs font-medium mb-2" data-testid="text-features-heading">Fitur Dokumentender:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li className="flex items-center gap-2" data-testid="feature-1">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Pembuatan dokumen tender otomatis
            </li>
            <li className="flex items-center gap-2" data-testid="feature-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Konsultasi SMAP & Pancek
            </li>
            <li className="flex items-center gap-2" data-testid="feature-3">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Template dokumen konstruksi
            </li>
            <li className="flex items-center gap-2" data-testid="feature-4">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Pengetahuan pengadaan barang/jasa
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
