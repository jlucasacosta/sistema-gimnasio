# Backend — Dashboard
> Asume BACKEND_RULES.md (stack global). Acá solo lo propio.

- Sin tablas propias: agrega datos de otros módulos (ventas, pipeline, conversaciones).
- Fuente ideal: vistas / materialized views en Supabase.
- Realtime opcional: refrescar KPIs suscribiendo a las tablas fuente.
- Reemplazar: modules/dashboard/api.ts (mock -> queries agregadas). Misma firma.
- La capacidad del club (`cupo`) sale de `club_config.cupo_club`; las clases del termómetro son las de `clases_vista` que están en curso o por empezar (las mismas de Clases).
- Error de carga: las 4 consultas se piden juntas (`Promise.all`); si una falla, la pantalla muestra un solo aviso con "Reintentar" (`useCarga`).
- Telemetría del día: lista estática (no se desplaza sola).
