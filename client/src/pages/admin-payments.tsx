import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Shield, ArrowLeft, CheckCircle2, Clock, AlertCircle, DollarSign,
  Search, RefreshCw, Loader2, ExternalLink, TrendingUp, Users, FileText,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { PaymentOrder } from "@shared/schema";

interface AdminStats {
  total: number;
  pending: number;
  pendingConfirmation: number;
  paid: number;
  revenue: number;
}

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
  pending: {
    label: "Menunggu Transfer",
    variant: "outline",
    icon: <Clock className="h-3 w-3" />,
  },
  pending_confirmation: {
    label: "Butuh Verifikasi",
    variant: "default",
    icon: <AlertCircle className="h-3 w-3" />,
  },
  paid: {
    label: "Aktif",
    variant: "secondary",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(d: string | Date | null | undefined) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPaymentsPage() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: isAdmin, isLoading: checkingAdmin } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/me"],
    retry: false,
  });

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    enabled: !!isAdmin,
    refetchInterval: 30000,
  });

  const { data: orders, isLoading: ordersLoading, refetch } = useQuery<PaymentOrder[]>({
    queryKey: ["/api/admin/payment-orders"],
    enabled: !!isAdmin,
    refetchInterval: 30000,
  });

  const verifyMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/admin/payment-orders/${id}/verify`, {});
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Pembayaran diverifikasi", description: "Langganan user telah diaktifkan." });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payment-orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: (e: any) => {
      toast({ title: "Gagal verifikasi", description: e.message, variant: "destructive" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/admin/payment-orders/${id}/reject`, {});
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Order direset ke pending" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payment-orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: (e: any) => {
      toast({ title: "Gagal reset order", description: e.message, variant: "destructive" });
    },
  });

  const openWhatsApp = (order: PaymentOrder) => {
    const msg = encodeURIComponent(
      `[Admin Compliance Hub]\n\nKonfirmasi pembayaran:\nOrder: ${order.orderNumber}\nPaket: ${order.planName}\nJumlah: ${formatPrice(order.amount || 0)}\nMetode: ${order.paymentMethod}\n${order.bankName ? `Bank: ${order.bankName.toUpperCase()}` : ""}`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  if (checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-sm w-full mx-4 text-center">
          <CardContent className="pt-8 pb-6">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <CardTitle className="mb-2">Akses Ditolak</CardTitle>
            <CardDescription className="mb-6">Anda tidak memiliki akses admin.</CardDescription>
            <Button onClick={() => setLocation("/dashboard")} data-testid="button-back-dashboard">
              Kembali ke Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filtered = (orders || []).filter((o) => {
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const matchSearch =
      !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.planName.toLowerCase().includes(search.toLowerCase()) ||
      o.userId.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const pendingCount = (orders || []).filter(o => o.status === "pending_confirmation").length;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")} data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-bold">Admin — Manajemen Pembayaran</span>
          </div>
          {pendingCount > 0 && (
            <Badge variant="destructive" className="ml-auto mr-2" data-testid="badge-pending-count">
              {pendingCount} perlu verifikasi
            </Badge>
          )}
          <Button variant="outline" size="icon" onClick={() => refetch()} data-testid="button-refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card data-testid="stat-total">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Order</p>
                  <p className="text-2xl font-bold">{statsLoading ? "..." : stats?.total ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="stat-pending-verification">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Butuh Verifikasi</p>
                  <p className="text-2xl font-bold text-amber-600">{statsLoading ? "..." : stats?.pendingConfirmation ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="stat-active">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Aktif / Lunas</p>
                  <p className="text-2xl font-bold text-green-600">{statsLoading ? "..." : stats?.paid ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="stat-revenue">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                  <p className="text-lg font-bold text-blue-600">{statsLoading ? "..." : formatPrice(stats?.revenue ?? 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Daftar Order Pembayaran</CardTitle>
            <CardDescription>Kelola dan verifikasi pembayaran masuk</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari order, paket, atau user ID..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  data-testid="input-search"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { val: "all", label: "Semua" },
                  { val: "pending_confirmation", label: "Perlu Verifikasi" },
                  { val: "paid", label: "Lunas" },
                  { val: "pending", label: "Menunggu" },
                ].map(f => (
                  <Button
                    key={f.val}
                    variant={filterStatus === f.val ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus(f.val)}
                    data-testid={`filter-${f.val}`}
                  >
                    {f.label}
                    {f.val === "pending_confirmation" && pendingCount > 0 && (
                      <Badge variant="destructive" className="ml-1.5 h-4 px-1 text-xs">
                        {pendingCount}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <DollarSign className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>Belum ada order pembayaran</p>
              </div>
            ) : (
              <div className="rounded-lg border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Paket</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Metode</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((order) => {
                      const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                      const isPendingVerif = order.status === "pending_confirmation";
                      const isPaid = order.status === "paid";
                      return (
                        <TableRow
                          key={order.id}
                          className={isPendingVerif ? "bg-amber-50/50 dark:bg-amber-900/10" : ""}
                          data-testid={`row-order-${order.id}`}
                        >
                          <TableCell>
                            <div>
                              <p className="font-mono text-sm font-medium" data-testid={`text-order-number-${order.id}`}>
                                {order.orderNumber}
                              </p>
                              <p className="text-xs text-muted-foreground truncate max-w-[120px]" title={order.userId}>
                                {order.userId.slice(0, 12)}...
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm font-medium">{order.planName}</p>
                            <Badge variant="outline" className="text-xs mt-0.5">
                              {order.planId?.includes("pancek") ? "Pancek" : "SMAP"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium" data-testid={`text-amount-${order.id}`}>
                              {formatPrice(order.amount || 0)}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p className="capitalize">{order.paymentMethod?.replace("_", " ")}</p>
                              {order.bankName && (
                                <p className="text-xs text-muted-foreground uppercase">{order.bankName}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusCfg.variant} className="flex items-center gap-1 w-fit">
                              {statusCfg.icon}
                              {statusCfg.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                            {order.paidAt && (
                              <p className="text-xs text-green-600">Lunas: {formatDate(order.paidAt)}</p>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 justify-end">
                              {isPendingVerif && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => openWhatsApp(order)}
                                    data-testid={`button-wa-${order.id}`}
                                  >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    WA
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => verifyMutation.mutate(order.id)}
                                    disabled={verifyMutation.isPending}
                                    data-testid={`button-verify-${order.id}`}
                                  >
                                    {verifyMutation.isPending ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                    )}
                                    Verifikasi
                                  </Button>
                                </>
                              )}
                              {!isPaid && !isPendingVerif && (
                                <p className="text-xs text-muted-foreground">Menunggu konfirmasi user</p>
                              )}
                              {isPaid && (
                                <Badge variant="secondary" className="text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Aktif
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Config reminder */}
        <Card className="border-dashed">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">Konfigurasi Rekening Bank</p>
                <p>
                  Set env vars berikut agar nomor rekening tampil di halaman checkout:{" "}
                  <code className="bg-muted px-1 rounded text-xs">PAYMENT_BCA_ACCOUNT</code>,{" "}
                  <code className="bg-muted px-1 rounded text-xs">PAYMENT_MANDIRI_ACCOUNT</code>,{" "}
                  <code className="bg-muted px-1 rounded text-xs">PAYMENT_BRI_ACCOUNT</code>,{" "}
                  <code className="bg-muted px-1 rounded text-xs">PAYMENT_BNI_ACCOUNT</code>,{" "}
                  <code className="bg-muted px-1 rounded text-xs">PAYMENT_ACCOUNT_HOLDER</code>,{" "}
                  <code className="bg-muted px-1 rounded text-xs">PAYMENT_WHATSAPP</code>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />
        <p className="text-center text-xs text-muted-foreground pb-4">
          Compliance Hub Admin Panel · Data diperbarui otomatis setiap 30 detik
        </p>
      </div>
    </div>
  );
}
