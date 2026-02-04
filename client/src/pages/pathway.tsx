import { useRoute, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, FileText, FileCheck, Award, Briefcase, Settings, 
  Download, Copy, CheckCircle2, Circle, ExternalLink, Printer,
  Building2, Shield
} from "lucide-react";
import { useState, useEffect } from "react";
import { industryCompliances, domainInfo, type CompliancePathway } from "@shared/data/industry-pathways";
import { useToast } from "@/hooks/use-toast";

const domainIcons: Record<string, any> = {
  legalitas: FileText,
  perijinan: FileCheck,
  sertifikasi: Award,
  tender: Briefcase,
  operasional: Settings,
};

const domainColors: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  legalitas: { 
    bg: "bg-blue-100 dark:bg-blue-900/30", 
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    accent: "bg-blue-600"
  },
  perijinan: { 
    bg: "bg-green-100 dark:bg-green-900/30", 
    text: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
    accent: "bg-green-600"
  },
  sertifikasi: { 
    bg: "bg-purple-100 dark:bg-purple-900/30", 
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
    accent: "bg-purple-600"
  },
  tender: { 
    bg: "bg-amber-100 dark:bg-amber-900/30", 
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    accent: "bg-amber-600"
  },
  operasional: { 
    bg: "bg-orange-100 dark:bg-orange-900/30", 
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
    accent: "bg-orange-600"
  },
};

