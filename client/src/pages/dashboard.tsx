import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Shield,
  Award,
  Wrench,
  FolderKanban,
  Handshake,
  Building2,
  ArrowRight,
  CheckCircle2,
  XCircle,
  BookOpen,
  FileCheck,
  Scale,
  ClipboardList,
  FileText,
  FilePlus2,
  Zap,
  Sparkles,
  Library,
} from "lucide-react";
import { useIndustry } from "@/hooks/use-industry";
import { COMPLIANCE_DOMAINS } from "@shared/config/industry-types";
import type { Company, Employee, Fkap, Qualification, Equipment, Project, Vendor } from "@shared/schema";

interface DashboardStats {
  company: Company | null;
  employees: number;
  fkap: number;
  qualifications: number;
  equipment: number;
  projects: number;
  vendors: number;
  generatedDocuments: number;
  management: number;
  audit: number;
}

const statsCards = [
  { key: "employees", label: "Karyawan", icon: Users, url: "/employees", color: "text-blue-600" },
  { key: "fkap", label: "Tim FKAP", icon: Shield, url: "/fkap", color: "text-green-600" },
  { key: "qualifications", label: "Klasifikasi SBU", icon: Award, url: "/qualifications", color: "text-purple-600" },
  { key: "equipment", label: "Peralatan", icon: Wrench, url: "/equipment", color: "text-orange-600" },
  { key: "projects", label: "Proyek", icon: FolderKanban, url: "/projects", color: "text-cyan-600" },
  { key: "vendors", label: "Vendor & Mitra", icon: Handshake, url: "/vendors", color: "text-pink-600" },
] as const;

const smapClauses = [
  {
    clause: "Klausul 5",
    title: "Kepemimpinan",
    description: "Kebijakan Anti Penyuapan, Komitmen Manajemen Puncak",
    icon: Scale,
  },
  {
    clause: "Klausul 6",
    title: "Perencanaan",
    description: "Register Risiko, Sasaran Anti Penyuapan",
    icon: ClipboardList,
  },
  {
    clause: "Klausul 7",
    title: "Dukungan",
    description: "Program Pelatihan, Kompetensi Personel",
    icon: BookOpen,
  },
  {
    clause: "Klausul 8",
    title: "Operasi",
    description: "Prosedur Uji Tuntas, Pengendalian Keuangan",
    icon: FileCheck,
  },
];

