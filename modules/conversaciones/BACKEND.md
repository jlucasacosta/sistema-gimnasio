# Backend — Conversaciones
> Asume BACKEND_RULES.md.

- Tablas: conversaciones, mensajes
- Ingreso: webhook de WhatsApp (Meta) -> Route Handler -> insert en mensajes
- Realtime: suscribir a mensajes para inbox en vivo
- Job (pg-boss): reintento de envío fallido
- Reemplazar: modules/conversaciones/api.ts. Misma firma.
- Error de carga: `getThreads` y `getMessages` lanzan `Error`; la lista y el hilo abierto muestran "Reintentar" por separado (`useCarga`).
- Enviar: hoy el mensaje solo se agrega en pantalla ("Demo: no se guardó nada"). Con backend, `insert` en `mensajes` + envío por WhatsApp; el mensaje enviado llega por Realtime.
