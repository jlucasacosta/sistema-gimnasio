# Backend — Agenda (clases)
> Asume BACKEND_RULES.md.

- Tablas: clases (nombre, inicio, fin, coach_id, sala, cupo), inscripciones (clase_id, socio_id)
- El estado (abierta / completa) se deriva: count(inscripciones) vs cupo.
- Job (pg-boss): recordatorio 2h antes -> WhatsApp/email. Liberar cupo si no hay check-in.
- Evitar sobrecupo con constraint + transaccion al inscribir.
- Reemplazar: modules/agenda/api.ts. Misma firma.
