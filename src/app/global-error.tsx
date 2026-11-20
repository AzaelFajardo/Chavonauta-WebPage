"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          background: "#f8fafc",
          color: "#0f172a",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ maxWidth: "28rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
            No pudimos cargar el sitio
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.6 }}>
            Ocurrió un problema temporal. Intenta de nuevo en unos segundos o
            contacta a la sucursal.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1rem",
              padding: "0.65rem 1rem",
              border: 0,
              borderRadius: "0.75rem",
              background: "#2563eb",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
          <p style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "1rem" }}>
            {error.digest ? `Referencia: ${error.digest}` : ""}
          </p>
        </div>
      </body>
    </html>
  );
}
