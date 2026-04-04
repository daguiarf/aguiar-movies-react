import Swal, { SweetAlertOptions } from "sweetalert2";

/** Base config escura aplicada em todos os alertas */
const BASE: SweetAlertOptions = {
  background: "#0f0f1a",
  color: "#e2e8f0",
  confirmButtonColor: "#6366f1",
  cancelButtonColor: "#374151",
  customClass: {
    popup: "swal-popup-custom",
  },
};

/**
 * Garante que qualquer alerta anterior seja fechado antes de exibir o novo.
 * Isso evita o problema de o Swal não aparecer quando já há um aberto
 * ou quando chamado em sequência rápida.
 */
export async function swal(options: SweetAlertOptions) {
  // Fecha qualquer dialog aberto sem animação para não conflitar
  if (Swal.isVisible()) {
    Swal.close();
    await new Promise((r) => setTimeout(r, 80));
  }
  return Swal.fire({ ...BASE, ...options });
}

export const swalSuccess = (title: string, text?: string) =>
  swal({ icon: "success", title, text, timer: 2000, showConfirmButton: false });

export const swalError = (title: string, text?: string) =>
  swal({ icon: "error", title, text });

export const swalInfo = (title: string, text?: string) =>
  swal({ icon: "info", title, text });

export const swalConfirm = (title: string, text?: string) =>
  swal({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: "Sim, confirmar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#ef4444",
  });
