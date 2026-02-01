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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Plus, Pencil, Trash2, Wrench } from "lucide-react";
import { insertEquipmentSchema, type Equipment, type InsertEquipment } from "@shared/schema";

export default function EquipmentPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);

  const { data: equipment, isLoading } = useQuery<Equipment[]>({
    queryKey: ["/api/equipment"],
  });

  const form = useForm<InsertEquipment>({
    resolver: zodResolver(insertEquipmentSchema),
    defaultValues: {
      name: "",
      type: "",
      brand: "",
      model: "",
      serialNumber: "",
      quantity: 1,
      condition: "good",
      location: "",
      purchaseDate: "",
      lastMaintenanceDate: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertEquipment) => apiRequest("POST", "/api/equipment", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setOpen(false);
      form.reset();
      toast({ title: "Berhasil", description: "Peralatan berhasil ditambahkan" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Terjadi kesalahan", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertEquipment) =>
      apiRequest("PUT", `/api/equipment/${editingItem?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      setOpen(false);
      setEditingItem(null);
      form.reset();
      toast({ title: "Berhasil", description: "Data peralatan berhasil diperbarui" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Terjadi kesalahan", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/equipment/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Berhasil", description: "Peralatan berhasil dihapus" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Terjadi kesalahan", variant: "destructive" });
    },
  });

  const handleEdit = (item: Equipment) => {
    setEditingItem(item);
    form.reset({
      name: item.name,
      type: item.type,
      brand: item.brand ?? "",
      model: item.model ?? "",
      serialNumber: item.serialNumber ?? "",
      quantity: item.quantity ?? 1,
      condition: item.condition ?? "good",
      location: item.location ?? "",
      purchaseDate: item.purchaseDate ?? "",
      lastMaintenanceDate: item.lastMaintenanceDate ?? "",
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

  const onSubmit = (data: InsertEquipment) => {
    if (editingItem) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const getConditionBadge = (condition: string | null) => {
    switch (condition) {
      case "good":
        return <Badge variant="default">Baik</Badge>;
      case "fair":
        return <Badge variant="secondary">Cukup</Badge>;
      case "poor":
        return <Badge variant="destructive">Rusak</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">Peralatan</h1>
          <p className="text-muted-foreground mt-1">Kelola data peralatan perusahaan</p>
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-equipment">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Peralatan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Peralatan" : "Tambah Peralatan"}</DialogTitle>
              <DialogDescription>
                {editingItem ? "Perbarui data peralatan" : "Masukkan data peralatan baru"}
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
                        <FormLabel>Nama Peralatan *</FormLabel>
                        <FormControl>
                          <Input placeholder="Excavator" {...field} data-testid="input-equipment-name" />
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
                          <Input placeholder="Alat Berat" {...field} data-testid="input-equipment-type" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Merek</FormLabel>
                        <FormControl>
                          <Input placeholder="Caterpillar" {...field} value={field.value ?? ""} data-testid="input-equipment-brand" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input placeholder="320D" {...field} value={field.value ?? ""} data-testid="input-equipment-model" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="serialNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Seri</FormLabel>
                        <FormControl>
                          <Input placeholder="SN-12345" {...field} value={field.value ?? ""} data-testid="input-equipment-serial" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jumlah</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            value={field.value ?? 1}
                            data-testid="input-equipment-quantity"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kondisi</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value ?? "good"}>
                          <FormControl>
                            <SelectTrigger data-testid="select-equipment-condition">
                              <SelectValue placeholder="Pilih kondisi" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="good">Baik</SelectItem>
                            <SelectItem value="fair">Cukup</SelectItem>
                            <SelectItem value="poor">Rusak</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lokasi</FormLabel>
                        <FormControl>
                          <Input placeholder="Gudang A" {...field} value={field.value ?? ""} data-testid="input-equipment-location" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="purchaseDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal Pembelian</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value ?? ""} data-testid="input-equipment-purchase-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastMaintenanceDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Perawatan Terakhir</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value ?? ""} data-testid="input-equipment-maintenance-date" />
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
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-equipment">
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
            <Wrench className="h-5 w-5" />
            Daftar Peralatan
          </CardTitle>
          <CardDescription>
            Total: {equipment?.length ?? 0} peralatan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : equipment && equipment.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Merek/Model</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Kondisi</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipment.map((item) => (
                    <TableRow key={item.id} data-testid={`row-equipment-${item.id}`}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{[item.brand, item.model].filter(Boolean).join(" ") || "-"}</TableCell>
                      <TableCell>{item.quantity ?? 1}</TableCell>
                      <TableCell>{getConditionBadge(item.condition)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(item)}
                            data-testid={`button-edit-equipment-${item.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteMutation.mutate(item.id)}
                            data-testid={`button-delete-equipment-${item.id}`}
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
              <Wrench className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Belum ada peralatan</h3>
              <p className="text-muted-foreground mt-1">Klik tombol tambah untuk menambahkan peralatan baru</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
