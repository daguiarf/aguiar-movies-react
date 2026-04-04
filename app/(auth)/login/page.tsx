import LoginForm from "@/modules/auth/components/LoginForm";
import AuthCarousel from "@/modules/auth/components/AuthCarousel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar — Aguiar Movies",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 lg:px-16 bg-background">
        <LoginForm />
      </div>
      <div className="hidden lg:block">
        <AuthCarousel />
      </div>
    </div>
  );
}
