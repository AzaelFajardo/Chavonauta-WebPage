import { AnalyticsEvent } from "@/types";

/**
 * Registra de forma asíncrona y no bloqueante un evento de interacción del usuario
 * en el escaparate digital (clic a WhatsApp, búsqueda, clic a ubicación, vistas).
 */
export function trackAnalyticsEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;

  const payload = JSON.stringify({
    ...event,
    timestamp: new Date().toISOString(),
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      const sent = navigator.sendBeacon("/api/analytics", blob);
      if (sent) return;
    }

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // Silencioso para no interferir con la navegación del usuario
    });
  } catch {
    // Fallback silencioso
  }
}
