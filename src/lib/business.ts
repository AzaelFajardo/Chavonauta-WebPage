import { BusinessInfo } from "@/types";

/**
 * Texto visible del WhatsApp. Usa el número formateado si está configurado
 * y cae al número técnico en caso contrario.
 */
export function getWhatsAppDisplay(business: BusinessInfo): string {
  return business.whatsappDisplay?.trim() || business.whatsappNumber;
}
