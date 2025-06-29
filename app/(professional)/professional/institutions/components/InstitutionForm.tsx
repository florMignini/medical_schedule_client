"use client";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createNewInstitution, updateInstitutionAction } from "../../../../actions/institutionAction";
import { ICreateInstitution } from "@/interfaces";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  onSuccess?: () => void;
  initialData?: Partial<ICreateInstitution>;
}

export function InstitutionForm({ open, setOpen, onSuccess, initialData }: Props) {
  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: initialData || {
      name: "",
      address: "",
      phone: "",
      email: "",
      website: "",
    },
  });

  const [preview, setPreview] = useState<string | null>(initialData?.institutionImage || null);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setPreview(initialData.institutionImage ?? null);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: any) => {
    const file = data.institutionImage?.[0];
    const formData = file
      ? (() => {
          const fd = new FormData();
          fd.append("blobFile", file);
          fd.append("fileName", file.name);
          return fd;
        })()
      : undefined;

    if (initialData?.id) {
      await updateInstitutionAction({
        institutionId: initialData.id,
        institutionImage: file ? formData : null,
        ...data,
      });
    } else {
      await createNewInstitution({
        institutionImage: file ? formData : undefined,
        ...data,
      });
    }

    onSuccess?.();
    setOpen(false);
    reset();
    setPreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar" : "Nueva"} Institución</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="Nombre" {...register("name")} />
          <Input placeholder="Dirección" {...register("address")} />
          <Input placeholder="Teléfono" {...register("phone")} />
          <Input placeholder="Email" {...register("email")} />
          <Input placeholder="Sitio web" {...register("website")} />

          <Input
            type="file"
            {...register("institutionImage")}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPreview(URL.createObjectURL(file));
            }}
          />
          {preview && (
            <div className="relative w-full h-40">
              <Image src={preview} alt="Preview" fill className="object-cover rounded" />
            </div>
          )}

          <Button type="submit" className="w-full">
            {initialData ? "Actualizar" : "Crear"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