export default function Dashboard() {
  const { currentIndustry, getAllTemplates } = useIndustry();
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const industryTemplates = getAllTemplates();

  const completionItems = [
    { label: "Profil Perusahaan", completed: !!stats?.company, url: "/company" },
    { label: "Tim FKAP", completed: (stats?.fkap ?? 0) > 0, url: "/fkap" },
    { label: "Data Karyawan", completed: (stats?.employees ?? 0) > 0, url: "/employees" },
    { label: "Klasifikasi SBU", completed: (stats?.qualifications ?? 0) > 0, url: "/qualifications" },
    { label: "Peralatan", completed: (stats?.equipment ?? 0) > 0, url: "/equipment" },
    { label: "Vendor/Mitra", completed: (stats?.vendors ?? 0) > 0, url: "/vendors" },
  ];

  const completedCount = completionItems.filter((item) => item.completed).length;
  const progressPercentage = Math.round((completedCount / completionItems.length) * 100);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">
          Dashboard {currentIndustry?.shortName || ""}
        </h1>
        <p className="text-muted-foreground mt-1">
          Selamat datang di Compliance Hub - {currentIndustry?.name || "Platform Kepatuhan Indonesia"}
        </p>
      </div>

      {!stats?.company && !isLoading && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Mulai dengan Data Perusahaan
            </CardTitle>
            <CardDescription>
              Untuk menggunakan generator dokumen {currentIndustry?.shortName || "kepatuhan"}, silakan masukkan data profil perusahaan Anda terlebih dahulu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild data-testid="button-fill-company">
              <Link href="/company">
                Isi Data Perusahaan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 5 Compliance Domains Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Library className="h-5 w-5" />
            5 Domain Kepatuhan
          </CardTitle>
          <CardDescription>
            Akses cepat ke template dokumen berdasarkan 5 domain kepatuhan utama
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {COMPLIANCE_DOMAINS.map((domain) => {
              const colorClasses: Record<string, { bg: string; icon: string }> = {
                blue: { bg: "bg-blue-100 dark:bg-blue-900/30", icon: "text-blue-600 dark:text-blue-400" },
                green: { bg: "bg-green-100 dark:bg-green-900/30", icon: "text-green-600 dark:text-green-400" },
                amber: { bg: "bg-amber-100 dark:bg-amber-900/30", icon: "text-amber-600 dark:text-amber-400" },
                purple: { bg: "bg-purple-100 dark:bg-purple-900/30", icon: "text-purple-600 dark:text-purple-400" },
                cyan: { bg: "bg-cyan-100 dark:bg-cyan-900/30", icon: "text-cyan-600 dark:text-cyan-400" },
              };
              const colors = colorClasses[domain.color] || colorClasses.blue;
              return (
                <Link key={domain.id} href="/template-repository">
                  <Card className="hover-elevate cursor-pointer h-full">
                    <CardContent className="p-4 text-center">
                      <div className={`mx-auto w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center mb-2`}>
                        <Sparkles className={`h-5 w-5 ${colors.icon}`} />
                      </div>
                      <p className="font-medium text-sm">{domain.shortName}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{domain.examples.slice(0, 2).join(", ")}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((card) => (
          <Link key={card.key} href={card.url}>
            <Card className="hover-elevate cursor-pointer transition-all" data-testid={`card-stats-${card.key}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md bg-muted ${card.color}`}>
                      <card.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{card.label}</p>
                      {isLoading ? (
                        <Skeleton className="h-8 w-12 mt-1" />
                      ) : (
                        <p className="text-2xl font-bold" data-testid={`text-count-${card.key}`}>
                          {stats?.[card.key as keyof Omit<DashboardStats, 'company'>] ?? 0}
                        </p>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-3">Klik untuk kelola data</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Kelengkapan Data</CardTitle>
            <CardDescription>Progres pengisian data onboarding perusahaan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium" data-testid="text-progress-percentage">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" data-testid="progress-completion" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {completionItems.map((item) => (
                <Link key={item.label} href={item.url}>
                  <div
                    className="flex items-center gap-2 p-3 rounded-md border hover-elevate cursor-pointer"
                    data-testid={`completion-item-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className="text-sm truncate">{item.label}</span>
                    <Badge variant={item.completed ? "default" : "secondary"} className="ml-auto text-xs">
                      {item.completed ? "Selesai" : "Belum"}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Panduan SMAP</CardTitle>
            <CardDescription>Dokumen yang perlu disiapkan sesuai SNI ISO 37001:2016</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {smapClauses.map((clause) => (
              <div
                key={clause.clause}
                className="flex items-start gap-3 p-3 rounded-md bg-muted/50"
                data-testid={`clause-${clause.clause.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="p-2 rounded-md bg-primary/10 text-primary flex-shrink-0">
                  <clause.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {clause.clause} - {clause.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{clause.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Generator Dokumen SMAP
          </CardTitle>
          <CardDescription>
            Akses cepat ke alat generator dokumen SMAP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link href="/documents">
              <Card className="hover-elevate cursor-pointer h-full" data-testid="card-quick-documents">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 rounded-lg bg-blue-500/10">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Generator Dokumen</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Template dasar SMAP
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/document-builder">
              <Card className="hover-elevate cursor-pointer h-full" data-testid="card-quick-builder">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 rounded-lg bg-green-500/10">
                      <FilePlus2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Document Builder</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stats?.generatedDocuments ?? 0} dokumen dibuat
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/pdca">
              <Card className="hover-elevate cursor-pointer h-full" data-testid="card-quick-pdca">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 rounded-lg bg-purple-500/10">
                      <Zap className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">PDCA Generator</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        51 klausul + 85 template
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
