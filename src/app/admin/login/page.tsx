"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Mail,
  Lock,
} from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin/catalogo";

  // Estado del flujo de 2 pasos
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Estados de carga y error
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Paso 1: Validar si el correo está autorizado en la Whitelist
  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Ingresa un correo electrónico válido.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.authorized) {
        setErrorMessage(
          data.error || "Este correo no tiene permisos para acceder al panel."
        );
        return;
      }

      // Correo autorizado -> Pasar a la ventana de contraseña
      setStep(2);
      setPassword("");
    } catch {
      setErrorMessage("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Paso 2: Validar contraseña y generar sesión
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!password) {
      setErrorMessage("Ingresa tu contraseña.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrorMessage(data.error || "Contraseña incorrecta.");
        return;
      }

      router.push(from);
      router.refresh();
    } catch {
      setErrorMessage("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Tarjeta Minimalista */}
      <div className="bg-navy-950/95 border border-navy-800/80 rounded-3xl p-7 shadow-2xl backdrop-blur-md">
        {/* Cabecera Minimalista */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-navy-900 border border-navy-800 flex items-center justify-center mx-auto mb-3.5 text-sky-400">
            {step === 1 ? <Mail className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </div>
          <h1 className="text-base font-black tracking-tight text-white uppercase">
            CHAVONAUTA
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Panel Administrativo</p>
        </div>

        {/* Mensaje de Error */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* VENTANA 1: Correo electrónico */}
        {step === 1 && (
          <form onSubmit={handleCheckEmail} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                autoFocus
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@ejemplo.com"
                className="w-full px-3.5 py-2.5 bg-navy-900/90 border border-navy-750 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs tracking-wider uppercase text-white bg-sky-600 hover:bg-sky-500 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-sky-600/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Comprobando...</span>
                </>
              ) : (
                <>
                  <span>Continuar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* VENTANA 2: Contraseña (Solo si el correo fue autorizado) */}
        {step === 2 && (
          <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in duration-200">
            {/* Chip con el correo validado */}
            <div className="flex items-center justify-between p-2.5 bg-navy-900/70 border border-navy-800 rounded-xl text-xs">
              <span className="text-slate-300 font-medium truncate max-w-[200px]">
                {email}
              </span>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setErrorMessage(null);
                }}
                className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 transition-colors"
              >
                Cambiar
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 bg-navy-900/90 border border-navy-750 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs tracking-wider uppercase text-white bg-sky-600 hover:bg-sky-500 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-sky-600/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Accediendo...</span>
                </>
              ) : (
                <span>Ingresar</span>
              )}
            </button>
          </form>
        )}

        {/* Enlace sutil para volver a la tienda */}
        <div className="mt-5 pt-4 border-t border-navy-900/80 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Volver a la tienda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="text-slate-400 text-xs flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
            <span>Cargando...</span>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
