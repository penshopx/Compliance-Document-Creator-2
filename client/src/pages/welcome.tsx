import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Globe, Flag, Shield, FileCheck, CheckCircle2, ArrowRight, Building2, Scale, Award, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

export default function WelcomePage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <nav className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold">Compliance Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-right hidden sm:block">
              <div className="font-medium" data-testid="text-welcome-user">{user?.firstName || user?.email || 'User'}</div>
            </div>
            <Avatar className="h-8 w-8" data-testid="avatar-welcome-user">
              <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || 'User'} />
              <AvatarFallback>{(user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" asChild data-testid="button-welcome-logout">
              <a href="/api/logout" title="Keluar">
                <LogOut className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold" data-testid="text-welcome-title">Compliance Hub</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Selamat datang, {user?.firstName || 'User'}! Pilih jalur kepatuhan untuk memulai.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mb-8">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Building2 className="h-8 w-8 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Pilih Jalur Kepatuhan Anda</h3>
                  <p className="text-muted-foreground">
                    Indonesia memiliki dua kerangka kepatuhan anti-korupsi yang dapat diikuti oleh perusahaan. 
                    Pilih jalur yang sesuai dengan kebutuhan dan tujuan organisasi Anda.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="hover-elevate transition-all duration-300 border-2 hover:border-primary/50" data-testid="card-pancek">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30">
                  <Flag className="h-12 w-12 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">
                  Pengakuan Nasional
                </Badge>
              </div>
              <CardTitle className="text-2xl">Pancek</CardTitle>
              <CardDescription className="text-base">
                Panduan Cegah Korupsi - KPK
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Berbasis UU Tindak Pidana Korupsi & Perma 13/2016</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Pendekatan PDCAR (6 Fase)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Self-Assessment (Non-Sertifikasi)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Terintegrasi Platform Jaga.id</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Gratis</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2 text-sm text-muted-foreground">Dasar Hukum:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• UU No. 31/1999 jo UU No. 20/2001 (Tipikor)</li>
                  <li>• Perma No. 13/2016 (Pemidanaan Korporasi)</li>
                  <li>• SE Kementerian BUMN No. SE-2/MBU/07/2019</li>
                </ul>
              </div>

              <Link href="/pancek">
                <Button className="w-full mt-4" size="lg" data-testid="button-go-pancek">
                  Mulai Pancek
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all duration-300 border-2 hover:border-primary/50" data-testid="card-smap">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Globe className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                  Pengakuan Internasional
                </Badge>
              </div>
              <CardTitle className="text-2xl">SMAP</CardTitle>
              <CardDescription className="text-base">
                Sistem Manajemen Anti Penyuapan - ISO 37001
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Berbasis SNI ISO 37001:2016</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Pendekatan PDCA (4 Fase)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Sertifikasi oleh Lembaga Terakreditasi</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Wajib untuk Tender PUPR (Permen PUPR 08/2022)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span>270+ Template Dokumen</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2 text-sm text-muted-foreground">Dasar Hukum:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• SNI ISO 37001:2016</li>
                  <li>• Permen PUPR No. 8/2022</li>
                  <li>• SE Kementerian BUMN No. S-35/MBU/01/2020</li>
                </ul>
              </div>

              <Link href="/dashboard">
                <Button className="w-full mt-4" size="lg" data-testid="button-go-smap">
                  Mulai SMAP
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-5xl mx-auto mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Perbandingan SMAP vs Pancek
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Aspek</th>
                      <th className="text-left py-3 px-4 font-medium">
                        <div className="flex items-center gap-2">
                          <Flag className="h-4 w-4 text-red-600" />
                          Pancek (Nasional)
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-blue-600" />
                          SMAP (Internasional)
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-3 px-4 font-medium">Standar Acuan</td>
                      <td className="py-3 px-4">UU Tipikor + Panduan KPK</td>
                      <td className="py-3 px-4">SNI ISO 37001:2016</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Pendekatan</td>
                      <td className="py-3 px-4">PDCAR (6 fase)</td>
                      <td className="py-3 px-4">PDCA (4 fase)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Sertifikasi</td>
                      <td className="py-3 px-4">Non-Sertifikasi (Self-Assessment)</td>
                      <td className="py-3 px-4">Sertifikasi Terakreditasi</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Biaya</td>
                      <td className="py-3 px-4">Gratis</td>
                      <td className="py-3 px-4">Berbayar</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Platform</td>
                      <td className="py-3 px-4">Jaga.id (KPK)</td>
                      <td className="py-3 px-4">Lembaga Sertifikasi</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Kewajiban</td>
                      <td className="py-3 px-4">Sukarela</td>
                      <td className="py-3 px-4">Wajib untuk tender PUPR</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>Compliance Hub - Platform Manajemen Kepatuhan Anti Penyuapan & Anti Korupsi</p>
          <p className="mt-1">Mendukung SNI ISO 37001:2016 dan Panduan Cegah Korupsi KPK</p>
        </div>
      </div>
    </div>
  );
}
