# Backend — Ventas (membresías)
> Asume BACKEND_RULES.md.

- Tablas: planes (nombre, precio, duracion), membresias (socio_id, plan_id, inicio, vencimiento), cobros (membresia_id, medio, total, fecha)
- La cuota "vencida" se deriva de membresias.vencimiento < now().
- Job (pg-boss): cobro recurrente por débito automático + aviso de vencimiento a 7 y 1 día.
- Alimenta dashboard (MRR, bajas, cuota promedio).
- Reemplazar: modules/ventas/api.ts. Misma firma.
- Una membresía `congelado` no tiene cobro ni días para vencer: `dias` y `cobro` llegan en `null` y la UI muestra "—". `descongela` trae la fecha en que se reactiva (`membresias.congelada_hasta`).
- "Por vencer" = faltan 7 días o menos (`theme.porVencerDias`); el job que marca `por-vencer` usa el mismo número.
- Ficha de la membresía (clic en la fila): datos de la fila y acciones de demo ("Reintentar cobro", "Registrar pago", "Renovar membresía", "Enviar recordatorio de pago", "Congelar", "Descongelar"). En el sistema real cada una es un endpoint con su propio permiso y registro.
- Error de carga: `getMembresias` lanza `Error`; la pantalla muestra "Reintentar" (`useCarga`).
