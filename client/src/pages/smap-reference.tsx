import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  FileText, 
  ClipboardList, 
  BookOpen, 
  FileCheck,
  Download,
  Copy,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentReference {
  id: string;
  kodeDoc: string;
  namaDoc: string;
  kategori: "Pedoman" | "SOP" | "Formulir" | "Instruksi" | "Kebijakan" | "Register";
  pasal: string;
  deskripsi: string;
  penanggungJawab: string;
}

const documentReferences: DocumentReference[] = [
  // Pedoman
  { id: "1", kodeDoc: "M-SMAP-XYZ-01", namaDoc: "Pedoman SMAP", kategori: "Pedoman", pasal: "4-10", deskripsi: "Pedoman utama Sistem Manajemen Anti Penyuapan sesuai SNI ISO 37001:2016", penanggungJawab: "Ketua FKAP" },
  
  // Kebijakan
  { id: "2", kodeDoc: "POL-SMAP-01", namaDoc: "Kebijakan Anti Penyuapan", kategori: "Kebijakan", pasal: "5.2", deskripsi: "Pernyataan komitmen organisasi terhadap pencegahan penyuapan", penanggungJawab: "Direktur" },
  { id: "3", kodeDoc: "POL-SMAP-02", namaDoc: "Kebijakan Hadiah & Keramahtamahan", kategori: "Kebijakan", pasal: "8.7", deskripsi: "Pengaturan pemberian dan penerimaan hadiah, jamuan, dan keuntungan serupa", penanggungJawab: "Direktur" },
  { id: "4", kodeDoc: "POL-SMAP-03", namaDoc: "Kebijakan Donasi & Sponsorship", kategori: "Kebijakan", pasal: "8.7", deskripsi: "Pengaturan pemberian donasi dan sponsorship", penanggungJawab: "Direktur" },
  { id: "5", kodeDoc: "POL-SMAP-04", namaDoc: "Kebijakan Konflik Kepentingan", kategori: "Kebijakan", pasal: "7.2.2", deskripsi: "Pengaturan penanganan konflik kepentingan personil", penanggungJawab: "Direktur" },
  
  // SOP
  { id: "6", kodeDoc: "SOP-FKAP-01", namaDoc: "Penilaian Risiko Penyuapan", kategori: "SOP", pasal: "4.5", deskripsi: "Prosedur identifikasi, analisis, dan evaluasi risiko penyuapan", penanggungJawab: "Ketua FKAP" },
  { id: "7", kodeDoc: "SOP-FKAP-02", namaDoc: "Uji Kelayakan Personil", kategori: "SOP", pasal: "7.2.2.2", deskripsi: "Prosedur due diligence terhadap calon dan personil yang ada", penanggungJawab: "HR Manager" },
  { id: "8", kodeDoc: "SOP-FKAP-03", namaDoc: "Uji Kelayakan Rekan Bisnis", kategori: "SOP", pasal: "8.2", deskripsi: "Prosedur due diligence terhadap vendor, supplier, subkontraktor", penanggungJawab: "Ketua FKAP" },
  { id: "9", kodeDoc: "SOP-FKAP-04", namaDoc: "Pengendalian Keuangan", kategori: "SOP", pasal: "8.3", deskripsi: "Prosedur pengendalian keuangan untuk mencegah penyuapan", penanggungJawab: "Finance Manager" },
  { id: "10", kodeDoc: "SOP-FKAP-05", namaDoc: "Pengendalian Non-Keuangan", kategori: "SOP", pasal: "8.4", deskripsi: "Prosedur pengendalian non-finansial (pengadaan, operasional)", penanggungJawab: "Ketua FKAP" },
  { id: "11", kodeDoc: "SOP-FKAP-06", namaDoc: "Penerapan Pengendalian AP oleh Rekan Bisnis", kategori: "SOP", pasal: "8.5", deskripsi: "Prosedur penerapan pengendalian anti penyuapan oleh rekan bisnis", penanggungJawab: "Ketua FKAP" },
  { id: "12", kodeDoc: "SOP-FKAP-07", namaDoc: "Komitmen Anti Penyuapan", kategori: "SOP", pasal: "8.6", deskripsi: "Prosedur penandatanganan pakta integritas dan komitmen AP", penanggungJawab: "Ketua FKAP" },
  { id: "13", kodeDoc: "SOP-FKAP-08", namaDoc: "Pengendalian Hadiah & Keramahtamahan", kategori: "SOP", pasal: "8.7", deskripsi: "Prosedur pelaporan dan pengendalian hadiah/gratifikasi", penanggungJawab: "Ketua FKAP" },
  { id: "14", kodeDoc: "SOP-FKAP-09", namaDoc: "Mengelola Ketidakcukupan Pengendalian AP", kategori: "SOP", pasal: "8.8", deskripsi: "Prosedur penanganan ketika pengendalian AP tidak memadai", penanggungJawab: "Ketua FKAP" },
  { id: "15", kodeDoc: "SOP-FKAP-10", namaDoc: "Whistleblowing System (WBS)", kategori: "SOP", pasal: "8.9", deskripsi: "Prosedur pelaporan pelanggaran dan perlindungan pelapor", penanggungJawab: "Ketua FKAP" },
  { id: "16", kodeDoc: "SOP-FKAP-11", namaDoc: "Investigasi & Penanganan Penyuapan", kategori: "SOP", pasal: "8.10", deskripsi: "Prosedur investigasi dan tindak lanjut dugaan penyuapan", penanggungJawab: "Ketua FKAP" },
  { id: "17", kodeDoc: "SOP-FKAP-12", namaDoc: "Audit Internal SMAP", kategori: "SOP", pasal: "9.2", deskripsi: "Prosedur pelaksanaan audit internal SMAP", penanggungJawab: "Koordinator Audit" },
  { id: "18", kodeDoc: "SOP-FKAP-13", namaDoc: "Tinjauan Manajemen Puncak", kategori: "SOP", pasal: "9.3", deskripsi: "Prosedur pelaksanaan tinjauan manajemen terhadap SMAP", penanggungJawab: "Ketua FKAP" },
  { id: "19", kodeDoc: "SOP-FKAP-14", namaDoc: "Tinjauan Dewan Pengarah", kategori: "SOP", pasal: "9.3.2", deskripsi: "Prosedur tinjauan Dewan Komisaris terhadap SMAP", penanggungJawab: "Ketua FKAP" },
  { id: "20", kodeDoc: "SOP-FKAP-15", namaDoc: "Penanganan Ketidaksesuaian & Tindakan Korektif", kategori: "SOP", pasal: "10.1; 10.2", deskripsi: "Prosedur penanganan ketidaksesuaian dan perbaikan SMAP", penanggungJawab: "Ketua FKAP" },
  { id: "21", kodeDoc: "SOP-FKAP-16", namaDoc: "Pengendalian Informasi Terdokumentasi", kategori: "SOP", pasal: "7.5", deskripsi: "Prosedur pembuatan, distribusi, dan pengendalian dokumen", penanggungJawab: "Document Controller" },
  
  // Formulir
  { id: "22", kodeDoc: "FRM-FKAP-01-01", namaDoc: "Form Penilaian Risiko Penyuapan", kategori: "Formulir", pasal: "4.5", deskripsi: "Formulir identifikasi dan penilaian risiko penyuapan", penanggungJawab: "Ketua FKAP" },
  { id: "23", kodeDoc: "FRM-FKAP-02-01", namaDoc: "Form Uji Kelayakan Personil", kategori: "Formulir", pasal: "7.2.2.2", deskripsi: "Checklist due diligence calon karyawan", penanggungJawab: "HR Manager" },
  { id: "24", kodeDoc: "FRM-FKAP-03-01", namaDoc: "Form Uji Kelayakan Rekan Bisnis", kategori: "Formulir", pasal: "8.2", deskripsi: "Checklist due diligence vendor/supplier", penanggungJawab: "Procurement" },
  { id: "25", kodeDoc: "FRM-FKAP-07-01", namaDoc: "Pakta Integritas Personil", kategori: "Formulir", pasal: "8.6", deskripsi: "Formulir pernyataan komitmen anti penyuapan personil", penanggungJawab: "HR Manager" },
  { id: "26", kodeDoc: "FRM-FKAP-07-02", namaDoc: "Pakta Integritas Rekan Bisnis", kategori: "Formulir", pasal: "8.6", deskripsi: "Formulir pernyataan komitmen anti penyuapan rekan bisnis", penanggungJawab: "Procurement" },
  { id: "27", kodeDoc: "FRM-FKAP-08-01", namaDoc: "Form Pelaporan Hadiah/Gratifikasi", kategori: "Formulir", pasal: "8.7", deskripsi: "Formulir pelaporan penerimaan hadiah/gratifikasi", penanggungJawab: "Ketua FKAP" },
  { id: "28", kodeDoc: "FRM-FKAP-10-01", namaDoc: "Form Pelaporan Pelanggaran (WBS)", kategori: "Formulir", pasal: "8.9", deskripsi: "Formulir pelaporan dugaan penyuapan melalui WBS", penanggungJawab: "Ketua FKAP" },
  { id: "29", kodeDoc: "FRM-FKAP-11-01", namaDoc: "Form Investigasi Penyuapan", kategori: "Formulir", pasal: "8.10", deskripsi: "Formulir dokumentasi hasil investigasi", penanggungJawab: "Ketua FKAP" },
  { id: "30", kodeDoc: "FRM-FKAP-12-01", namaDoc: "Program Audit Internal SMAP", kategori: "Formulir", pasal: "9.2", deskripsi: "Program/jadwal audit internal tahunan", penanggungJawab: "Koordinator Audit" },
  { id: "31", kodeDoc: "FRM-FKAP-12-02", namaDoc: "Jadwal Audit Internal SMAP", kategori: "Formulir", pasal: "9.2", deskripsi: "Jadwal pelaksanaan audit internal per periode", penanggungJawab: "Koordinator Audit" },
  { id: "32", kodeDoc: "FRM-FKAP-12-03", namaDoc: "Checklist Audit Internal SMAP", kategori: "Formulir", pasal: "9.2", deskripsi: "Daftar periksa audit berdasarkan klausul ISO 37001", penanggungJawab: "Auditor Internal" },
  { id: "33", kodeDoc: "FRM-FKAP-12-04", namaDoc: "Laporan Hasil Audit Internal", kategori: "Formulir", pasal: "9.2", deskripsi: "Laporan temuan dan rekomendasi audit internal", penanggungJawab: "Auditor Internal" },
  { id: "34", kodeDoc: "FRM-FKAP-13-01", namaDoc: "Notulen Tinjauan Manajemen Puncak", kategori: "Formulir", pasal: "9.3", deskripsi: "Catatan hasil rapat tinjauan manajemen", penanggungJawab: "Ketua FKAP" },
  { id: "35", kodeDoc: "FRM-FKAP-14-01", namaDoc: "Notulen Tinjauan Dewan Pengarah", kategori: "Formulir", pasal: "9.3.2", deskripsi: "Catatan hasil tinjauan Dewan Komisaris", penanggungJawab: "Ketua FKAP" },
  { id: "36", kodeDoc: "FRM-FKAP-15-01", namaDoc: "Form FPKTP (Tindakan Korektif)", kategori: "Formulir", pasal: "10.1", deskripsi: "Formulir penanganan ketidaksesuaian & tindakan perbaikan", penanggungJawab: "Ketua FKAP" },
  { id: "37", kodeDoc: "FRM-FKAP-15-02", namaDoc: "Logbook FPKTP", kategori: "Formulir", pasal: "10.1", deskripsi: "Log pemantauan status tindakan korektif", penanggungJawab: "Ketua FKAP" },
  { id: "38", kodeDoc: "FRM-FKAP-16-01", namaDoc: "Daftar Informasi Terdokumentasi", kategori: "Formulir", pasal: "7.5", deskripsi: "Daftar induk dokumen SMAP", penanggungJawab: "Document Controller" },
  
  // Register
  { id: "39", kodeDoc: "REG-SMAP-01", namaDoc: "Register Risiko Penyuapan", kategori: "Register", pasal: "4.5", deskripsi: "Daftar risiko penyuapan beserta mitigasinya", penanggungJawab: "Ketua FKAP" },
  { id: "40", kodeDoc: "REG-SMAP-02", namaDoc: "Register Hadiah & Gratifikasi", kategori: "Register", pasal: "8.7", deskripsi: "Daftar pencatatan hadiah/gratifikasi yang diterima", penanggungJawab: "Ketua FKAP" },
  { id: "41", kodeDoc: "REG-SMAP-03", namaDoc: "Register Pelaporan WBS", kategori: "Register", pasal: "8.9", deskripsi: "Daftar pelaporan pelanggaran melalui WBS", penanggungJawab: "Ketua FKAP" },
  { id: "42", kodeDoc: "REG-SMAP-04", namaDoc: "Register Rekan Bisnis", kategori: "Register", pasal: "8.2", deskripsi: "Daftar rekan bisnis beserta status due diligence", penanggungJawab: "Procurement" },
  { id: "43", kodeDoc: "REG-SMAP-05", namaDoc: "Register Pelatihan SMAP", kategori: "Register", pasal: "7.3", deskripsi: "Daftar pelatihan/sosialisasi SMAP yang telah dilaksanakan", penanggungJawab: "HR Manager" },
  
  // Instruksi Kerja
  { id: "44", kodeDoc: "IK-FKAP-01", namaDoc: "Instruksi Pengisian Form Risiko", kategori: "Instruksi", pasal: "4.5", deskripsi: "Panduan cara mengisi form penilaian risiko penyuapan", penanggungJawab: "Ketua FKAP" },
  { id: "45", kodeDoc: "IK-FKAP-02", namaDoc: "Instruksi Verifikasi Rekan Bisnis", kategori: "Instruksi", pasal: "8.2", deskripsi: "Panduan langkah-langkah verifikasi rekan bisnis", penanggungJawab: "Procurement" },
  { id: "46", kodeDoc: "IK-FKAP-03", namaDoc: "Instruksi Pelaporan WBS", kategori: "Instruksi", pasal: "8.9", deskripsi: "Panduan cara melaporkan dugaan penyuapan", penanggungJawab: "Ketua FKAP" },
];

