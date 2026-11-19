# Ideas y Módulos Pendientes para el Panel Admin — Chavonauta

Este documento recopila las propuestas de funcionalidades y pestañas para el panel de administración (`/admin`), diseñadas para el modelo de escaparate digital y catálogo interactivo de **Cybercafé Chavonauta**.

---

## Ideas en Cartera (Backlog)

### 1. Pestaña: Estadísticas del Escaparate
- **Propósito:** Métricas analíticas de interacción directa y demanda comercial para el dueño del negocio.
- **Funcionalidades Clave:**
  - Contador de consultas a WhatsApp y desglose por servicio o producto.
  - Registro de términos buscados por los clientes en el catálogo digital.
  - Radar de oportunidad: detección de términos sin resultados en catálogo para identificar demanda de stock o nuevos servicios.
  - Clics a ubicación de Google Maps ("Cómo llegar").
  - Exportación de reporte a archivo CSV y reinicio de métricas por periodo.

### 2. Pestaña: Promociones & Banners Temporales
- **Propósito:** Gestión dinámica de ofertas temporales sin tocar código.
- **Funcionalidades Clave:**
  - Creación de avisos con vigencia o temporizador (ej. *"Paquete Estudiante: 50 copias + 1 hr de internet"* o *"Viernes de retas en consolas"*).
  - Avisos especiales de horarios en días festivos (ej. *"Hoy abrimos de 10:00 a 16:00"*).
  - Activación/desactivación en 1 clic de banners destacados en el escaparate.

### 3. Pestaña: Tarifario Exprés de Servicios Rápidos
- **Propósito:** Actualización veloz de micro-servicios cuyos precios fluctúan con frecuencia.
- **Funcionalidades Clave:**
  - Tabla compacta tipo hoja de cálculo para editar en segundos:
    - Impresión B/N y Color (por hoja/volumen).
    - Tabloides, enmicados y engargolados.
    - Escaneo de documentos.
    - Trámites oficiales en línea (CURP, RFC, actas de nacimiento).
  - Evita tener que abrir el formulario completo de cada producto en el catálogo.

### 4. Pestaña: Preguntas Frecuentes (FAQ)
- **Propósito:** Resolver dudas recurrentes antes de que los clientes pregunten por WhatsApp o acudan a mostrador.
- **Funcionalidades Clave:**
  - CRUD simple de preguntas y respuestas desplegables (acordeón).
  - Ejemplos típicos:
    - *¿Puedo enviar archivos a imprimir por WhatsApp o correo?*
    - *¿Qué especificaciones y juegos tienen las PCs de renta?*
    - *¿Cuáles son los requisitos para rentar una consola?*
    - *¿Cuentan con paquetería de Office y software especializado?*

### 5. Pestaña: Reseñas y Testimonios
- **Propósito:** Prueba social (*social proof*) para generar confianza inmediata en nuevos visitantes.
- **Funcionalidades Clave:**
  - Agregar comentarios de clientes reales (estudiantes, gamers, usuarios de trámites).
  - Calificación en estrellas (1-5) y mención de servicio utilizado.
  - Activación o moderación para mostrarse en una sección destacada del escaparate.

### 6. Pestaña / Herramienta: Respaldo y Datos (Backup JSON)
- **Propósito:** Seguridad y autogestión sin soporte técnico.
- **Funcionalidades Clave:**
  - Botón *"Descargar Copia de Seguridad"* en un archivo JSON descargable en 1 clic.
  - Botón *"Restaurar Copia de Seguridad"* para revertir cualquier cambio accidental en catálogo o tema.
