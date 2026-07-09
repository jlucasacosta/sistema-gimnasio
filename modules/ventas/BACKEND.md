# Backend — Ventas (membresias)
> Asume BACKEND_RULES.md.

- Tablas: planes (nombre, precio, duracion), membresias (socio_id, plan_id, inicio, vencimiento), cobros (membresia_id, medio, total, fecha)
- La cuota "vencida" se deriva de membresias.vencimiento < now().
- Job (pg-boss): cobro recurrente por debito automatico + aviso de vencimiento a 7 y 1 dia.
- Alimenta dashboard (MRR, bajas, cuota promedio).
- Reemplazar: modules/ventas/api.ts. Misma firma.