const kategoriConfig = {
  "Pedoman": { icon: BookOpen, color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" },
  "Kebijakan": { icon: FileText, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
  "SOP": { icon: ClipboardList, color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
  "Formulir": { icon: FileCheck, color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300" },
  "Register": { icon: FileText, color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
  "Instruksi": { icon: BookOpen, color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300" },
};

export default function SMAPReferencePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKategori, setSelectedKategori] = useState<string>("all");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredDocs = documentReferences.filter(doc => {
    const matchesSearch = 
      doc.namaDoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.kodeDoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.pasal.includes(searchTerm);
    
    const matchesKategori = selectedKategori === "all" || doc.kategori === selectedKategori;
    
    return matchesSearch && matchesKategori;
  });

  const kategoris = ["all", "Pedoman", "Kebijakan", "SOP", "Formulir", "Register", "Instruksi"];

  const copyDocInfo = (doc: DocumentReference) => {
    const text = `${doc.kodeDoc} - ${doc.namaDoc}\nPasal: ${doc.pasal}\nDeskripsi: ${doc.deskripsi}\nPenanggung Jawab: ${doc.penanggungJawab}`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Disalin!",
      description: "Informasi dokumen berhasil disalin ke clipboard",
    });
  };

  const downloadCSV = () => {
    const headers = ["Kode Dokumen", "Nama Dokumen", "Kategori", "Pasal ISO 37001", "Deskripsi", "Penanggung Jawab"];
    const rows = filteredDocs.map(doc => [
      doc.kodeDoc,
      doc.namaDoc,
      doc.kategori,
      doc.pasal,
      doc.deskripsi,
      doc.penanggungJawab
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "referensi_dokumen_smap.csv";
    link.click();
    
    toast({
      title: "Berhasil!",
      description: "File CSV berhasil diunduh",
    });
  };

  const stats = {
    total: documentReferences.length,
    pedoman: documentReferences.filter(d => d.kategori === "Pedoman").length,
    kebijakan: documentReferences.filter(d => d.kategori === "Kebijakan").length,
    sop: documentReferences.filter(d => d.kategori === "SOP").length,
    formulir: documentReferences.filter(d => d.kategori === "Formulir").length,
    register: documentReferences.filter(d => d.kategori === "Register").length,
    instruksi: documentReferences.filter(d => d.kategori === "Instruksi").length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Referensi Dokumen SMAP</h1>
        <p className="text-muted-foreground">
          Daftar lengkap dokumen Sistem Manajemen Anti Penyuapan berdasarkan SNI ISO 37001:2016
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <Card className="hover-elevate cursor-pointer" onClick={() => setSelectedKategori("all")}>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-primary">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Dokumen</p>
          </CardContent>
        </Card>
        <Card className="hover-elevate cursor-pointer" onClick={() => setSelectedKategori("Pedoman")}>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.pedoman}</p>
            <p className="text-xs text-muted-foreground">Pedoman</p>
          </CardContent>
        </Card>
        <Card className="hover-elevate cursor-pointer" onClick={() => setSelectedKategori("Kebijakan")}>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.kebijakan}</p>
            <p className="text-xs text-muted-foreground">Kebijakan</p>
          </CardContent>
        </Card>
        <Card className="hover-elevate cursor-pointer" onClick={() => setSelectedKategori("SOP")}>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.sop}</p>
            <p className="text-xs text-muted-foreground">SOP</p>
          </CardContent>
        </Card>
        <Card className="hover-elevate cursor-pointer" onClick={() => setSelectedKategori("Formulir")}>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-amber-600">{stats.formulir}</p>
            <p className="text-xs text-muted-foreground">Formulir</p>
          </CardContent>
        </Card>
        <Card className="hover-elevate cursor-pointer" onClick={() => setSelectedKategori("Register")}>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.register}</p>
            <p className="text-xs text-muted-foreground">Register</p>
          </CardContent>
        </Card>
        <Card className="hover-elevate cursor-pointer" onClick={() => setSelectedKategori("Instruksi")}>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-cyan-600">{stats.instruksi}</p>
            <p className="text-xs text-muted-foreground">Instruksi</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari dokumen, kode, pasal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Tabs value={selectedKategori} onValueChange={setSelectedKategori} className="w-full md:w-auto">
              <TabsList className="flex flex-wrap h-auto gap-1">
                {kategoris.map(kat => (
                  <TabsTrigger 
                    key={kat} 
                    value={kat}
                    className="text-xs px-2 py-1"
                    data-testid={`tab-${kat}`}
                  >
                    {kat === "all" ? "Semua" : kat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Button variant="outline" onClick={downloadCSV} data-testid="button-download-csv">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Document Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg">Daftar Dokumen SMAP</CardTitle>
              <CardDescription>
                Menampilkan {filteredDocs.length} dari {documentReferences.length} dokumen
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  <TableHead className="min-w-[140px]">Kode Dokumen</TableHead>
                  <TableHead className="min-w-[250px]">Nama Dokumen</TableHead>
                  <TableHead className="min-w-[100px]">Kategori</TableHead>
                  <TableHead className="min-w-[80px]">Pasal</TableHead>
                  <TableHead className="min-w-[150px]">Penanggung Jawab</TableHead>
                  <TableHead className="w-20">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocs.map((doc, index) => (
                  <>
                    <TableRow 
                      key={doc.id} 
                      className="hover-elevate cursor-pointer"
                      onClick={() => setExpandedRow(expandedRow === doc.id ? null : doc.id)}
                      data-testid={`row-doc-${doc.id}`}
                    >
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                          {doc.kodeDoc}
                        </code>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {doc.namaDoc}
                          {expandedRow === doc.id ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={kategoriConfig[doc.kategori].color}>
                          {doc.kategori}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.pasal}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {doc.penanggungJawab}
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={(e) => {
                            e.stopPropagation();
                            copyDocInfo(doc);
                          }}
                          data-testid={`button-copy-${doc.id}`}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedRow === doc.id && (
                      <TableRow key={`${doc.id}-detail`}>
                        <TableCell colSpan={7} className="bg-muted/50">
                          <div className="p-3">
                            <p className="text-sm text-muted-foreground">
                              <strong>Deskripsi:</strong> {doc.deskripsi}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredDocs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Tidak ada dokumen yang ditemukan</p>
              <p className="text-sm">Coba ubah kata kunci pencarian atau filter kategori</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Keterangan Kategori Dokumen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Badge className={kategoriConfig["Pedoman"].color}>Pedoman</Badge>
              <p className="text-sm text-muted-foreground">Dokumen utama yang menjelaskan keseluruhan sistem manajemen</p>
            </div>
            <div className="flex items-start gap-3">
              <Badge className={kategoriConfig["Kebijakan"].color}>Kebijakan</Badge>
              <p className="text-sm text-muted-foreground">Pernyataan komitmen dan arahan dari manajemen puncak</p>
            </div>
            <div className="flex items-start gap-3">
              <Badge className={kategoriConfig["SOP"].color}>SOP</Badge>
              <p className="text-sm text-muted-foreground">Prosedur operasional standar yang menjelaskan langkah kerja</p>
            </div>
            <div className="flex items-start gap-3">
              <Badge className={kategoriConfig["Formulir"].color}>Formulir</Badge>
              <p className="text-sm text-muted-foreground">Template untuk pencatatan dan dokumentasi aktivitas</p>
            </div>
            <div className="flex items-start gap-3">
              <Badge className={kategoriConfig["Register"].color}>Register</Badge>
              <p className="text-sm text-muted-foreground">Daftar/log untuk pemantauan dan penelusuran data</p>
            </div>
            <div className="flex items-start gap-3">
              <Badge className={kategoriConfig["Instruksi"].color}>Instruksi</Badge>
              <p className="text-sm text-muted-foreground">Panduan teknis untuk pelaksanaan tugas spesifik</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