export default function PathwayPage() {
  const [, params] = useRoute("/pathway/:industryId/:domainId");
  const { toast } = useToast();
  
  const industryId = params?.industryId || "";
  const domainId = params?.domainId || "";
  
  const industryData = industryCompliances[industryId];
  const pathway = industryData?.pathways[domainId as keyof typeof industryData.pathways] as CompliancePathway | undefined;
  const domain = domainInfo[domainId as keyof typeof domainInfo];
  const colors = domainColors[domainId] || domainColors.legalitas;
  const Icon = domainIcons[domainId] || FileText;

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    const saved = localStorage.getItem(`pathway-checklist-${industryId}-${domainId}`);
    if (saved) {
      setCheckedItems(JSON.parse(saved));
    }
  }, [industryId, domainId]);

  const handleCheckChange = (item: string, checked: boolean) => {
    const updated = { ...checkedItems, [item]: checked };
    setCheckedItems(updated);
    localStorage.setItem(`pathway-checklist-${industryId}-${domainId}`, JSON.stringify(updated));
  };

  const completedCount = pathway?.checklist.filter(item => checkedItems[item]).length || 0;
  const totalCount = pathway?.checklist.length || 0;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Tersalin",
      description: "Teks telah disalin ke clipboard",
    });
  };

  const generateAIPrompt = (doc: { name: string; description: string }) => {
    const prompt = `Buatkan template dokumen "${doc.name}" untuk perusahaan di sektor ${industryData?.industryName}.

Konteks:
- Dokumen: ${doc.name}
- Deskripsi: ${doc.description}
- Domain: ${domain?.name}
- Industri: ${industryData?.industryName}

Harap sertakan:
1. Format dokumen yang standar dan profesional
2. Bagian-bagian yang harus diisi (tandai dengan [...])
3. Referensi peraturan yang relevan
4. Catatan penting untuk pengisian

Gunakan format Bahasa Indonesia yang baku dan formal.`;
    
    copyToClipboard(prompt);
    toast({
      title: "AI Prompt Tersalin",
      description: "Prompt untuk AI telah disalin. Tempelkan di ChatGPT atau dokumentender.com",
    });
  };

  if (!industryData || !pathway || !domain) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Halaman Tidak Ditemukan</h2>
            <p className="text-muted-foreground mb-4">
              Pathway yang Anda cari tidak tersedia.
            </p>
            <Link href="/welcome">
              <Button>Kembali ke Beranda</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <nav className={`border-b ${colors.bg}`}>
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/welcome">
              <Button variant="ghost" size="sm" data-testid="button-back">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Icon className={`h-5 w-5 ${colors.text}`} />
              <span className="font-bold">{pathway.name}</span>
            </div>
          </div>
          <Badge variant="secondary" className={`${colors.bg} ${colors.text}`}>
            {industryData.industryName}
          </Badge>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className={`h-16 w-16 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center`}>
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <Badge variant="secondary" className={`${colors.bg} ${colors.text} mb-2`}>
                  {domain.name}
                </Badge>
                <h1 className="text-3xl font-bold" data-testid="text-pathway-title">{pathway.name}</h1>
                <p className="text-muted-foreground">{pathway.description}</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Dokumen yang Diperlukan
                  </CardTitle>
                  <CardDescription>
                    {pathway.documents.length} dokumen untuk domain {domain.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pathway.documents.map((doc) => (
                      <div 
                        key={doc.id}
                        className="p-4 border rounded-lg hover-elevate"
                        data-testid={`card-document-${doc.id}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{doc.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {doc.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{doc.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => generateAIPrompt(doc)}
                              title="Generate AI Prompt"
                              data-testid={`button-ai-prompt-${doc.id}`}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => window.open("https://chat.dokumentender.com", "_blank")}
                              title="Buka Knowledge Base"
                              data-testid={`button-knowledge-${doc.id}`}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Langkah Implementasi
                  </CardTitle>
                  <CardDescription>
                    Panduan langkah demi langkah untuk menyelesaikan {domain.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className={`h-10 w-10 rounded-full ${colors.accent} text-white flex items-center justify-center font-bold`}>
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">Persiapan Dokumen</h4>
                        <p className="text-sm text-muted-foreground">Kumpulkan semua dokumen pendukung yang diperlukan</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className={`h-10 w-10 rounded-full ${colors.accent} text-white flex items-center justify-center font-bold`}>
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">Pengisian Template</h4>
                        <p className="text-sm text-muted-foreground">Gunakan AI prompt untuk membuat draft dokumen</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className={`h-10 w-10 rounded-full ${colors.accent} text-white flex items-center justify-center font-bold`}>
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Review & Validasi</h4>
                        <p className="text-sm text-muted-foreground">Periksa kelengkapan dan keakuratan dokumen</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className={`h-10 w-10 rounded-full ${colors.accent} text-white flex items-center justify-center font-bold`}>
                        4
                      </div>
                      <div>
                        <h4 className="font-medium">Pengajuan & Arsip</h4>
                        <p className="text-sm text-muted-foreground">Ajukan ke instansi terkait dan simpan arsip</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className={`border-2 ${colors.border}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className={`h-5 w-5 ${colors.text}`} />
                    Progress Checklist
                  </CardTitle>
                  <CardDescription>
                    {completedCount} dari {totalCount} item selesai
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Progress value={progressPercent} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      {Math.round(progressPercent)}% selesai
                    </p>
                  </div>
                  <div className="space-y-3">
                    {pathway.checklist.map((item, idx) => (
                      <div 
                        key={idx}
                        className="flex items-start gap-3"
                        data-testid={`checklist-item-${idx}`}
                      >
                        <Checkbox 
                          id={`check-${idx}`}
                          checked={checkedItems[item] || false}
                          onCheckedChange={(checked) => handleCheckChange(item, checked === true)}
                        />
                        <label 
                          htmlFor={`check-${idx}`}
                          className={`text-sm cursor-pointer ${checkedItems[item] ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {item}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Aksi Cepat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open("https://chat.dokumentender.com", "_blank")}
                    data-testid="button-open-chatbot"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Buka Knowledge Base
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.print()}
                    data-testid="button-print"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Cetak Checklist
                  </Button>
                  <Link href="/welcome">
                    <Button variant="outline" className="w-full justify-start" data-testid="button-other-domains">
                      <Building2 className="h-4 w-4 mr-2" />
                      Lihat Domain Lain
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <h4 className="font-medium text-sm mb-2">Tips:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Klik ikon copy untuk generate AI prompt</li>
                    <li>• Progress checklist tersimpan otomatis</li>
                    <li>• Gunakan Knowledge Base untuk panduan</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
