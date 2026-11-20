# Operación y Despliegue — Chavonauta

Guía para instalar, actualizar, respaldar y diagnosticar el escaparate digital en un servidor Ubuntu on-premise con Node.js, SQLite y Cloudflare Tunnel.

---

## 1. Requisitos

- Ubuntu Server 22.04/24.04 (o similar).
- Node.js **22 LTS** (o 24, dentro de `engines`).
- `sqlite3` CLI para respaldos manuales.
- `cloudflared` instalado como servicio.
- Usuario de sistema sin privilegios, por ejemplo `chavonauta`.

```bash
sudo adduser --system --group --home /opt/chavonauta chavonauta
sudo mkdir -p /opt/chavonauta /var/lib/chavonauta/uploads /var/backups/chavonauta
sudo chown -R chavonauta:chavonauta /opt/chavonauta /var/lib/chavonauta /var/backups/chavonauta
```

---

## 2. Variables de entorno

Crear `/etc/chavonauta/chavonauta.env` con permisos `600`:

```env
NODE_ENV=production
ADMIN_JWT_SECRET=<openssl rand -base64 48>
ADMIN_INITIAL_PASSWORD=<solo primera instalación; mínimo 12 caracteres>
ADMIN_BOOTSTRAP_EMAILS=correo1@dominio.com,correo2@dominio.com
DATABASE_PATH=/var/lib/chavonauta/chavonauta.db
UPLOADS_DIR=/var/lib/chavonauta/uploads
SITE_URL=https://tu-dominio.com
BACKUP_DIR=/var/backups/chavonauta
BACKUP_KEEP=14
UPLOADS_MAX_BYTES=1073741824
HOSTNAME=127.0.0.1
PORT=49152
```

Notas:
- `ADMIN_JWT_SECRET` es obligatorio en producción. Si falta, el panel queda inaccesible (el escaparate público sigue funcionando).
- `ADMIN_INITIAL_PASSWORD` solo se usa cuando la tabla `admin_auth` está vacía (primera instalación). Después se cambia desde `/admin/seguridad`.
- Los datos deben vivir **fuera** del directorio de la aplicación para sobrevivir a despliegues y clones limpios.

```bash
sudo chown chavonauta:chavonauta /etc/chavonauta/chavonauta.env
sudo chmod 600 /etc/chavonauta/chavonauta.env
```

---

## 3. Instalación y build

```bash
sudo -u chavonauta git clone --depth 1 --branch main <repo> /opt/chavonauta/releases/$(date +%F-%H%M)
cd /opt/chavonauta/releases/<release>
sudo -u chavonauta npm ci
sudo -u chavonauta npx tsc --noEmit
sudo -u chavonauta npm test
sudo -u chavonauta npm run build
ln -sfn /opt/chavonauta/releases/<release> /opt/chavonauta/current
```

> Ejecuta `npm test` solo con la configuración de pruebas (la suite usa una BD temporal). Nunca apuntes `DATABASE_PATH` de producción al correr pruebas.

El comando `npm start` ya escucha solo en `127.0.0.1:49152`. No cambies el bind salvo que sepas lo que haces.

---

## 4. Servicio systemd

Crear `/etc/systemd/system/chavonauta.service`:

```ini
[Unit]
Description=Chavonauta Web
After=network.target

[Service]
Type=simple
User=chavonauta
Group=chavonauta
WorkingDirectory=/opt/chavonauta/current
EnvironmentFile=/etc/chavonauta/chavonauta.env
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/lib/chavonauta /var/backups/chavonauta
TimeoutStopSec=20

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now chavonauta
sudo systemctl status chavonauta
```

Si se usa `pm2`, ejecutar en modo **fork** (no cluster) para no multiplicar conexiones SQLite; configurar `pm2 startup`, `pm2 save` y `pm2-logrotate`.

---

## 5. Cloudflare Tunnel

```bash
sudo cloudflared service install <TOKEN>
sudo systemctl enable --now cloudflared
```

- El túnel debe apuntar a `http://127.0.0.1:49152`.
- No abras el puerto 49152 en el router ni en `ufw`.
- Configura TLS **Full (strict)** y "Always Use HTTPS" en Cloudflare.
- Crea una regla de caché que excluya `/admin*` y `/api/*`. Si usas "Cache Everything" para HTML, purga la caché después de cada despliegue.

Verificación:

```bash
ss -ltnp | grep 49152      # debe mostrar 127.0.0.1:49152
curl -fsS http://127.0.0.1:49152/api/health
curl -I https://tu-dominio.com
```

