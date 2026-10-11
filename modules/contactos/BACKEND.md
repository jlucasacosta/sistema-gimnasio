# Backend — Contactos (socios)
> Asume BACKEND_RULES.md.

- Tablas: socios (name, phone, email, owner_id), membresias (socio_id, plan_id, vencimiento)
- El campo `plan` y el estado de cuota salen del join con membresias, no se guardan en socios.
- RLS por owner_id.
- Reemplazar: modules/contactos/api.ts. Misma firma.
- Un socio con membresía `congelado` no tiene vencimiento corriendo: `vencimiento` llega en `null` (la UI muestra "—") y `descongela` trae la fecha de reactivación.
- Ficha del socio (clic en la fila): datos de la fila y acciones de demo ("Renovar membresía", "Reservar clase", "Congelar", "Enviar recordatorio de pago"). En el sistema real "Reservar clase" llama a `reservar_clase`.
- Error de carga: `getSocios` lanza `Error`; la pantalla muestra "Reintentar" (`useCarga`).
