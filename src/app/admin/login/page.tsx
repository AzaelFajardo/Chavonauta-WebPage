"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin/catalogo";

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Paso 1: Comprobar si el correo está en la lista blanca
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

      setStep(2);
      setPassword("");
    } catch {
      setErrorMessage("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Paso 2: Validar contraseña y acceder
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
      {/* Contenedor Plano y Minimalista */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-7">
        <h1 className="text-xl font-bold text-white text-center mb-6 tracking-tight">
          Bienvenido
        </h1>

        {errorMessage && (
          <div className="mb-4 p-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-rose-300 text-xs text-center leading-relaxed">
            {errorMessage}
          </div>
        )}

        {/* VENTANA 1: Correo electrónico */}
        {step === 1 && (
          <form onSubmit={handleCheckEmail} className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 font-medium">
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
                className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full py-2.5 px-4 rounded-xl font-medium text-xs text-zinc-900 bg-white hover:bg-zinc-200 active:bg-zinc-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Comprobando...</span>
                </>
              ) : (
                <span>Continuar</span>
              )}
            </button>
          </form>
        )}

        {/* VENTANA 2: Contraseña */}
        {step === 2 && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex items-center justify-between p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs">
              <span className="text-zinc-300 font-medium truncate max-w-[200px]">
                {email}
              </span>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setErrorMessage(null);
                }}
                className="text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Cambiar
              </button>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 font-medium">
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
                  className="w-full px-3 py-2.5 pr-10 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-zinc-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
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
              className="w-full py-2.5 px-4 rounded-xl font-medium text-xs text-zinc-900 bg-white hover:bg-zinc-200 active:bg-zinc-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="text-zinc-500 text-xs flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />
            <span>Cargando...</span>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
