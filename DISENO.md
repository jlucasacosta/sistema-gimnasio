# Ficha de Diseño — Forja Athletic Club (gimnasio)

> Sistema demo frontend (Next.js + Tailwind, mock data) para grabar contenido.
> Objetivo: RECONOCIBLE y distinto de inmobiliaria, restaurante y barbería.
> Esta ficha ya aplica el VETO del Abogado del Diablo (estrella y ventas corregidos).

---

## 1. Marca

**Forja Athletic Club** — gimnasio boutique. Voz: entrenador-ingeniero, seco y preciso, sin arenga. La app se lee como el display de una máquina de telemetría, no como un CRM.

## 2. Usuario y contexto

Recepción en hora pico (6-9h y 18-22h). Cola de socios entrando, mochila al hombro, el operador con una mano en el mostrador y la otra tildando ingresos. Mira de reojo, no lee párrafos. La tarea que repite 40+ veces por día es el **check-in**: escanea socio → ¿membresía activa o vencida? → ¿tiene clase reservada ahora y hay cupo? Dos colores, una respuesta en menos de un segundo. Si el dato llega tarde: entra un moroso gratis (plata que se fuga) o una clase se sobre-vende y el coach queda con 22 personas en una sala de 16. El cupo es físico: no hay "un poco más".

## 3. La pantalla que manda

**AGENDA (clases).** El gimnasio boutique se organiza por bloques horarios; cada clase es un recipiente con capacidad dura, lista de espera y coach asignado. Todo el día gira alrededor de "¿cuánto lleno está el próximo turno?". Ocupación por clase, no-shows y waitlist mandan. Ventas (membresías) es el dinero pero se mira 3 veces al día, no 40; conversaciones y contactos alimentan, no gobiernan.

## 4. Dirección de arte

**Cliché rechazado:** el gimnasio-gasolinera — negro sobre verde-neón "beast mode", fotos de músculos, tipografía inflada tipo bote de suplemento. Grita y no dice nada, y ya hay un dark caliente (restaurante).

**Concepto:** telemetría de rendimiento, no jaula de hierro. El piso arranca 6am y cierra 22hs con pantallas encendidas en sala en penumbra → **dark FRÍO de acero**, el extremo opuesto del ámbar incandescente del restaurante. Bordes finos de acero, mucho aire negativo, números GRANDES en mono como marcador de estadio. Cero fotos de gente entrenando: solo dato, ritmo y acero.

**Color (contradicción resuelta):** base grafito / negro-acero. **Primary cobalto-ultramar `#2547E6` se usa SOLO como fill** (barras, zonas, rellenos) — nunca como texto sobre near-black porque queda turbio. **Accent lima-voltio `#C6F24E`** reservadísimo: solo se enciende cuando una meta se cumple, un aforo se llena o cae un récord; el lima señala logro, no decora. Semánticos de aforo: **cian = espacio/recuperado**, **volt = casi lleno**, **magenta = lleno/vencido (pulsa)**. Sin ámbar (restó), sin verde-tierra (inmob), sin oxblood (barbería). Único sistema con azul saturado.

## 5. Palancas del theme (PIEL)

| Palanca | Valor | Por qué |
|---|---|---|
| mode | **dark** | sala en penumbra, pantallas encendidas; dark frío de acero |
| nav | **sidebar** | 6 módulos + uso de mostrador; navegación fija |
| elevation | **outlined** | marcos de acero a 1px, cero sombra: chasis técnico |
| radius | **sharp** | cantos mecanizados, forjados |
| density | **compact** | pantalla-tablero: mucho dato vivo de un vistazo |
| badge | **pill** | chips de estado tipo app fitness (activo / por vencer) |
| fuentes | **Space_Grotesk / IBM_Plex_Mono** | display atlético-técnico + mono para TODO número (aforo, kg, %, streak) = voz de gauge/telemetría |
| color | grafito + cobalto (fill) + volt-lime (logro) + cian/magenta (aforo) | único azul saturado del set |

**Diferenciación PIEL:** vs inmobiliaria 4 (mode, badge, fuentes, color) · vs restaurante 6 (nav, elev, radius, density, fuentes, color) · vs barbería 8/8. Cumple >=3 contra cada uno.

## 6. Módulos → arquetipos

| Módulo | Arquetipo | Componentes, tamaños, qué se ve |
|---|---|---|
| **dashboard** | **board** | Comando de recepción. Hero-number de aforo del club gigante ("84/120" en IBM Plex Mono, latiendo) arriba; debajo el **Termómetro de Cupos** full-width (estrella); sparkline línea-área de ocupación por hora con marcador "ahora". Sin la fila de 4 stat-tiles (eliminada). |
| **agenda (clases)** | **timeline** | *"Riel de clases de hoy"*: sesiones apiladas como FILAS ordenadas por hora. Cada fila: hora en mono, nombre de clase (Space Grotesk), coach, chip de estado, y una **barra de cupo gorda (24px+)** con contador hero "16/20". Es la pantalla que manda. Ordena por HORA pero el ojo lee LLENADO. Único: nadie más apila filas de aforo. |
| **ventas (membresías)** | **lista-ticket** *(VETO aplicado: era kanban)* | Cola de vencimientos y recupero de morosos. Lista densa tipo bandeja: cada ticket = socio + plan + días para vencer + chip (Activo / Por vencer / Vencido / Congelado) + monto MRR en mono. Ordenable por urgencia. Saca el clon de barbería (que usa kanban) y da el 2º pairing único. |
| **contactos (socios)** | **tabla-densa** | Roster. Recepción escanea/ordena cientos de socios por estado y vencimiento. Columnas compactas: nombre, plan, estado (pill), último check-in, vencimiento. Barra-búsqueda dominante arriba para encontrar al socio al instante. |
| **conversaciones** | **master-detail** | Lista de hilos a la izquierda, conversación abierta a la derecha. Base; alimenta, no gobierna. |
| **config** | **acordeon** | Secciones colapsables (marca, horarios, planes, coaches, integraciones). Base. |

