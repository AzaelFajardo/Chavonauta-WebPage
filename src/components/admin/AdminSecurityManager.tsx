"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  KeyRound,
  Mail,
  UserPlus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  Check,
  ShieldCheck,
} from "lucide-react";

export function AdminSecurityManager() {
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [currentSessionEmail, setCurrentSessionEmail] = useState<string>("");
  const [isLoadingList, setIsLoadingList] = useState(true);

  // Nuevo correo para la whitelist
  const [newEmail, setNewEmail] = useState("");
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState<string | null>(null);
  const [emailErrorMsg, setEmailErrorMsg] = useState<string | null>(null);

  // Cambio de contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [isChangingPw, setIsChangingPw] = useState(false);
  const [pwSuccessMsg, setPwSuccessMsg] = useState<string | null>(null);
  const [pwErrorMsg, setPwErrorMsg] = useState<string | null>(null);

  const fetchWhitelist = async () => {
    try {
      setIsLoadingList(true);
      const res = await fetch("/api/admin/security");
      if (res.ok) {
        const data = await res.json();
        setWhitelist(data.whitelist || []);
        setCurrentSessionEmail(data.currentSessionEmail || "");
      }
    } catch (err) {
      console.error("Error al cargar lista blanca:", err);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchWhitelist();
  }, []);

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailErrorMsg(null);
    setEmailSuccessMsg(null);

    const clean = newEmail.trim().toLowerCase();
    if (!clean || !clean.includes("@")) {
      setEmailErrorMsg("Ingresa un correo electrónico válido.");
      return;
    }

    if (whitelist.includes(clean)) {
      setEmailErrorMsg("Este correo ya está en la lista blanca.");
      return;
    }

    setIsAddingEmail(true);

    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add_email", email: clean }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No se pudo agregar el correo.");
      }

      setWhitelist(data.whitelist || [...whitelist, clean]);
      setNewEmail("");
      setEmailSuccessMsg(`El correo ${clean} fue autorizado exitosamente.`);
      setTimeout(() => setEmailSuccessMsg(null), 4000);
    } catch (err: unknown) {
      setEmailErrorMsg(err instanceof Error ? err.message : "Error al agregar correo.");
    } finally {
      setIsAddingEmail(false);
    }
  };

  const handleRemoveEmail = async (emailToRemove: string) => {
    setEmailErrorMsg(null);
    setEmailSuccessMsg(null);

    if (whitelist.length <= 1) {
      setEmailErrorMsg("Debe permanecer al menos un correo autorizado en la lista.");
      return;
    }

    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove_email", email: emailToRemove }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No se pudo eliminar el correo.");
      }

      setWhitelist(data.whitelist || whitelist.filter((e) => e !== emailToRemove));
      setEmailSuccessMsg(`Correo ${emailToRemove} eliminado.`);
      setTimeout(() => setEmailSuccessMsg(null), 3000);
    } catch (err: unknown) {
      setEmailErrorMsg(err instanceof Error ? err.message : "Error al eliminar.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwErrorMsg(null);
    setPwSuccessMsg(null);

    if (!currentPassword) {
      setPwErrorMsg("Ingresa la contraseña actual.");
      return;
    }

    if (newPassword.length < 8) {
      setPwErrorMsg("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwErrorMsg("Las contraseñas nuevas no coinciden.");
      return;
    }

    setIsChangingPw(true);

    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change_password",
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al actualizar contraseña.");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPwSuccessMsg("¡Contraseña de administración actualizada con éxito!");
      setTimeout(() => setPwSuccessMsg(null), 5000);
    } catch (err: unknown) {
      setPwErrorMsg(err instanceof Error ? err.message : "Error al cambiar la contraseña.");
    } finally {
      setIsChangingPw(false);
    }
  };

  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasLetter = /[a-zA-Z]/.test(newPassword);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Barra Superior Fija */}
      <div className="sticky top-[58px] sm:top-[68px] z-30 bg-slate-100/95 backdrop-blur-md py-2.5 sm:py-3.5 mb-2 sm:mb-4 border-b border-slate-200/80 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-xl font-heading font-black tracking-tight text-slate-900 uppercase">
              Seguridad
            </h1>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Control de Acceso Activo</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden md:block">
            Administra la lista blanca de personal autorizado y actualiza la contraseña de acceso al panel.
          </p>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tarjeta 1: Whitelist de Correos */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Lista Blanca de Correos
                </h2>
                <p className="text-[11px] text-slate-500">
                  Solo los correos registrados podrán acceder al panel.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {whitelist.length} autorizado(s)
            </span>
          </div>

          {/* Formulario para agregar nuevo correo */}
          <form onSubmit={handleAddEmail} className="flex gap-2">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="nuevo.empleado@gmail.com"
              disabled={isAddingEmail}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900"
            />
            <button
              type="submit"
              disabled={isAddingEmail || !newEmail.trim()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isAddingEmail ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <UserPlus className="w-3.5 h-3.5" />
              )}
              <span>Autorizar</span>
            </button>
          </form>

          {/* Mensajes de feedback */}
          {emailSuccessMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{emailSuccessMsg}</span>
            </div>
          )}
          {emailErrorMsg && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>{emailErrorMsg}</span>
            </div>
          )}

          {/* Lista de correos autorizados */}
          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-72 overflow-y-auto bg-slate-50/50">
            {isLoadingList ? (
              <div className="p-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Cargando lista blanca...</span>
              </div>
            ) : whitelist.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No hay correos en la lista blanca.
              </div>
            ) : (
              whitelist.map((email) => {
                const isCurrent = email === currentSessionEmail.toLowerCase();
                const canDelete = whitelist.length > 1;

                return (
                  <div
                    key={email}
                    className="p-3 flex items-center justify-between gap-2 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-xs font-medium text-slate-800 truncate">
                        {email}
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          Tu sesión
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={!canDelete}
                      onClick={() => handleRemoveEmail(email)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        canDelete
                          ? "text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          : "text-slate-300 cursor-not-allowed opacity-50"
                      }`}
                      title={
                        canDelete
                          ? `Revocar acceso a ${email}`
                          : "Debe permanecer al menos un correo autorizado"
                      }
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Tarjeta 2: Cambio de Contraseña */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Contraseña de Administración
              </h2>
              <p className="text-[11px] text-slate-500">
                Clave de acceso compartida para el personal autorizado.
              </p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Contraseña Actual *
              </label>
              <div className="relative">
                <input
                  type={showCurrentPw ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 pr-9 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showCurrentPw ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Nueva Contraseña * (Mínimo 8 caracteres)
              </label>
              <div className="relative">
                <input
                  type={showNewPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full px-3 py-2 pr-9 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showNewPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Indicador de robustez */}
              {newPassword && (
                <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                  <span
                    className={`flex items-center gap-1 ${
                      hasMinLength ? "text-emerald-700 font-bold" : "text-slate-400"
                    }`}
                  >
                    <Check className="w-3 h-3" /> 8+ car.
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      hasLetter ? "text-emerald-700 font-bold" : "text-slate-400"
                    }`}
                  >
                    <Check className="w-3 h-3" /> Letras
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      hasNumber ? "text-emerald-700 font-bold" : "text-slate-400"
                    }`}
                  >
                    <Check className="w-3 h-3" /> Números
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Confirmar Nueva Contraseña *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la nueva contraseña"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900"
              />
            </div>

            {/* Mensajes de feedback */}
            {pwSuccessMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{pwSuccessMsg}</span>
              </div>
            )}
            {pwErrorMsg && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>{pwErrorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isChangingPw || !currentPassword || !newPassword || !confirmPassword}
              className="w-full py-2 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isChangingPw ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
              <span>Actualizar Contraseña de Acceso</span>
            </button>
          </form>
        </div>
      </div>

      {/* Tarjeta 3: Resumen de Protecciones Activas */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3 text-xs text-slate-600">
        <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
        <div className="text-[11px] leading-relaxed">
          <strong>Protecciones activas del servidor:</strong> Bloqueo automático por 15 minutos tras 5 intentos fallidos (Rate Limiting por IP), sesiones criptográficas firmadas con HMAC-SHA256 y autenticación en 2 pasos.
        </div>
      </div>
    </div>
  );
}
