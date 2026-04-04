import RegisterForm from "@/modules/auth/components/RegisterForm";
import AuthCarousel from "@/modules/auth/components/AuthCarousel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar conta — Aguiar Movies",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 lg:px-16 bg-background">
        <RegisterForm />
      </div>
      <div className="hidden lg:block">
        <AuthCarousel />
      </div>
    </div>
  );
}
