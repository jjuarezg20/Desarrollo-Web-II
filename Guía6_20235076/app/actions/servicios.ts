"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

type EstadoFormulario = {
  errores: Record<string, string[]>;
  mensaje: string;
};

const servicioSchema = z.object({
  nombre: z.string().trim().min(2, "Ingrese un nombre valido."),
  descripcion: z.string().trim().optional(),
  duracion: z.coerce.number().int().min(1, "La duracion debe ser mayor a 0."),
});

export async function crearServicio(
  _prevState: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const validacion = servicioSchema.safeParse({
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion"),
    duracion: formData.get("duracion"),
  });

  if (!validacion.success) {
    return {
      errores: validacion.error.flatten().fieldErrors,
      mensaje: "Corrige los campos marcados.",
    };
  }

  const { nombre, descripcion, duracion } = validacion.data;

  try {
    await prisma.servicio.create({
      data: {
        nombre,
        descripcion: descripcion ? descripcion : null,
        duracion,
      },
    });
  } catch {
    return {
      errores: {},
      mensaje: "No se pudo crear el servicio.",
    };
  }

  revalidatePath("/");
  revalidatePath("/servicios");
  revalidatePath("/reservas/nueva");
  redirect("/servicios");
}

export async function eliminarServicio(id: number) {
  if (!Number.isInteger(id) || id <= 0) {
    return { exito: false, mensaje: "ID de servicio invalido." };
  }

  try {
    await prisma.servicio.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/servicios");
    revalidatePath("/reservas");
    revalidatePath("/reservas/nueva");
    return { exito: true };
  } catch {
    return { exito: false, mensaje: "No se pudo eliminar el servicio." };
  }
}
