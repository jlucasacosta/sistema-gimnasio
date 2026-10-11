# Backend — Configuración
> Asume BACKEND_RULES.md.

- El diseño (theme) es estatico en shell/theme.ts: no necesita backend.
- Si se quieren settings por usuario: tabla settings (user_id, key, value).
- Capacidad del club, horarios, salas y coaches: `club_config` (+ `coaches`). El panel lee la capacidad de ahí: es la única fuente.
- Error de carga: `getConfigClub` lanza `Error`; la pantalla muestra "Reintentar" (`useCarga`).