---

## 6. Monitoreo y healthcheck

- Healthcheck local: `GET /api/health` (verifica SQLite y escritura en uploads).
- Cron sugerido cada 5 minutos:
  ```bash
  */5 * * * * curl -fsS http://127.0.0.1:49152/api/health >/dev/null || logger -t chavonauta "healthcheck falló"
  ```
- Monitor externo gratuito (UptimeRobot, Better Stack, etc.) apuntando a `https://tu-dominio.com/api/health`, con alerta por correo o WhatsApp.
- Logs: `journalctl -u chavonauta -f` o `pm2 logs`. No registres contraseñas ni tokens.

---

## 7. Respaldos y restauración

### Respaldo programado

```bash
sudo -u chavonauta npm run backup
```

El script:
- Usa la API de backup de SQLite (consistente con WAL).
- Copia `UPLOADS_DIR` a `BACKUP_DIR`.
- Conserva los últimos `BACKUP_KEEP` respaldos.

Cron diario sugerido:

```bash
0 2 * * * cd /opt/chavonauta/current && sudo -u chavonauta npm run backup >> /var/log/chavonauta-backup.log 2>&1
```

Copia los respaldos a otro disco o almacenamiento externo.

### Restauración

```bash
sudo systemctl stop chavonauta
sudo -u chavonauta sqlite3 /var/lib/chavonauta/chavonauta.db ".restore '/var/backups/chavonauta/chavonauta-<fecha>.db'"
# o copiar el archivo respaldado si no existe la BD actual
sudo -u chavonauta rm -rf /var/lib/chavonauta/uploads
sudo -u chavonauta cp -a /var/backups/chavonauta/uploads-<fecha> /var/lib/chavonauta/uploads
sudo systemctl start chavonauta
curl -fsS http://127.0.0.1:49152/api/health
```

Prueba una restauración completa al menos una vez al trimestre en una máquina de staging.

---

## 8. Recuperación de acceso al panel

Si se pierde la contraseña o el correo autorizado:

```bash
cd /opt/chavonauta/current
sudo -u chavonauta npm run admin:recovery -- correo@dominio.com 'NuevaClaveLargaUnica'
```

El script:
- Añade el correo a la whitelist si no estaba.
- Restablece la contraseña con scrypt.
- Invalida las sesiones activas (incrementa la versión de sesión).

Después, iniciar sesión y cambiar la contraseña desde `/admin/seguridad`. No ejecutes este script por HTTP ni lo expongas al público.

---

## 9. Actualizaciones y rollback

1. Respaldo previo:
   ```bash
   sudo -u chavonauta npm run backup
   ```
2. Crear release en directorio nuevo (no hacer `git pull` sobre el directorio activo).
3. `npm ci`, pruebas con BD temporal, `npm run build`.
4. Cambiar el symlink `current` y `systemctl restart chavonauta`.
5. Verificar `/api/health`, inicio, catálogo y login.
6. Si falla, volver al release anterior:
   ```bash
   ln -sfn /opt/chavonauta/releases/<release-anterior> /opt/chavonauta/current
   sudo systemctl restart chavonauta
   ```
7. Purgar la caché HTML de Cloudflare si aplica.

Revisa mensualmente `npm audit` y `npm outdated`. Planifica actualizaciones mayores en una rama y staging.

---

## 10. Diagnóstico rápido

| Síntoma | Revisar |
|---|---|
| El panel no carga / sesión inválida | `ADMIN_JWT_SECRET`, `journalctl -u chavonauta`, `/api/health`, whitelist y versión de sesión. |
| El inicio no refleja cambios | Confirmar que el servicio está corriendo el build actual y que no hay caché de Cloudflare; revisar logs. |
| Imágenes subidas no aparecen | `UPLOADS_DIR`, permisos de escritura, `/uploads/<archivo>` y `/api/health`. |
| Error 503 en healthcheck | Espacio en disco, permisos de `/var/lib/chavonauta`, integridad de SQLite. |
| Base de datos bloqueada | Evitar múltiples procesos en modo cluster; usar modo fork y una sola instancia. |
| Disco lleno | Revisar `UPLOADS_MAX_BYTES`, backups antiguos, logs y WAL; rotar y limpiar. |

Comandos útiles:

```bash
sudo -u chavonauta sqlite3 /var/lib/chavonauta/chavonauta.db "PRAGMA integrity_check;"
sudo -u chavonauta du -sh /var/lib/chavonauta/uploads /var/backups/chavonauta
sudo journalctl -u chavonauta --since "1 hour ago"
```
