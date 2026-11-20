"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Lock, Mail, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin/catalogo";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMessage("Por favor ingresa tu correo y contraseña.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 429) {
        setIsLocked(true);
        setErrorMessage(
          data.error ||
            "Demasiados intentos fallidos. Por seguridad, el acceso ha sido bloqueado temporalmente por 15 minutos."
        );
        return;
      }

      if (!response.ok) {
        setErrorMessage(data.error || "Credenciales inválidas o correo no autorizado.");
        return;
      }

      // Redirigir al destino previsto o al catálogo
      router.push(from);
      router.refresh();
    } catch {
      setErrorMessage("Error de conexión con el servidor. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-navy-950/90 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      {/* Encabezado */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 mb-4 shadow-inner">
          <Shield className="w-7 h-7" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
          CHAVONAUTA ADMIN
        </h1>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Acceso exclusivo para el personal y administración del cybercafé.
        </p>
      </div>

      {/* Alerta de Error */}
      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
          <div className="flex-1 leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Correo Autorizado
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              disabled={isLoading || isLocked}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="personal@chavonauta.com"
              className="w-full pl-10 pr-4 py-2.5 bg-navy-900 border border-navy-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Contraseña de Acceso
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              disabled={isLoading || isLocked}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-11 py-2.5 bg-navy-900 border border-navy-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all disabled:opacity-50"
            />
            <button
              type="button"
              disabled={isLoading || isLocked}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
              title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || isLocked}
          className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs tracking-wider uppercase text-white bg-sky-600 hover:bg-sky-500 active:scale-[0.99] transition-all shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verificando...</span>
            </>
          ) : (
            <span>Ingresar al Panel</span>
          )}
        </button>
      </form>

      {/* Pie con retorno a la tienda */}
      <div className="mt-6 pt-5 border-t border-navy-900/80 flex items-center justify-between text-[11px] text-slate-400">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 hover:text-sky-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a la tienda</span>
        </Link>
        <span className="text-[10px] text-slate-500">Protección Rate-Limit activa</span>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-950 via-slate-950 to-navy-950 flex flex-col items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="text-white text-xs flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
            <span>Cargando portal seguro...</span>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
