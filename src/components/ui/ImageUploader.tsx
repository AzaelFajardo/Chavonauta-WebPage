"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  placeholderText?: string;
  compact?: boolean;
}

export function ImageUploader({
  value,
  onChange,
  label,
  helperText = "Sube una imagen desde tu equipo en formato PNG, JPG, JFIF, WEBP, GIF, AVIF o SVG (hasta 10 MB).",
  placeholderText = "Arrastra 1 imagen aquí o haz clic para seleccionarla desde tu equipo",
  compact = false,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setErrorMessage(null);

    // Validación permisiva de tipos de imagen (incluyendo jfif, webp, avif, etc.)
    const isImage =
      file.type.startsWith("image/") ||
      /\.(jpe?g|png|webp|gif|jfif|avif|bmp|svg|ico)$/i.test(file.name);

    if (!isImage) {
      setErrorMessage(
        "Por favor selecciona un archivo de imagen válido (PNG, JPG, JFIF, WEBP, GIF, AVIF, etc.)."
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
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (files.length > 1) {
      setErrorMessage("Solo se permite cargar 1 archivo a la vez.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    handleFile(files[0]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    if (files.length > 1) {
      setErrorMessage("Solo puedes cargar 1 archivo a la vez.");
      return;
    }

    handleFile(files[0]);
  };

  const handleRemove = () => {
    onChange("");
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (compact) {
    return (
      <div className="space-y-1.5">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.jfif,.avif,.bmp,.svg,.ico"
          multiple={false}
          onChange={handleInputChange}
          className="hidden"
        />

        {label && (
          <label className="block text-[10px] font-semibold text-slate-700">
            {label}
          </label>
        )}

        {isUploading ? (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
            <span className="text-[11px]">Subiendo imagen...</span>
          </div>
        ) : value ? (
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-10 h-8 rounded bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                <img
                  src={value}
                  alt={label || "Imagen"}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <span className="text-[10px] font-mono text-slate-500 truncate max-w-[130px]">
                {value.split("/").pop()}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2 py-1 text-[10px] font-semibold rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
                title="Cambiar imagen"
              >
                Cambiar
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Eliminar imagen"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-1.5 p-2 rounded-lg border border-dashed border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50/50 text-slate-600 hover:text-blue-700 text-[11px] font-semibold transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>Seleccionar imagen desde tu equipo</span>
          </button>
        )}

        {errorMessage && (
          <p className="text-[10px] text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{errorMessage}</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.jfif,.avif,.bmp,.svg,.ico"
        multiple={false}
        onChange={handleInputChange}
        className="hidden"
      />

      {label && (
        <label className="block text-[11px] font-semibold text-slate-700">
          {label}
        </label>
      )}

      {isUploading ? (
        <div className="border border-slate-200 bg-slate-50/80 rounded-xl p-5 flex flex-col items-center justify-center space-y-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-700">
            Subiendo y procesando imagen...
          </span>
        </div>
      ) : value ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-16 h-12 bg-white rounded-lg border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
              <img
                src={value}
                alt={label || "Imagen"}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/120x60?text=Error";
                }}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-800 truncate">
                  {label || "Imagen"} Cargada
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </div>
              <p className="text-[11px] text-slate-500 font-mono truncate max-w-xs sm:max-w-md mt-0.5">
                {value.split("/").pop()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Seleccionar otra imagen para reemplazar la actual"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Cambiar imagen</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
              title="Quitar imagen actual"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
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
              ? "border-blue-600 bg-blue-50/70"
              : "border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50"
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-1.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs">
              <Upload className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-slate-800">
              {placeholderText}
            </div>
            <p className="text-[10px] text-slate-400">
              Formatos compatibles: PNG, JPG, JFIF, WEBP, GIF, AVIF, BMP, SVG (Hasta 10 MB)
            </p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {helperText && (
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {helperText}
        </p>
      )}
    </div>
  );
}
