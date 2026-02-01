import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Plus, Pencil, Trash2, Handshake } from "lucide-react";
import { insertVendorSchema, type Vendor, type InsertVendor } from "@shared/schema";

export default function VendorsPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Vendor | null>(null);

  const { data: vendors, isLoading } = useQuery<Vendor[]>({
    queryKey: ["/api/vendors"],
  });

  const form = useForm<InsertVendor>({
    resolver: zodResolver(insertVendorSchema),
    defaultValues: {
      name: "",
      type: "",
      address: "",
      city: "",
      phone: "",
      email: "",
      contactPerson: "",
      npwp: "",
      bankAccount: "",
      bankName: "",
      dueDiligenceStatus: "pending",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertVendor) => apiRequest("POST", "/api/vendors", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setOpen(false);
      form.reset();
      toast({ title: "Berhasil", description: "Vendor berhasil ditambahkan" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Terjadi kesalahan", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertVendor) =>
      apiRequest("PUT", `/api/vendors/${editingItem?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendors"] });
      setOpen(false);
      setEditingItem(null);
      form.reset();
      toast({ title: "Berhasil", description: "Data vendor berhasil diperbarui" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Terjadi kesalahan", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/vendors/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Berhasil", description: "Vendor berhasil dihapus" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Terjadi kesalahan", variant: "destructive" });
    },
  });

  const handleEdit = (item: Vendor) => {
    setEditingItem(item);
    form.reset({
      name: item.name,
      type: item.type,
      address: item.address ?? "",
      city: item.city ?? "",
      phone: item.phone ?? "",
      email: item.email ?? "",
      contactPerson: item.contactPerson ?? "",
      npwp: item.npwp ?? "",
      bankAccount: item.bankAccount ?? "",
      bankName: item.bankName ?? "",
      dueDiligenceStatus: item.dueDiligenceStatus ?? "pending",
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

  const onSubmit = (data: InsertVendor) => {
    if (editingItem) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const getDueDiligenceBadge = (status: string | null) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-600">Disetujui</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Ditolak</Badge>;
      case "review":
        return <Badge variant="default">Review</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">Vendor & Mitra</h1>
          <p className="text-muted-foreground mt-1">Kelola data vendor dan mitra kerja</p>
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-vendor">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Vendor" : "Tambah Vendor"}</DialogTitle>
              <DialogDescription>
                {editingItem ? "Perbarui data vendor" : "Masukkan data vendor baru"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Vendor *</FormLabel>
                        <FormControl>
                          <Input placeholder="PT. Vendor" {...field} data-testid="input-vendor-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jenis *</FormLabel>
                        <FormControl>
                          <Input placeholder="Supplier, Subkontraktor, dll" {...field} data-testid="input-vendor-type" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Person</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama kontak" {...field} value={field.value ?? ""} data-testid="input-vendor-contact" />
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
                          <Input placeholder="021-1234567" {...field} value={field.value ?? ""} data-testid="input-vendor-phone" />
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
                          <Input type="email" placeholder="email@vendor.com" {...field} value={field.value ?? ""} data-testid="input-vendor-email" />
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
                        <FormLabel>Kota</FormLabel>
                        <FormControl>
                          <Input placeholder="Jakarta" {...field} value={field.value ?? ""} data-testid="input-vendor-city" />
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
                        <FormLabel>Alamat</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Alamat lengkap" {...field} value={field.value ?? ""} data-testid="input-vendor-address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="npwp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NPWP</FormLabel>
                        <FormControl>
                          <Input placeholder="00.000.000.0-000.000" {...field} value={field.value ?? ""} data-testid="input-vendor-npwp" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dueDiligenceStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status Uji Tuntas</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value ?? "pending"}>
                          <FormControl>
                            <SelectTrigger data-testid="select-vendor-due-diligence">
                              <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                            <SelectItem value="approved">Disetujui</SelectItem>
                            <SelectItem value="rejected">Ditolak</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Bank</FormLabel>
                        <FormControl>
                          <Input placeholder="Bank BCA" {...field} value={field.value ?? ""} data-testid="input-vendor-bank-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bankAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Rekening</FormLabel>
                        <FormControl>
                          <Input placeholder="1234567890" {...field} value={field.value ?? ""} data-testid="input-vendor-bank-account" />
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
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-vendor">
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
            <Handshake className="h-5 w-5" />
            Daftar Vendor & Mitra
          </CardTitle>
          <CardDescription>
            Total: {vendors?.length ?? 0} vendor/mitra
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : vendors && vendors.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Kota</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Uji Tuntas</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((item) => (
                    <TableRow key={item.id} data-testid={`row-vendor-${item.id}`}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.city ?? "-"}</TableCell>
                      <TableCell>{item.contactPerson ?? "-"}</TableCell>
                      <TableCell>{getDueDiligenceBadge(item.dueDiligenceStatus)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(item)}
                            data-testid={`button-edit-vendor-${item.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteMutation.mutate(item.id)}
                            data-testid={`button-delete-vendor-${item.id}`}
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
              <Handshake className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Belum ada vendor/mitra</h3>
              <p className="text-muted-foreground mt-1">Klik tombol tambah untuk menambahkan vendor baru</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
