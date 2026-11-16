"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  Sparkles,
} from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  placeholderText?: string;
}

export function ImageUploader({
  value,
  onChange,
  label = "Logotipo de la Tienda",
  helperText = "Sube tu logotipo en formato PNG, JPG, SVG, WEBP, GIF o AVIF (hasta 10 MB).",
  placeholderText = "Arrastra tu imagen aquí o haz clic para seleccionarla",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setErrorMessage(null);

    // Validación básica de imagen
    if (!file.type.startsWith("image/")) {
      setErrorMessage(
        "Por favor selecciona un archivo de imagen válido (PNG, JPG, SVG, WEBP, GIF, AVIF, etc.)."
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("La imagen seleccionada supera el límite de 10 MB.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Error al subir la imagen al servidor.");
      }

      const data = await response.json();
      if (data.url) {
        onChange(data.url);
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Error al subir el archivo."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-semibold text-slate-700">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[10px] font-semibold text-navy-800 hover:text-navy-900 flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? "Usar archivo" : "Usar URL directa"}</span>
        </button>
      </div>

      {/* Si se opta por URL directa */}
      {showUrlInput ? (
        <div className="space-y-1.5">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 text-slate-800"
          />
          <p className="text-[10px] text-slate-400">
            Ingresa una URL pública válida de tu imagen.
          </p>
        </div>
      ) : (
        <>
          {/* Zona Drag & Drop / Selección de Archivo */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
              isDragOver
                ? "border-navy-600 bg-navy-50/70"
                : "border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />

            {isUploading ? (
              <div className="py-2 flex flex-col items-center justify-center space-y-2">
                <div className="w-6 h-6 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold text-slate-700">
                  Subiendo y procesando imagen...
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-1.5">
                <div className="w-9 h-9 rounded-xl bg-navy-50 text-navy-800 flex items-center justify-center shadow-2xs">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-slate-800">
                  {placeholderText}
                </div>
                <p className="text-[10px] text-slate-400">
                  Formatos válidos: PNG, JPG, SVG, WEBP, GIF, AVIF (Máx. 10 MB)
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {errorMessage && (
        <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Previsualización del Logotipo actual con opción para quitarlo */}
      {value && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-16 h-12 bg-white rounded-lg border border-slate-200 p-1 flex items-center justify-center overflow-hidden shadow-2xs">
              <img
                src={value}
                alt="Logotipo cargado"
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/120x60?text=Error+Logo";
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800">
                  Logotipo Activo
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-[10px] text-slate-500 font-mono truncate max-w-xs">
                {value}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Quitar logotipo (se usará texto tipográfico)"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      <p className="text-[11px] text-slate-400 leading-relaxed">
        {helperText}
      </p>
    </div>
  );
}
