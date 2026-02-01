import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  FileText,
  Copy,
  Check,
  Download,
  Eye,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Shield,
  Building2,
  Users,
  FileCheck,
  BookOpen,
  ClipboardList,
  Scale,
  FileWarning,
  Briefcase,
} from "lucide-react";
import type { Company, GeneratedDocument } from "@shared/schema";

const DOCUMENT_TEMPLATES = [
  {
    code: "SK-FKAP",
    title: "SK Penetapan Tim FKAP",
    titleEn: "FKAP Team Appointment Decree",
    description: "Surat Keputusan penetapan tim Fungsi Kepatuhan Anti Penyuapan",
    clause: "5.3.2",
    category: "Surat Keputusan",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    code: "KEBIJAKAN-AP",
    title: "Kebijakan Anti Penyuapan",
    titleEn: "Anti-Bribery Policy",
    description: "Kebijakan zero tolerance terhadap penyuapan",
    clause: "5.2",
    category: "Kebijakan",
    icon: Shield,
    color: "bg-green-500",
  },
  {
    code: "PAKTA-INTEGRITAS",
    title: "Pakta Integritas Personel",
    titleEn: "Personnel Integrity Pact",
    description: "Formulir komitmen kepatuhan anti penyuapan",
    clause: "7.2.2.3",
    category: "Formulir",
    icon: FileCheck,
    color: "bg-purple-500",
  },
  {
    code: "SOP-UJI-TUNTAS",
    title: "SOP Uji Tuntas Mitra Bisnis",
    titleEn: "Business Partner Due Diligence SOP",
    description: "Prosedur due diligence untuk vendor dan mitra",
    clause: "8.2",
    category: "SOP",
    icon: ClipboardList,
    color: "bg-orange-500",
  },
  {
    code: "RISK-REGISTER",
    title: "Register Risiko Penyuapan",
    titleEn: "Bribery Risk Register",
    description: "Daftar identifikasi dan penilaian risiko penyuapan",
    clause: "4.5",
    category: "Register",
    icon: FileWarning,
    color: "bg-red-500",
  },
  {
    code: "AUDIT-CHECKLIST",
    title: "Checklist Audit Internal SMAP",
    titleEn: "ABMS Internal Audit Checklist",
    description: "Formulir pemeriksaan audit internal SMAP",
    clause: "9.2",
    category: "Formulir",
    icon: BookOpen,
    color: "bg-amber-500",
  },
  {
    code: "BERITA-ACARA-RTM",
    title: "Berita Acara RTM",
    titleEn: "Management Review Meeting Minutes",
    description: "Notulen Rapat Tinjauan Manajemen SMAP",
    clause: "9.3",
    category: "Berita Acara",
    icon: Briefcase,
    color: "bg-cyan-500",
  },
];

const CATEGORIES = [
  { id: "all", label: "Semua Template" },
  { id: "Surat Keputusan", label: "Surat Keputusan" },
  { id: "Kebijakan", label: "Kebijakan" },
  { id: "SOP", label: "SOP" },
  { id: "Formulir", label: "Formulir" },
  { id: "Register", label: "Register" },
  { id: "Berita Acara", label: "Berita Acara" },
];

