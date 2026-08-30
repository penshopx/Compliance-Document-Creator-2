import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FolderKanban,
  Handshake,
  Info,
  Loader2,
  Shield,
  ShieldAlert,
  Users,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import type { Project, Vendor } from "@shared/schema";

type ControlStatus = "complete" | "warning" | "missing";
type AssessmentKey =
  | "riskAssessmentConfirmed"
  | "antiBriberyClauseConfirmed"
  | "conflictOfInterestDeclared"
  | "fkapReviewed"
  | "checklistReviewed";
type ReadinessData = {
  project: Project;
  company: { name: string } | null;
  selectedVendors: Vendor[];
  availableVendors: Vendor[];
  controls: Array<{
    id: string;
    title: string;
    description: string;
    status: ControlStatus;
    detail: string;
    href: string;
    action: string;
    assessmentKey?: AssessmentKey;
  }>;
  riskSignals: Array<{ title: string; level: string; detail: string }>;
  score: number;
  readinessStatus: string;
  blueprintCount: number;
  checklist: { checked: number; required: number; total: number };
  assessment: Record<AssessmentKey, boolean> & { projectId: string; updatedAt: string | null };
};

const statusCopy: Record<ControlStatus, { label: string; className: string }> = {
  complete: { label: "Terpenuhi", className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" },
  warning: { label: "Perlu perhatian", className: "bg-amber-100 text-amber-800 hover:bg-amber-100" },
  missing: { label: "Belum tersedia", className: "bg-red-100 text-red-800 hover:bg-red-100" },
};

function ControlIcon({ status }: { status: ControlStatus }) {
  if (status === "complete") return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
  if (status === "warning") return <AlertTriangle className="h-5 w-5 text-amber-600" />;
  return <ShieldAlert className="h-5 w-5 text-red-600" />;
}

export default function ProjectIntegrityPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });
  const queryProjectId = new URLSearchParams(location.split("?")[1] || "").get("project");
  const [selectedProjectId, setSelectedProjectId] = useState(queryProjectId || "");

  useEffect(() => {
    if (!selectedProjectId && projects?.[0]) setSelectedProjectId(projects[0].id);
  }, [projects, selectedProjectId]);

  useEffect(() => {
    if (queryProjectId && queryProjectId !== selectedProjectId) setSelectedProjectId(queryProjectId);
  }, [queryProjectId, selectedProjectId]);

  const { data, isLoading, isError } = useQuery<ReadinessData>({
    queryKey: [`/api/projects/${selectedProjectId}/integrity-readiness`],
    enabled: !!selectedProjectId,
  });

  const vendorMutation = useMutation({
    mutationFn: (vendorIds: string[]) =>
      apiRequest("PATCH", `/api/projects/${selectedProjectId}/integrity-vendors`, { vendorIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${selectedProjectId}/integrity-readiness`] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Pemetaan vendor disimpan", description: "Relasi vendor untuk proyek ini sudah diperbarui." });
    },
    onError: () => toast({ title: "Gagal menyimpan", description: "Pemetaan vendor belum dapat disimpan.", variant: "destructive" }),
  });

  const assessmentMutation = useMutation({
    mutationFn: ({ key, checked }: { key: AssessmentKey; checked: boolean }) =>
      apiRequest("PATCH", `/api/projects/${selectedProjectId}/integrity-assessment`, { [key]: checked }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${selectedProjectId}/integrity-readiness`] });
      toast({ title: "Kontrol proyek diperbarui", description: "Konfirmasi kesiapan sudah disimpan." });
    },
    onError: () => toast({ title: "Gagal menyimpan", description: "Konfirmasi kontrol belum dapat disimpan.", variant: "destructive" }),
  });

  const selectedVendorIds = useMemo(
    () => new Set(data?.selectedVendors.map((vendor) => vendor.id) || []),
    [data?.selectedVendors],
  );

  const handleProjectChange = (id: string) => {
    setSelectedProjectId(id);
    setLocation(`/project-integrity?project=${id}`);
  };

  const toggleVendor = (id: string, checked: boolean) => {
    const next = new Set(selectedVendorIds);
    if (checked) next.add(id);
    else next.delete(id);
    vendorMutation.mutate(Array.from(next));
  };

  const scoreTone = data?.score && data.score >= 80
    ? "text-emerald-600"
    : data?.score && data.score >= 50
      ? "text-amber-600"
      : "text-red-600";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-2xl bg-slate-950 p-6 text-white shadow-sm md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-blue-300">
              <Shield className="h-4 w-4" />
              Compliance Hub · Workflow Integritas Proyek
            </div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl" data-testid="text-page-title">
              Kesiapan Integritas Proyek
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Mengadopsi alur kerja ekosistem kontraktor seperti Gustafta, tetapi diarahkan untuk
              membuktikan pengendalian anti-penyuapan, uji tuntas pihak ketiga, konflik kepentingan,
              dan kesiapan SMAP/Pancek pada setiap proyek.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 lg:max-w-xs">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" />
              <span>Ini bukan sinkronisasi dengan Gustafta. Semua data tetap dikelola di Compliance Hub.</span>
            </div>
          </div>
        </div>
      </div>

      {projectsLoading ? (
        <Skeleton className="h-14 w-full" />
      ) : projects && projects.length > 0 ? (
        <Card>
          <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FolderKanban className="h-4 w-4 text-primary" />
              Pilih proyek
            </div>
            <Select value={selectedProjectId} onValueChange={handleProjectChange}>
              <SelectTrigger className="w-full md:max-w-lg" data-testid="select-integrity-project">
                <SelectValue placeholder="Pilih proyek untuk dinilai" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>{project.name} · {project.clientName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <FolderKanban className="h-12 w-12 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Belum ada proyek untuk dinilai</h2>
            <p className="max-w-md text-sm text-muted-foreground">Buat proyek terlebih dahulu agar kontrol integritas dapat dipetakan.</p>
            <Button asChild><Link href="/projects">Kelola proyek <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </CardContent>
        </Card>
      )}

      {isLoading && selectedProjectId && (
        <div className="grid gap-4 md:grid-cols-3"><Skeleton className="h-36" /><Skeleton className="h-36" /><Skeleton className="h-36" /></div>
      )}

      {isError && !isAuthenticated && (
        <Card className="border-blue-200">
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <Shield className="h-10 w-10 text-blue-600" />
            <h2 className="text-lg font-semibold">Masuk untuk melihat kesiapan proyek</h2>
            <p className="max-w-md text-sm text-muted-foreground">Data kontrol integritas hanya tersedia bagi pengguna yang sudah masuk.</p>
            <Button asChild><a href="/api/login">Masuk ke Compliance Hub</a></Button>
          </CardContent>
        </Card>
      )}

      {isError && isAuthenticated && (
        <Card className="border-red-200">
          <CardContent className="py-8 text-center text-sm text-red-700">Data kesiapan proyek gagal dimuat. Coba muat ulang halaman.</CardContent>
        </Card>
      )}

      {data && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardDescription>Status kesiapan proyek</CardDescription>
                <CardTitle className={`text-3xl capitalize ${scoreTone}`}>{data.readinessStatus}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span>Skor kontrol</span><strong>{data.score}%</strong>
                </div>
                <Progress value={data.score} className="mt-2 h-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Proyek dan perusahaan</CardDescription>
                <CardTitle className="truncate text-xl">{data.project.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Building2 className="h-4 w-4" />{data.company?.name || "Profil perusahaan belum diisi"}</div>
                <div className="flex items-center gap-2"><Users className="h-4 w-4" />Klien: {data.project.clientName}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Checklist dan blueprint</CardDescription>
                <CardTitle className="text-xl">{data.checklist.checked}/{data.checklist.required} item Pancek</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><ClipboardCheck className="h-4 w-4" />{data.checklist.total} item checklist tersedia</div>
                <div className="flex items-center gap-2"><FileCheck2 className="h-4 w-4" />{data.blueprintCount} blueprint tersimpan</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Kontrol kesiapan</CardTitle>
                <CardDescription>Prioritaskan item berstatus belum tersedia atau perlu perhatian.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                {data.controls.map((control) => {
                  const status = statusCopy[control.status];
                  return (
                    <div key={control.id} className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex gap-3">
                        <ControlIcon status={control.status} />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-medium">{control.title}</h3>
                            <Badge className={status.className}>{status.label}</Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{control.description}</p>
                          <p className="mt-2 text-xs text-muted-foreground">{control.detail}</p>
                          {control.assessmentKey && (
                            <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs font-medium">
                              <Checkbox
                                checked={data.assessment[control.assessmentKey]}
                                onCheckedChange={(checked) => assessmentMutation.mutate({
                                  key: control.assessmentKey!,
                                  checked: checked === true,
                                })}
                                disabled={assessmentMutation.isPending}
                                data-testid={`checkbox-control-${control.assessmentKey}`}
                              />
                              Konfirmasi kontrol ini berlaku untuk proyek
                            </label>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild className="shrink-0">
                        <Link href={control.href}>{control.action}<ArrowRight className="ml-2 h-3.5 w-3.5" /></Link>
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-amber-600" />Sinyal risiko</CardTitle>
                  <CardDescription>Ringkasan area yang perlu dikawal sebelum proyek berjalan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.riskSignals.map((signal) => (
                    <div key={signal.title}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium">{signal.title}</span>
                        <Badge variant="outline" className="capitalize">{signal.level}</Badge>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{signal.detail}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card id="vendor-mapping">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Handshake className="h-5 w-5 text-primary" />Vendor/mitra terkait</CardTitle>
                  <CardDescription>Pilih pihak ketiga yang benar-benar terlibat dalam proyek ini.</CardDescription>
                </CardHeader>
                <CardContent>
                  {data.availableVendors.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                      Belum ada vendor. <Link className="font-medium text-primary hover:underline" href="/vendors">Tambah vendor</Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.availableVendors.map((vendor) => (
                        <label key={vendor.id} className="flex cursor-pointer items-start gap-3 rounded-md p-2 hover:bg-muted/50">
                          <Checkbox
                            checked={selectedVendorIds.has(vendor.id)}
                            onCheckedChange={(checked) => toggleVendor(vendor.id, checked === true)}
                            disabled={vendorMutation.isPending}
                            data-testid={`checkbox-integrity-vendor-${vendor.id}`}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium">{vendor.name}</span>
                            <span className="block text-xs text-muted-foreground">{vendor.type} · Due diligence: {vendor.dueDiligenceStatus || "pending"}</span>
                          </span>
                        </label>
                      ))}
                      {vendorMutation.isPending && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" />Menyimpan pemetaan...</div>}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-semibold text-blue-950">Dari data kontraktor menuju bukti integritas</h2>
                <p className="mt-1 text-sm text-blue-900/70">Lengkapi profil, vendor, dokumen, dan checklist secara berurutan agar setiap keputusan proyek memiliki jejak kepatuhan.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" asChild><Link href="/vendors">Kelola vendor</Link></Button>
                <Button asChild><Link href="/pancek">Buka Pancek <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}