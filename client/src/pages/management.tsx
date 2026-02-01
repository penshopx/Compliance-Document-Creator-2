import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { insertManagementSchema, type Management, type InsertManagement } from "@shared/schema";

export default function ManagementPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Management | null>(null);

  const { data: members, isLoading } = useQuery<Management[]>({
    queryKey: ["/api/management"],
  });

  const form = useForm<InsertManagement>({
    resolver: zodResolver(insertManagementSchema),
    defaultValues: {
      name: "",
      position: "",
      department: "",
      phone: "",
      email: "",
      joinDate: "",
      responsibilities: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertManagement) => apiRequest("POST", "/api/management", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/management"] });
      setOpen(false);
      form.reset();
      toast({ title: "Berhasil", description: "Anggota manajemen berhasil ditambahkan" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Terjadi kesalahan", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertManagement) =>
      apiRequest("PUT", `/api/management/${editingMember?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/management"] });
      setOpen(false);
      setEditingMember(null);
      form.reset();
      toast({ title: "Berhasil", description: "Data anggota berhasil diperbarui" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Terjadi kesalahan", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/management/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/management"] });
      toast({ title: "Berhasil", description: "Anggota berhasil dihapus" });
    },
    onError: () => {
      toast({ title: "Gagal", description: "Terjadi kesalahan", variant: "destructive" });
    },
  });

  const handleEdit = (member: Management) => {
    setEditingMember(member);
    form.reset({
      name: member.name,
      position: member.position,
      department: member.department ?? "",
      phone: member.phone ?? "",
      email: member.email ?? "",
      joinDate: member.joinDate ?? "",
      responsibilities: member.responsibilities ?? "",
    });
    setOpen(true);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setEditingMember(null);
      form.reset();
    }
  };

  const onSubmit = (data: InsertManagement) => {
    if (editingMember) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">Manajemen Perusahaan</h1>
          <p className="text-muted-foreground mt-1">Kelola struktur manajemen perusahaan</p>
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-management">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Anggota
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingMember ? "Edit Anggota" : "Tambah Anggota Manajemen"}</DialogTitle>
              <DialogDescription>
                {editingMember ? "Perbarui data anggota" : "Masukkan data anggota manajemen baru"}
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
                        <FormLabel>Nama Lengkap *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama anggota" {...field} data-testid="input-management-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jabatan *</FormLabel>
                        <FormControl>
                          <Input placeholder="Jabatan" {...field} data-testid="input-management-position" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departemen</FormLabel>
                        <FormControl>
                          <Input placeholder="Departemen" {...field} value={field.value ?? ""} data-testid="input-management-department" />
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
                          <Input placeholder="08xxxxxxxxxx" {...field} value={field.value ?? ""} data-testid="input-management-phone" />
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
                          <Input type="email" placeholder="email@perusahaan.com" {...field} value={field.value ?? ""} data-testid="input-management-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="joinDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal Bergabung</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value ?? ""} data-testid="input-management-join-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="responsibilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggung Jawab</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Uraian tanggung jawab" {...field} value={field.value ?? ""} data-testid="input-management-responsibilities" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-management">
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
            <Users className="h-5 w-5" />
            Struktur Manajemen
          </CardTitle>
          <CardDescription>
            Total: {members?.length ?? 0} anggota
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : members && members.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Jabatan</TableHead>
                    <TableHead>Departemen</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telepon</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id} data-testid={`row-management-${member.id}`}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.position}</TableCell>
                      <TableCell>{member.department ?? "-"}</TableCell>
                      <TableCell>{member.email ?? "-"}</TableCell>
                      <TableCell>{member.phone ?? "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(member)}
                            data-testid={`button-edit-management-${member.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteMutation.mutate(member.id)}
                            data-testid={`button-delete-management-${member.id}`}
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
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Belum ada data manajemen</h3>
              <p className="text-muted-foreground mt-1">Klik tombol tambah untuk menambahkan anggota baru</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
