import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Plus, Pencil, Trash2, Award } from "lucide-react";
import { insertQualificationSchema, type Qualification, type InsertQualification } from "@shared/schema";

export default function QualificationsPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Qualification | null>(null);

  const { data: qualifications, isLoading } = useQuery<Qualification[]>({
    queryKey: ["/api/qualifications"],
  });

  const form = useForm<InsertQualification>({
    resolver: zodResolver(insertQualificationSchema),
    defaultValues: {
      code: "",
      classification: "",
      subClassification: "",
      grade: "",
      validFrom: "",
      validUntil: "",
      issuingBody: "",
      certificateNumber: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertQualification) => apiRequest("POST", "/api/qualifications", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/qualifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setOpen(false);
      form.reset();
      toast({ title: "Berhasil", description: "Klasifikasi SBU berhasil ditambahkan" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Terjadi kesalahan", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertQualification) =>
      apiRequest("PUT", `/api/qualifications/${editingItem?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/qualifications"] });
      setOpen(false);
      setEditingItem(null);
      form.reset();
      toast({ title: "Berhasil", description: "Data klasifikasi berhasil diperbarui" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Terjadi kesalahan", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/qualifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/qualifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Berhasil", description: "Klasifikasi berhasil dihapus" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Terjadi kesalahan", variant: "destructive" });
    },
  });

  const handleEdit = (item: Qualification) => {
    setEditingItem(item);
    form.reset({
      code: item.code,
      classification: item.classification,
      subClassification: item.subClassification ?? "",
      grade: item.grade ?? "",
      validFrom: item.validFrom ?? "",
      validUntil: item.validUntil ?? "",
      issuingBody: item.issuingBody ?? "",
      certificateNumber: item.certificateNumber ?? "",
    });
    setOpen(true);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setEditingItem(null);
      form.reset();
    }
  };

  const onSubmit = (data: InsertQualification) => {
    if (editingItem) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isExpired = (validUntil: string | null) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">Klasifikasi SBU</h1>
          <p className="text-muted-foreground mt-1">Sertifikat Badan Usaha dan Kualifikasi</p>
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-qualification">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Klasifikasi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Klasifikasi" : "Tambah Klasifikasi SBU"}</DialogTitle>
              <DialogDescription>
                {editingItem ? "Perbarui data klasifikasi" : "Masukkan data klasifikasi SBU baru"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kode Klasifikasi *</FormLabel>
                        <FormControl>
                          <Input placeholder="BG001" {...field} data-testid="input-qualification-code" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade/Kualifikasi</FormLabel>
                        <FormControl>
                          <Input placeholder="K, M, B, dll" {...field} value={field.value ?? ""} data-testid="input-qualification-grade" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="classification"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Klasifikasi *</FormLabel>
                        <FormControl>
                          <Input placeholder="Jasa Pelaksana Konstruksi" {...field} data-testid="input-qualification-classification" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subClassification"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Sub Klasifikasi</FormLabel>
                        <FormControl>
                          <Input placeholder="Bangunan Gedung" {...field} value={field.value ?? ""} data-testid="input-qualification-subclassification" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="certificateNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Sertifikat</FormLabel>
                        <FormControl>
                          <Input placeholder="Nomor sertifikat" {...field} value={field.value ?? ""} data-testid="input-qualification-certificate-number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="issuingBody"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Badan Penerbit</FormLabel>
                        <FormControl>
                          <Input placeholder="LPJK, OSS, dll" {...field} value={field.value ?? ""} data-testid="input-qualification-issuing-body" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="validFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Berlaku Mulai</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value ?? ""} data-testid="input-qualification-valid-from" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="validUntil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Berlaku Sampai</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value ?? ""} data-testid="input-qualification-valid-until" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-qualification">
                    {createMutation.isPending || updateMutation.isPending ? "Menyimpan..." : "Simpan"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Daftar Klasifikasi SBU
          </CardTitle>
          <CardDescription>
            Total: {qualifications?.length ?? 0} klasifikasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : qualifications && qualifications.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Klasifikasi</TableHead>
                    <TableHead>Sub Klasifikasi</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qualifications.map((item) => (
                    <TableRow key={item.id} data-testid={`row-qualification-${item.id}`}>
                      <TableCell className="font-medium">{item.code}</TableCell>
                      <TableCell>{item.classification}</TableCell>
                      <TableCell>{item.subClassification ?? "-"}</TableCell>
                      <TableCell>{item.grade ?? "-"}</TableCell>
                      <TableCell>
                        <Badge variant={isExpired(item.validUntil) ? "destructive" : "default"}>
                          {isExpired(item.validUntil) ? "Kadaluarsa" : "Aktif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(item)}
                            data-testid={`button-edit-qualification-${item.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteMutation.mutate(item.id)}
                            data-testid={`button-delete-qualification-${item.id}`}
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
              <Award className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Belum ada klasifikasi SBU</h3>
              <p className="text-muted-foreground mt-1">Klik tombol tambah untuk menambahkan klasifikasi baru</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