## 7. KPI / gráfico / iconos / estructura de página

- **KPI = hero-number** — aforo gigante en vivo "84/120" latiendo, en IBM Plex Mono. Se eliminó la grilla de stat-tiles: en un gym la única métrica "ahora" es el aforo.
- **GRÁFICO = línea-área** — curva de ocupación por franja horaria, con franja pico marcada y marcador "ahora". Combo hero-number + línea-área que ningún otro sistema usa.
- **ICONOS = lucide-fino** — línea atlética; distinto del vecino barbería (sin-iconos).
- **ESTRUCTURA = barra-búsqueda-dominante** — buscar socio al instante en mostrador es el gesto #1.

## 8. Componente estrella — "Termómetro de Cupos"

*(VETO aplicado: reemplaza al "Pulso de Sala"/mapa-SVG, que colisionaba con el Mapa de Cartera de inmobiliaria — firma reservada de ese nicho.)*

Panel full-width en el dashboard (y es el corazón visual de la agenda). **Barras de aforo gigantes apiladas**, una fila por clase del bloque actual/próximo:

- **6-7 filas full-bleed** apiladas verticalmente, sin sidebar visible al grabar en 9:16.
- Cada fila: contador **hero "16/20"** en IBM Plex Mono condensado + **barra horizontal de 24px+ de alto** cuyo relleno crece con el % de aforo.
- **Color del relleno desde `theme.ts`** por umbrales: `<60%` cian (hay espacio), `60-85%` volt-lime (casi lleno), `>85%` magenta. Al tocar el tope el chip flipea a **"COMPLETO"** en magenta **pulsante** y aparece contador de lista de espera ("+3 waitlist").
- Nombre de clase (Space Grotesk) + coach + hora en mono a la izquierda de la barra.

**Momento que se graba (el clip):** se reserva un lugar → la barra salta de 16 a 20 de un tirón, se llena hasta el borde, cambia de volt a magenta, y el chip flipea a **COMPLETO latiendo**. Exagerado para 9:16 a 2x: contador "20/20" enorme, saturación alta, un solo estado en rojo-magenta latiendo para que el ojo caiga ahí. Todo el color sale de `theme.ts`. Nadie más apila barras de aforo como marcador de estadio.

## 9. Componente eliminado

**La fila de stat-tiles 4-up del dashboard.** En un gym la única métrica "ahora" es el aforo; la grilla de cuatro tarjetitas era ruido. Se reemplaza por hero-number (aforo del club) + Termómetro de Cupos.

## 10. Frame-firma

Barras de aforo gigantes apiladas ocupando toda la pantalla; un **"20/20 COMPLETO"** en magenta latiendo mientras otra barra salta de 16 a 20 y se llena hasta el borde. El ojo lee "lleno vs vacío", no "quién a qué hora".

## 11. Veredicto

**VETADO → CORREGIDO.** Se aplicaron los dos fixes del Abogado del Diablo: (1) estrella pasa de *mapa Pulso-de-Sala* a **Termómetro de Cupos** (barras de aforo), eliminando la colisión de firma con el Mapa de Cartera de inmobiliaria; (2) **ventas** pasa de *kanban* a **lista-ticket**, sacando el clon de barbería y sumando el 2º arquetipo de datos único exigido. Con esto: arquetipos únicos = agenda:timeline + ventas:lista-ticket; combo KPI+gráfico único (hero-number + línea-área); iconos lucide-fino ≠ barbería; estrella que nadie tiene. PIEL cumple >=3 contra cada sistema. APROBADO para codear.

## 12. Diferencias vs sistemas ya decididos

- **vs inmobiliaria** (light/sidebar/outlined/sharp/compact/square · Fraunces/Inter · verde-tierra + terracota · Mapa de Cartera): comparte nav y varias palancas de chasis pero difiere en mode (dark), badge (pill), fuentes (Space Grotesk/IBM Plex Mono) y color (cobalto/volt frío). La firma NO es un mapa — es el Termómetro de barras; el mapa queda reservado a inmobiliaria.
- **vs restaurante** (dark/rail/raised/round/comfortable/pill · Archivo/Manrope · brasa-ámbar): ambos dark, pero acá es dark FRÍO de acero vs caliente de brasa; difiere en nav, elevation, radius, density, fuentes y color (6 palancas). El riel del restó envejece por tiempo/temperatura; el termómetro del gym se llena por aforo.
- **vs barbería** (light/topbar/flat/soft/comfortable/square · Bebas_Neue/DM_Sans · oxblood; agenda:grilla-semana, ventas:kanban): 8/8 palancas distintas. Corte de agenda: barbería encabeza COLUMNAS con personas y ordena por TIEMPO; gym apila FILAS y ordena por LLENADO. Ventas dejó de ser kanban (era clon) y pasó a lista-ticket. Iconos lucide-fino vs sin-iconos.
