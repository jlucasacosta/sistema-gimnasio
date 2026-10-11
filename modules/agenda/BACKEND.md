# Backend — Agenda (clases)
> Asume BACKEND_RULES.md.

- Tablas: clases (nombre, inicio, fin, coach_id, sala, cupo), inscripciones (clase_id, socio_id)
- El estado (abierta / completa) se deriva: count(inscripciones) vs cupo.
- Job (pg-boss): recordatorio 2h antes -> WhatsApp/email. Liberar cupo si no hay check-in.
- Evitar sobrecupo con constraint + transacción al inscribir.
- Reemplazar: modules/agenda/api.ts. Misma firma.
- Estados de la clase: `programada`, `en-curso`, `finalizada`, `cancelada`. El estado cambia con la hora (job pg-boss que pasa a `en-curso` al empezar y a `finalizada` al terminar).
- Ficha de la clase (clic en el bloque): muestra los datos de la fila más lugares libres y ocupación (derivados). Las acciones son de demo: en el sistema real "Reservar clase" llama a `reservar_clase` (RPC; respeta el cupo y devuelve `reservada` o `lista-espera`), "Avisar a la lista de espera" y "Cancelar clase" disparan un job que avisa a los inscriptos.
- Error de carga: `getClasesHoy` lanza `Error`; la pantalla lo captura con `useCarga` y muestra "Reintentar". No hace falta tocar la UI.
