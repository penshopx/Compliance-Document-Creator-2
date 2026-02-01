import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield, CreditCard, Smartphone, Building2, ArrowLeft, Check, Copy, Loader2, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { SubscriptionPlan, PaymentOrder } from "@shared/schema";

const BANK_ACCOUNTS = [
  { id: "bca", name: "BCA", account: "1234567890", holder: "PT Compliance Hub Indonesia" },
  { id: "mandiri", name: "Mandiri", account: "0987654321", holder: "PT Compliance Hub Indonesia" },
  { id: "bri", name: "BRI", account: "1122334455", holder: "PT Compliance Hub Indonesia" },
  { id: "bni", name: "BNI", account: "5566778899", holder: "PT Compliance Hub Indonesia" },
];

const EWALLETS = [
  { id: "gopay", name: "GoPay" },
  { id: "ovo", name: "OVO" },
  { id: "dana", name: "Dana" },
  { id: "shopeepay", name: "ShopeePay" },
];

export default function CheckoutPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "ewallet">("bank");
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [selectedEwallet, setSelectedEwallet] = useState<string>("");
  const [step, setStep] = useState<"select" | "confirm" | "success">("select");
  const [createdOrder, setCreatedOrder] = useState<PaymentOrder | null>(null);

  const searchParams = new URLSearchParams(window.location.search);
  const planId = searchParams.get("plan");

  const { data: plans, isLoading: plansLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ["/api/subscription-plans"],
  });

  const selectedPlan = plans?.find(p => p.id === planId);

  const createOrderMutation = useMutation({
    mutationFn: async (data: { planId: string; paymentMethod: string; paymentBank?: string; ewalletProvider?: string }) => {
      const response = await apiRequest("POST", "/api/payment-orders", data);
      return response.json();
    },
    onSuccess: (order: PaymentOrder) => {
      setCreatedOrder(order);
      setStep("confirm");
      queryClient.invalidateQueries({ queryKey: ["/api/payment-orders"] });
    },
    onError: () => {
      toast({
        title: "Gagal membuat pesanan",
        description: "Silakan coba lagi.",
        variant: "destructive",
      });
    },
  });

  const confirmPaymentMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const response = await apiRequest("POST", `/api/payment-orders/${orderId}/confirm`, {});
      return response.json();
    },
    onSuccess: () => {
      setStep("success");
      queryClient.invalidateQueries({ queryKey: ["/api/payment-orders"] });
    },
    onError: () => {
      toast({
        title: "Gagal konfirmasi",
        description: "Silakan coba lagi.",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Disalin!",
      description: "Nomor rekening telah disalin.",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCreateOrder = () => {
    if (!planId) return;
    createOrderMutation.mutate({
      planId,
      paymentMethod: paymentMethod === "bank" ? "bank_transfer" : "ewallet",
      paymentBank: paymentMethod === "bank" ? selectedBank : undefined,
      ewalletProvider: paymentMethod === "ewallet" ? selectedEwallet : undefined,
    });
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Halo, saya ingin konfirmasi pembayaran untuk:\n\n` +
      `Order: ${createdOrder?.orderNumber}\n` +
      `Paket: ${selectedPlan?.name}\n` +
      `Jumlah: ${formatPrice(selectedPlan?.price || 0)}\n\n` +
      `Mohon verifikasi pembayaran saya.`
    );
    window.open(`https://wa.me/6281234567890?text=${message}`, "_blank");
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  if (authLoading || plansLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!selectedPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Paket tidak ditemukan</p>
            <Button onClick={() => setLocation("/")} data-testid="button-back-home">
              Kembali ke Beranda
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <nav className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-14 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/")} data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold">Checkout</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {step === "select" && (
          <>
            <Card className="mb-6" data-testid="card-order-summary">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="outline" className="mb-2">
                      {(selectedPlan as any).category === "pancek" ? "Pancek" : "SMAP"}
                    </Badge>
                    <CardTitle data-testid="text-plan-name">{selectedPlan.name}</CardTitle>
                    <CardDescription>{selectedPlan.description}</CardDescription>
                  </div>
                  <p className="text-2xl font-bold text-primary" data-testid="text-plan-price">
                    {formatPrice(selectedPlan.price)}<span className="text-sm font-normal text-muted-foreground">/bulan</span>
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Fitur yang didapat:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedPlan.features?.split(",").map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
                {(selectedPlan as any).materials && (
                  <div>
                    <p className="text-sm font-medium mb-2">Materi yang diperoleh:</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                      {(selectedPlan as any).materials.split(",").map((material: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                          {material.trim()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card data-testid="card-payment-method">
              <CardHeader>
                <CardTitle>Metode Pembayaran</CardTitle>
                <CardDescription>Pilih metode pembayaran yang Anda inginkan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "bank" | "ewallet")}>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover-elevate cursor-pointer" onClick={() => setPaymentMethod("bank")}>
                    <RadioGroupItem value="bank" id="bank" data-testid="radio-bank" />
                    <Label htmlFor="bank" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Transfer Bank</p>
                        <p className="text-sm text-muted-foreground">BCA, Mandiri, BRI, BNI</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover-elevate cursor-pointer" onClick={() => setPaymentMethod("ewallet")}>
                    <RadioGroupItem value="ewallet" id="ewallet" data-testid="radio-ewallet" />
                    <Label htmlFor="ewallet" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">E-Wallet / QRIS</p>
                        <p className="text-sm text-muted-foreground">GoPay, OVO, Dana, ShopeePay</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "bank" && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Pilih Bank Tujuan</p>
                    <RadioGroup value={selectedBank} onValueChange={setSelectedBank}>
                      <div className="grid grid-cols-2 gap-3">
                        {BANK_ACCOUNTS.map((bank) => (
                          <div
                            key={bank.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedBank === bank.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                            }`}
                            onClick={() => setSelectedBank(bank.id)}
                            data-testid={`bank-option-${bank.id}`}
                          >
                            <RadioGroupItem value={bank.id} id={bank.id} className="sr-only" />
                            <p className="font-medium">{bank.name}</p>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {paymentMethod === "ewallet" && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Pilih E-Wallet</p>
                    <RadioGroup value={selectedEwallet} onValueChange={setSelectedEwallet}>
                      <div className="grid grid-cols-2 gap-3">
                        {EWALLETS.map((wallet) => (
                          <div
                            key={wallet.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedEwallet === wallet.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                            }`}
                            onClick={() => setSelectedEwallet(wallet.id)}
                            data-testid={`ewallet-option-${wallet.id}`}
                          >
                            <RadioGroupItem value={wallet.id} id={wallet.id} className="sr-only" />
                            <p className="font-medium">{wallet.name}</p>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-muted-foreground">
                      Setelah membuat pesanan, Anda akan mendapatkan kode QRIS yang dapat dibayar menggunakan aplikasi e-wallet pilihan Anda.
                    </p>
                  </div>
                )}

                <Separator />

                <Button
                  className="w-full"
                  size="lg"
                  disabled={(paymentMethod === "bank" && !selectedBank) || (paymentMethod === "ewallet" && !selectedEwallet) || createOrderMutation.isPending}
                  onClick={handleCreateOrder}
                  data-testid="button-create-order"
                >
                  {createOrderMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Lanjutkan Pembayaran
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {step === "confirm" && createdOrder && (
          <Card data-testid="card-payment-instructions">
            <CardHeader className="text-center">
              <Badge className="mx-auto mb-2" variant="secondary">Order #{createdOrder.orderNumber}</Badge>
              <CardTitle>Instruksi Pembayaran</CardTitle>
              <CardDescription>Selesaikan pembayaran dalam 24 jam</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Total Pembayaran</p>
                <p className="text-3xl font-bold text-primary" data-testid="text-payment-amount">
                  {formatPrice(selectedPlan.price)}
                </p>
              </div>

              {paymentMethod === "bank" && selectedBank && (
                <div className="space-y-4">
                  <p className="font-medium">Transfer ke Rekening:</p>
                  {BANK_ACCOUNTS.filter(b => b.id === selectedBank).map((bank) => (
                    <div key={bank.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-lg">{bank.name}</p>
                          <p className="text-2xl font-mono mt-1" data-testid="text-bank-account">{bank.account}</p>
                          <p className="text-sm text-muted-foreground mt-1">a.n. {bank.holder}</p>
                        </div>
                        <Button variant="outline" size="icon" onClick={() => copyToClipboard(bank.account)} data-testid="button-copy-account">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {paymentMethod === "ewallet" && (
                <div className="text-center p-6 border rounded-lg">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="font-medium mb-2">Scan QRIS</p>
                  <p className="text-sm text-muted-foreground">
                    Gunakan aplikasi e-wallet (GoPay, OVO, Dana, ShopeePay) untuk memindai kode QRIS
                  </p>
                  <div className="mt-4 p-8 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">[QRIS Code Placeholder]</p>
                  </div>
                </div>
              )}

              <Separator />

              <div className="space-y-3">
                <p className="font-medium">Konfirmasi Pembayaran</p>
                <p className="text-sm text-muted-foreground">
                  Setelah transfer, konfirmasi pembayaran melalui WhatsApp untuk proses verifikasi yang lebih cepat.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={openWhatsApp}
                  data-testid="button-whatsapp-confirm"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Konfirmasi via WhatsApp
                </Button>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => confirmPaymentMutation.mutate(createdOrder.id)}
                disabled={confirmPaymentMutation.isPending}
                data-testid="button-confirm-payment"
              >
                {confirmPaymentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Saya Sudah Transfer
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "success" && (
          <Card className="text-center" data-testid="card-payment-success">
            <CardContent className="pt-8 pb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="mb-2">Pembayaran Dikonfirmasi</CardTitle>
              <CardDescription className="mb-6">
                Tim kami akan memverifikasi pembayaran Anda dalam 1x24 jam kerja.
                Anda akan menerima notifikasi setelah langganan diaktifkan.
              </CardDescription>
              <div className="space-y-3">
                <Button className="w-full" onClick={() => setLocation("/welcome")} data-testid="button-go-dashboard">
                  Kembali ke Dashboard
                </Button>
                <Button variant="outline" className="w-full" onClick={openWhatsApp} data-testid="button-contact-support">
                  Hubungi Support
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
