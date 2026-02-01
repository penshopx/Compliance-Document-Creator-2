import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { FileText, Plus, Eye, Download, Trash2, FileCheck, Scale, BookOpen, ClipboardList, AlertTriangle } from "lucide-react";
import type { Document } from "@shared/schema";

const documentTemplates = [
  {
    type: "kebijakan-anti-penyuapan",
    title: "Kebijakan Anti Penyuapan",
    clause: "Klausul 5.2",
    description: "Kebijakan komitmen organisasi terhadap pencegahan dan pendeteksian penyuapan",
    icon: Scale,
  },
  {
    type: "sasaran-anti-penyuapan",
    title: "Sasaran Anti Penyuapan",
    clause: "Klausul 6.2",
    description: "Penetapan sasaran dan target anti penyuapan yang terukur",
    icon: ClipboardList,
  },
  {
    type: "register-risiko",
    title: "Register Risiko Penyuapan",
    clause: "Klausul 6.1",
    description: "Identifikasi dan penilaian risiko penyuapan organisasi",
    icon: AlertTriangle,
  },
  {
    type: "prosedur-uji-tuntas",
    title: "Prosedur Uji Tuntas",
    clause: "Klausul 8.2",
    description: "Prosedur due diligence untuk mitra bisnis dan vendor",
    icon: FileCheck,
  },
  {
    type: "program-pelatihan",
    title: "Program Pelatihan SMAP",
    clause: "Klausul 7.2",
    description: "Program kesadaran dan pelatihan anti penyuapan",
    icon: BookOpen,
  },
  {
    type: "prosedur-pelaporan",
    title: "Prosedur Pelaporan Whistleblowing",
    clause: "Klausul 8.9",
    description: "Mekanisme pelaporan dugaan pelanggaran anti penyuapan",
    icon: FileText,
  },
];

export default function DocumentsPage() {
  const { toast } = useToast();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [generatingType, setGeneratingType] = useState<string | null>(null);

  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const generateMutation = useMutation({
    mutationFn: (type: string) => {
      const template = documentTemplates.find((t) => t.type === type);
      return apiRequest("POST", "/api/documents/generate", {
        type,
        title: template?.title ?? type,
        clause: template?.clause ?? "",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      setGeneratingType(null);
      toast({ title: "Berhasil", description: "Dokumen berhasil dibuat" });
    },
    onError: () => {
      setGeneratingType(null);
      toast({ title: "Gagal", description: "Terjadi kesalahan saat membuat dokumen", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/documents/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({ title: "Berhasil", description: "Dokumen berhasil dihapus" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Terjadi kesalahan", variant: "destructive" });
    },
  });

  const handleGenerate = (type: string) => {
    setGeneratingType(type);
    generateMutation.mutate(type);
  };

  const handlePreview = (doc: Document) => {
    setSelectedDocument(doc);
    setPreviewOpen(true);
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "final":
        return <Badge className="bg-green-600">Final</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "review":
        return <Badge variant="default">Review</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">Generator Dokumen</h1>
        <p className="text-muted-foreground mt-1">
          Buat dokumen SMAP sesuai SNI ISO 37001:2016
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {documentTemplates.map((template) => {
          const existingDoc = documents?.find((d) => d.type === template.type);
          const isGenerating = generatingType === template.type;
          
          return (
            <Card key={template.type} className="flex flex-col" data-testid={`card-template-${template.type}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-primary/10 text-primary flex-shrink-0">
                    <template.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base leading-tight">{template.title}</CardTitle>
                    <CardDescription className="text-xs mt-1">{template.clause}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground flex-1">{template.description}</p>
                <div className="mt-4">
                  {existingDoc ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePreview(existingDoc)}
                        data-testid={`button-preview-${template.type}`}
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        Lihat
                      </Button>
                      <Badge variant="secondary" className="text-xs">
                        v{existingDoc.version}
                      </Badge>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleGenerate(template.type)}
                      disabled={isGenerating}
                      data-testid={`button-generate-${template.type}`}
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      {isGenerating ? "Membuat..." : "Buat Dokumen"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Dokumen yang Dibuat
          </CardTitle>
          <CardDescription>
            Total: {documents?.length ?? 0} dokumen
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : documents && documents.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul Dokumen</TableHead>
                    <TableHead>Klausul</TableHead>
                    <TableHead>Versi</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id} data-testid={`row-document-${doc.id}`}>
                      <TableCell className="font-medium">{doc.title}</TableCell>
                      <TableCell>{doc.clause ?? "-"}</TableCell>
                      <TableCell>{doc.version}</TableCell>
                      <TableCell>{formatDate(doc.generatedAt)}</TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handlePreview(doc)}
                            data-testid={`button-view-document-${doc.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteMutation.mutate(doc.id)}
                            data-testid={`button-delete-document-${doc.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Belum ada dokumen</h3>
              <p className="text-muted-foreground mt-1">Pilih template di atas untuk membuat dokumen SMAP</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.title}</DialogTitle>
            <DialogDescription>
              {selectedDocument?.clause} - Versi {selectedDocument?.version}
            </DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {selectedDocument?.content ? (
              <div
                className="whitespace-pre-wrap text-sm leading-relaxed"
                data-testid="document-content"
              >
                {selectedDocument.content}
              </div>
            ) : (
              <p className="text-muted-foreground">Konten dokumen tidak tersedia</p>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Tutup
            </Button>
            <Button data-testid="button-download-document">
              <Download className="mr-2 h-4 w-4" />
              Unduh
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