export default function DocumentBuilder() {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<typeof DOCUMENT_TEMPLATES[0] | null>(null);
  const [previewDocument, setPreviewDocument] = useState<GeneratedDocument | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: company } = useQuery<Company>({
    queryKey: ["/api/company"],
  });

  const { data: generatedDocuments = [], isLoading: isLoadingDocs } = useQuery<GeneratedDocument[]>({
    queryKey: ["/api/generated-documents"],
  });

  const generateMutation = useMutation({
    mutationFn: async (templateCode: string) => {
      const response = await apiRequest("POST", "/api/generate-smap-document", {
        templateCode,
        customData: {},
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/generated-documents"] });
      setPreviewDocument(data);
      toast({ title: "Dokumen berhasil dibuat!", description: data.title });
    },
    onError: () => {
      toast({ title: "Gagal membuat dokumen", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/generated-documents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/generated-documents"] });
      toast({ title: "Dokumen dihapus" });
      if (previewDocument) setPreviewDocument(null);
    },
    onError: () => {
      toast({ title: "Gagal menghapus dokumen", variant: "destructive" });
    },
  });

  const filteredTemplates = activeCategory === "all"
    ? DOCUMENT_TEMPLATES
    : DOCUMENT_TEMPLATES.filter(t => t.category === activeCategory);

  const handleCopyContent = useCallback(async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      toast({ title: "Konten disalin ke clipboard" });
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast({ title: "Gagal menyalin konten", variant: "destructive" });
    }
  }, [toast]);

  const handleDownloadTxt = useCallback((content: string, title: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Dokumen diunduh" });
  }, [toast]);

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary" className="text-xs"><Clock className="w-3 h-3 mr-1" />Draft</Badge>;
      case "approved":
        return <Badge className="bg-green-500 text-xs"><CheckCircle2 className="w-3 h-3 mr-1" />Approved</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-xs"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">Draft</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-page-title">Document Builder SMAP</h1>
              <p className="text-muted-foreground text-sm">
                Generator dokumen otomatis berdasarkan SNI ISO 37001:2016
              </p>
            </div>
          </div>
          {company && (
            <div className="flex items-center gap-2 mt-3 p-3 bg-muted/50 rounded-lg">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                Dokumen akan dibuat untuk: <strong>{company.name}</strong>
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Template Dokumen
                </CardTitle>
                <CardDescription>
                  Pilih template untuk membuat dokumen SMAP baru
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                  <TabsList className="flex-wrap h-auto gap-1 mb-4" data-testid="tabs-categories">
                    {CATEGORIES.map(cat => (
                      <TabsTrigger 
                        key={cat.id} 
                        value={cat.id}
                        className="text-xs"
                        data-testid={`tab-category-${cat.id}`}
                      >
                        {cat.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value={activeCategory} className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredTemplates.map((template) => {
                        const Icon = template.icon;
                        return (
                          <Card 
                            key={template.code}
                            className="hover-elevate cursor-pointer transition-all"
                            data-testid={`card-template-${template.code}`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${template.color} text-white shrink-0`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-sm truncate">{template.title}</h3>
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {template.description}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="text-xs">
                                      Klausul {template.clause}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      {template.category}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                className="w-full mt-3"
                                onClick={() => generateMutation.mutate(template.code)}
                                disabled={generateMutation.isPending}
                                data-testid={`button-generate-${template.code}`}
                              >
                                {generateMutation.isPending ? "Membuat..." : "Buat Dokumen"}
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Dokumen yang Dihasilkan
                </CardTitle>
                <CardDescription>
                  {generatedDocuments.length} dokumen tersimpan
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingDocs ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Memuat dokumen...
                  </div>
                ) : generatedDocuments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Belum ada dokumen yang dibuat</p>
                    <p className="text-xs mt-1">Pilih template di atas untuk membuat dokumen</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {generatedDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className={`p-3 rounded-lg border transition-all cursor-pointer hover-elevate ${
                            previewDocument?.id === doc.id ? "border-primary bg-primary/5" : ""
                          }`}
                          onClick={() => setPreviewDocument(doc)}
                          data-testid={`doc-item-${doc.id}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{doc.title}</h4>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="text-xs text-muted-foreground">
                                  {doc.documentNumber}
                                </span>
                                {getStatusBadge(doc.status)}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }) : "-"}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyContent(doc.content, doc.id);
                                }}
                                data-testid={`button-copy-${doc.id}`}
                              >
                                {copiedId === doc.id ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadTxt(doc.content, doc.title);
                                }}
                                data-testid={`button-download-${doc.id}`}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteMutation.mutate(doc.id);
                                }}
                                data-testid={`button-delete-${doc.id}`}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Preview Dokumen
                </CardTitle>
              </CardHeader>
              <CardContent>
                {previewDocument ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-sm">{previewDocument.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {previewDocument.documentNumber}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {getStatusBadge(previewDocument.status)}
                        <Badge variant="outline" className="text-xs">
                          Klausul {previewDocument.clause}
                        </Badge>
                      </div>
                    </div>
                    
                    <ScrollArea className="h-[500px] rounded-lg border bg-muted/30 p-4">
                      <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed" data-testid="text-preview-content">
                        {previewDocument.content}
                      </pre>
                    </ScrollArea>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => handleCopyContent(previewDocument.content, previewDocument.id)}
                        data-testid="button-copy-preview"
                      >
                        {copiedId === previewDocument.id ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Tersalin
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Salin
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDownloadTxt(previewDocument.content, previewDocument.title)}
                        data-testid="button-download-preview"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Eye className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Pilih dokumen untuk melihat preview</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Scale className="w-4 h-4" />
                  Referensi Klausul ISO 37001
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded bg-muted/50">
                      <span className="font-semibold">4.5</span> - Penilaian Risiko Penyuapan
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <span className="font-semibold">5.2</span> - Kebijakan Anti Penyuapan
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <span className="font-semibold">5.3.2</span> - Fungsi Kepatuhan Anti Penyuapan
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <span className="font-semibold">7.2.2.3</span> - Komitmen Personel
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <span className="font-semibold">8.2</span> - Uji Tuntas
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <span className="font-semibold">9.2</span> - Audit Internal
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <span className="font-semibold">9.3</span> - Tinjauan Manajemen
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
