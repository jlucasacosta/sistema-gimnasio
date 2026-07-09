# Backend — Contactos (socios)
> Asume BACKEND_RULES.md.

- Tablas: socios (name, phone, email, owner_id), membresias (socio_id, plan_id, vencimiento)
- El campo `plan` y el estado de cuota salen del join con membresias, no se guardan en socios.
- RLS por owner_id.
- Reemplazar: modules/contactos/api.ts. Misma firma.
