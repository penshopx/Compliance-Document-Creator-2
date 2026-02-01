import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Building2, Save } from "lucide-react";
import { insertCompanySchema, type Company, type InsertCompany } from "@shared/schema";

export default function CompanyPage() {
  const { toast } = useToast();

  const { data: company, isLoading } = useQuery<Company>({
    queryKey: ["/api/company"],
  });

  const form = useForm<InsertCompany>({
    resolver: zodResolver(insertCompanySchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      phone: "",
      email: "",
      website: "",
      npwp: "",
      siup: "",
      nib: "",
      directorName: "",
      directorPosition: "",
      establishedDate: "",
      businessType: "",
      employeeCount: 0,
    },
    values: company ? {
      name: company.name,
      address: company.address,
      city: company.city,
      province: company.province,
      postalCode: company.postalCode ?? "",
      phone: company.phone ?? "",
      email: company.email ?? "",
      website: company.website ?? "",
      npwp: company.npwp ?? "",
      siup: company.siup ?? "",
      nib: company.nib ?? "",
      directorName: company.directorName ?? "",
      directorPosition: company.directorPosition ?? "",
      establishedDate: company.establishedDate ?? "",
      businessType: company.businessType ?? "",
      employeeCount: company.employeeCount ?? 0,
    } : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertCompany) => {
      if (company) {
        return apiRequest("PUT", `/api/company/${company.id}`, data);
      }
      return apiRequest("POST", "/api/company", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/company"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Berhasil",
        description: "Data perusahaan berhasil disimpan",
      });
    },
    onError: () => {
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan data",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCompany) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-96 mt-2" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">Profil Perusahaan</h1>
        <p className="text-muted-foreground mt-1">
          Kelola informasi dasar perusahaan Anda
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informasi Umum
              </CardTitle>
              <CardDescription>Data identitas perusahaan</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Nama Perusahaan *</FormLabel>
                    <FormControl>
                      <Input placeholder="PT. Contoh Perusahaan" {...field} data-testid="input-company-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Alamat *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Jl. Contoh No. 123" {...field} data-testid="input-company-address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kota *</FormLabel>
                    <FormControl>
                      <Input placeholder="Jakarta" {...field} data-testid="input-company-city" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provinsi *</FormLabel>
                    <FormControl>
                      <Input placeholder="DKI Jakarta" {...field} data-testid="input-company-province" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode Pos</FormLabel>
                    <FormControl>
                      <Input placeholder="12345" {...field} value={field.value ?? ""} data-testid="input-company-postal" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telepon</FormLabel>
                    <FormControl>
                      <Input placeholder="021-1234567" {...field} value={field.value ?? ""} data-testid="input-company-phone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="info@perusahaan.com" {...field} value={field.value ?? ""} data-testid="input-company-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="www.perusahaan.com" {...field} value={field.value ?? ""} data-testid="input-company-website" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dokumen Legal</CardTitle>
              <CardDescription>Nomor-nomor dokumen resmi perusahaan</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="npwp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NPWP</FormLabel>
                    <FormControl>
                      <Input placeholder="00.000.000.0-000.000" {...field} value={field.value ?? ""} data-testid="input-company-npwp" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="siup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SIUP</FormLabel>
                    <FormControl>
                      <Input placeholder="Nomor SIUP" {...field} value={field.value ?? ""} data-testid="input-company-siup" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nib"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIB</FormLabel>
                    <FormControl>
                      <Input placeholder="Nomor Induk Berusaha" {...field} value={field.value ?? ""} data-testid="input-company-nib" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Tambahan</CardTitle>
              <CardDescription>Data pelengkap perusahaan</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="directorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Direktur</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama Direktur Utama" {...field} value={field.value ?? ""} data-testid="input-director-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="directorPosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jabatan Direktur</FormLabel>
                    <FormControl>
                      <Input placeholder="Direktur Utama" {...field} value={field.value ?? ""} data-testid="input-director-position" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Usaha</FormLabel>
                    <FormControl>
                      <Input placeholder="Konstruksi, Jasa, dll" {...field} value={field.value ?? ""} data-testid="input-business-type" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employeeCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah Karyawan</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        value={field.value ?? 0}
                        data-testid="input-employee-count"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="establishedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Berdiri</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} data-testid="input-established-date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={mutation.isPending} data-testid="button-save-company">
              <Save className="mr-2 h-4 w-4" />
              {mutation.isPending ? "Menyimpan..." : "Simpan Data"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
