"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { LoginPayload, RegisterPayload } from "@/domain/types/auth.types";
import { swal, swalError } from "@/shared/utils/swal";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function login(payload: LoginPayload) {
    setLoading(true);
    try {
      await authService.login(payload);
      router.replace("/movies");
    } catch (err: any) {
      const message = err.response?.data?.error ?? "E-mail ou senha inválidos.";
      await swalError("Falha no login", message);
    } finally {
      setLoading(false);
    }
  }

  async function register(payload: RegisterPayload) {
    setLoading(true);
    try {
      const user = await authService.register(payload);
      authService.setUsername(user.username);
      await swal({ icon: "success", title: "Conta criada!", text: "Faça login para continuar.", timer: 2000, showConfirmButton: false });
      router.replace("/login");
    } catch (err: any) {
      const details = err.response?.data?.details;
      const message = details
        ? Object.values(details).flat().join(" ")
        : err.response?.data?.error ?? "Não foi possível criar a conta.";
      await swalError("Erro no cadastro", message);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    authService.logout();
    router.replace("/login");
  }

  return { login, register, logout, loading };
}
