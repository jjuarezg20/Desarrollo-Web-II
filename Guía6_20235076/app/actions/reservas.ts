"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

type EstadoFormulario = {
  errores: Record<string, string[]>;
  mensaje: string;
};

const reservaSchema = z.object({
  nombre: z.string().trim().min(2, "Ingrese un nombre valido."),
  correo: z.string().trim().email("Ingrese un correo valido."),
  fecha: z
    .string()
    .min(1, "La fecha es obligatoria.")
    .refine((valor) => !Number.isNaN(new Date(valor).getTime()), {
      message: "Ingrese una fecha valida.",
    }),
  servicioId: z.coerce.number().int().min(1, "Seleccione un servicio."),
});

function revalidarReservas() {
  revalidatePath("/");
  revalidatePath("/reservas");
  revalidatePath("/servicios");
}

export async function crearReserva(
  _prevState: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const validacion = reservaSchema.safeParse({
    nombre: formData.get("nombre"),
    correo: formData.get("correo"),
    fecha: formData.get("fecha"),
    servicioId: formData.get("servicioId"),
  });

  if (!validacion.success) {
    return {
      errores: validacion.error.flatten().fieldErrors,
      mensaje: "Corrige los campos marcados.",
    };
  }

  const { nombre, correo, fecha, servicioId } = validacion.data;
  const inicioNueva = new Date(fecha);

  try {
    const servicio = await prisma.servicio.findUnique({
      where: { id: servicioId },
      select: { duracion: true },
    });

    if (!servicio) {
      return {
        errores: { servicioId: ["El servicio seleccionado no existe."] },
        mensaje: "Seleccione un servicio valido.",
      };
    }

    const finNueva = new Date(
      inicioNueva.getTime() + servicio.duracion * 60 * 1000
    );

    const reservasExistentes = await prisma.reserva.findMany({
      where: {
        servicioId,
        estado: { not: "cancelada" },
      },
      select: { fecha: true },
    });

    const hayConflicto = reservasExistentes.some((reserva) => {
      const inicioExistente = new Date(reserva.fecha);
      const finExistente = new Date(
        inicioExistente.getTime() + servicio.duracion * 60 * 1000
      );
      return inicioExistente < finNueva && finExistente > inicioNueva;
    });

    if (hayConflicto) {
      return {
        errores: {
          fecha: [
            "Ya existe una reserva para este servicio en un horario que se traslapa.",
          ],
        },
        mensaje: "No hay disponibilidad para ese horario.",
      };
    }

    await prisma.reserva.create({
      data: {
        nombre,
        correo,
        fecha: inicioNueva,
        servicioId,
      },
    });
  } catch {
    return {
      errores: {},
      mensaje: "No se pudo crear la reserva.",
    };
  }

  revalidarReservas();
  redirect("/reservas");
}

export async function cancelarReserva(id: number) {
  if (!Number.isInteger(id) || id <= 0) {
    return { exito: false, mensaje: "ID de reserva invalido." };
  }

  try {
    const reserva = await prisma.reserva.findUnique({
      where: { id },
      select: { estado: true },
    });

    if (!reserva) {
      return { exito: false, mensaje: "La reserva no existe." };
    }

    if (reserva.estado === "cancelada") {
      return { exito: false, mensaje: "La reserva ya esta cancelada." };
    }

    await prisma.reserva.update({
      where: { id },
      data: { estado: "cancelada" },
    });

    revalidarReservas();
    return { exito: true };
  } catch {
    return { exito: false, mensaje: "No se pudo cancelar la reserva." };
  }
}

export async function confirmarReserva(id: number) {
  if (!Number.isInteger(id) || id <= 0) {
    return { exito: false, mensaje: "ID de reserva invalido." };
  }

  try {
    const reserva = await prisma.reserva.findUnique({
      where: { id },
      select: { estado: true },
    });

    if (!reserva) {
      return { exito: false, mensaje: "La reserva no existe." };
    }

    if (reserva.estado === "confirmada") {
      return { exito: false, mensaje: "La reserva ya esta confirmada." };
    }

    if (reserva.estado === "cancelada") {
      return {
        exito: false,
        mensaje: "No se puede confirmar una reserva cancelada.",
      };
    }

    await prisma.reserva.update({
      where: { id },
      data: { estado: "confirmada" },
    });

    revalidarReservas();
    return { exito: true };
  } catch {
    return { exito: false, mensaje: "No se pudo confirmar la reserva." };
  }
}
