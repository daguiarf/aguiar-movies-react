"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Heart,
  Bookmark,
  MessageSquare,
  Star,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Tv,
  Film,
} from "lucide-react";
import { useTheme } from "@/shared/components/ThemeProvider";
import { NotificationsDropdown } from "@/shared/components/NotificationsDropdown";
import { authService } from "@/services/auth.service";
import { swalConfirm } from "@/shared/utils/swal";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Filmes", href: "/movies", icon: Film },
  { label: "Séries", href: "/tv", icon: Tv },
  { label: "Favoritos", href: "/favorites", icon: Heart },
  { label: "Watchlist", href: "/watchlist", icon: Bookmark },
  { label: "Reviews", href: "/reviews", icon: Star },
  { label: "Fórum", href: "/forum", icon: MessageSquare },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  // Live search — navigate as user types (300ms debounce)
  useEffect(() => {
    if (!searchOpen) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (searchQuery.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }, 300);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, searchOpen, router]);

  function openSearch() {
    setSearchOpen(true);
    setSearchQuery("");
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
  }

  async function handleLogout() {
    const result = await swalConfirm("Sair da conta?", "Tem certeza que deseja encerrar a sessão?");
    if (result.isConfirmed) {
      authService.logout();
      router.replace("/login");
    }
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border/60 shadow-lg"
            : "bg-gradient-to-b from-background/90 to-transparent"
        )}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/movies" className="flex items-center gap-3 shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-primary/30 blur-md group-hover:bg-primary/50 transition-all duration-300" />
              <Image
                src="/logo-maior.png"
                alt="Aguiar Movies"
                width={44}
                height={44}
                className="relative rounded-xl ring-2 ring-primary/40 group-hover:ring-primary/70 transition-all duration-300 shadow-lg"
              />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-primary via-primary/90 to-purple-400 bg-clip-text text-transparent">
                Aguiar
              </span>
              <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground/80">
                Movies
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map(({ label, href }) => (
              <Link
                key={href + label}
                href={href}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === href
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/80"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            {/* Live search */}
            {!searchOpen ? (
              <button
                onClick={openSearch}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                title="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>
            ) : (
              <div className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-200">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Escape" && closeSearch()}
                    placeholder="Buscar filmes, séries..."
                    className="h-9 w-48 sm:w-64 rounded-lg bg-accent border border-border/80 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  />
                </div>
                <button
                  onClick={closeSearch}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title={theme === "dark" ? "Modo claro" : "Modo escuro"}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <NotificationsDropdown />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-9 h-9 rounded-lg hidden sm:flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-border/60 bg-background/98 backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
            <nav className="max-w-screen-2xl mx-auto px-4 py-3 flex flex-col gap-1">
              {navItems.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href + label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    pathname === href
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              {/* Mobile search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar filmes, séries..."
                    className="h-9 w-full rounded-lg bg-accent border border-border/80 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
