"use client";

import {
  cancelarReserva,
  confirmarReserva,
} from "@/app/actions/reservas";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { botonPeligro } from "@/app/lib/estilos";

export function AccionesReserva({
  id,
  estado,
}: {
  id: number;
  estado: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function manejarCancelar() {
    const resultado = await cancelarReserva(id);
    if (!resultado.exito) {
      setError(resultado.mensaje ?? "Error desconocido.");
      return;
    }
    setError(null);
    router.refresh();
  }

  async function manejarConfirmar() {
    const resultado = await confirmarReserva(id);
    if (!resultado.exito) {
      setError(resultado.mensaje ?? "Error desconocido.");
      return;
    }
    setError(null);
    router.refresh();
  }

  return (
    <div className="text-right shrink-0 ml-4">
      {estado === "pendiente" && (
        <button
          onClick={manejarConfirmar}
          className="text-sm text-green-600 hover:text-green-800 transition-colors mr-3"
        >
          Confirmar
        </button>
      )}
      {estado !== "cancelada" && (
        <button onClick={manejarCancelar} className={botonPeligro}>
          Cancelar
        </button>
      )}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
