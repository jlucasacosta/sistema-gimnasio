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
| **dashboard** | **board** | Comando de recepción. Hero-number de aforo del club gigante ("84/120" en IBM Plex Mono, latiendo) arriba; debajo el **Ocupación de clases** full-width (estrella); sparkline línea-área de ocupación por hora con marcador "ahora". Sin la fila de 4 stat-tiles (eliminada). |
| **agenda (clases)** | **timeline** | *"Clases de hoy"*: sesiones apiladas como FILAS ordenadas por hora. Cada fila: hora en mono, nombre de clase (Space Grotesk), coach, chip de estado, y una **barra de cupo gorda (24px+)** con contador hero "16/20". Es la pantalla que manda. Ordena por HORA pero el ojo lee LLENADO. Único: nadie más apila filas de aforo. |
| **ventas (membresías)** | **lista-ticket** *(VETO aplicado: era kanban)* | Cola de vencimientos y recupero de morosos. Lista densa tipo bandeja: cada ticket = socio + plan + días para vencer + chip (Activo / Por vencer / Vencido / Congelado) + monto MRR en mono. Ordenable por urgencia. Saca el clon de barbería (que usa kanban) y da el 2º pairing único. |
| **contactos (socios)** | **tabla-densa** | Roster. Recepción escanea/ordena cientos de socios por estado y vencimiento. Columnas compactas: nombre, plan, estado (pill), último check-in, vencimiento. Barra-búsqueda dominante arriba para encontrar al socio al instante. |
| **conversaciones** | **master-detail** | Lista de hilos a la izquierda, conversación abierta a la derecha. Base; alimenta, no gobierna. |
| **config** | **acordeon** | Secciones colapsables (marca, horarios, planes, coaches, integraciones). Base. |

## 7. KPI / gráfico / iconos / estructura de página

- **KPI = hero-number** — aforo gigante en vivo "84/120" latiendo, en IBM Plex Mono. Se eliminó la grilla de stat-tiles: en un gym la única métrica "ahora" es el aforo.
- **GRÁFICO = línea-área** — curva de ocupación por franja horaria, con franja pico marcada y marcador "ahora". Combo hero-number + línea-área que ningún otro sistema usa.
- **ICONOS = lucide-fino** — línea atlética; distinto del vecino barbería (sin-iconos).
- **ESTRUCTURA = barra-búsqueda-dominante** — buscar socio al instante en mostrador es el gesto #1.

## 8. Componente estrella — "Ocupación de clases"

*(VETO aplicado: reemplaza al "Pulso de Sala"/mapa-SVG, que colisionaba con el Mapa de Cartera de inmobiliaria — firma reservada de ese nicho.)*

Panel full-width en el dashboard (y es el corazón visual de la agenda). **Barras de aforo gigantes apiladas**, una fila por clase del bloque actual/próximo:

- **6-7 filas full-bleed** apiladas verticalmente, sin sidebar visible al grabar en 9:16.
- Cada fila: contador **hero "16/20"** en IBM Plex Mono condensado + **barra horizontal de 24px+ de alto** cuyo relleno crece con el % de aforo.
- **Color del relleno desde `theme.ts`** por umbrales: `<60%` cian (hay espacio), `60-85%` volt-lime (casi lleno), `>85%` magenta. Al tocar el tope el chip flipea a **"COMPLETO"** en magenta **pulsante** y aparece contador de lista de espera ("+3 waitlist").
- Nombre de clase (Space Grotesk) + coach + hora en mono a la izquierda de la barra.

**Momento que se graba (el clip):** se reserva un lugar → la barra salta de 16 a 20 de un tirón, se llena hasta el borde, cambia de volt a magenta, y el chip flipea a **COMPLETO latiendo**. Exagerado para 9:16 a 2x: contador "20/20" enorme, saturación alta, un solo estado en rojo-magenta latiendo para que el ojo caiga ahí. Todo el color sale de `theme.ts`. Nadie más apila barras de aforo como marcador de estadio.

## 9. Componente eliminado

**La fila de stat-tiles 4-up del dashboard.** En un gym la única métrica "ahora" es el aforo; la grilla de cuatro tarjetitas era ruido. Se reemplaza por hero-number (aforo del club) + Ocupación de clases.

## 10. Frame-firma

Barras de aforo gigantes apiladas ocupando toda la pantalla; un **"20/20 COMPLETO"** en magenta latiendo mientras otra barra salta de 16 a 20 y se llena hasta el borde. El ojo lee "lleno vs vacío", no "quién a qué hora".

## 11. Veredicto

**VETADO → CORREGIDO.** Se aplicaron los dos fixes del Abogado del Diablo: (1) estrella pasa de *mapa Pulso-de-Sala* a **Ocupación de clases** (barras de aforo), eliminando la colisión de firma con el Mapa de Cartera de inmobiliaria; (2) **ventas** pasa de *kanban* a **lista-ticket**, sacando el clon de barbería y sumando el 2º arquetipo de datos único exigido. Con esto: arquetipos únicos = agenda:timeline + ventas:lista-ticket; combo KPI+gráfico único (hero-number + línea-área); iconos lucide-fino ≠ barbería; estrella que nadie tiene. PIEL cumple >=3 contra cada sistema. APROBADO para codear.

## 12. Diferencias vs sistemas ya decididos

- **vs inmobiliaria** (light/sidebar/outlined/sharp/compact/square · Fraunces/Inter · verde-tierra + terracota · Mapa de Cartera): comparte nav y varias palancas de chasis pero difiere en mode (dark), badge (pill), fuentes (Space Grotesk/IBM Plex Mono) y color (cobalto/volt frío). La firma NO es un mapa — es la Ocupación de clases en barras; el mapa queda reservado a inmobiliaria.
- **vs restaurante** (dark/rail/raised/round/comfortable/pill · Archivo/Manrope · brasa-ámbar): ambos dark, pero acá es dark FRÍO de acero vs caliente de brasa; difiere en nav, elevation, radius, density, fuentes y color (6 palancas). El riel del restó envejece por tiempo/temperatura; la Ocupación de clases del gym se llena por aforo.
- **vs barbería** (light/topbar/flat/soft/comfortable/square · Bebas_Neue/DM_Sans · oxblood; agenda:grilla-semana, ventas:kanban): 8/8 palancas distintas. Corte de agenda: barbería encabeza COLUMNAS con personas y ordena por TIEMPO; gym apila FILAS y ordena por LLENADO. Ventas dejó de ser kanban (era clon) y pasó a lista-ticket. Iconos lucide-fino vs sin-iconos.

---

## 13. Nota 2026-10-11 — corrección tras la crítica de Impeccable (decisión de Lucas)

Lucas pidió sistemas "más profesionales, como sistemas normales, tipo dashboard-CRM", sin animaciones decorativas. La identidad (paleta, tipografía, palancas de §5) NO cambió. Cambió el movimiento y la operación:

- **Movimiento.** Las descripciones de "latiendo", "pulsante", "respira", "las barras saltan" y "la cinta corre sola" de §4, §6, §8 y §10 quedan reemplazadas por esto: la clase COMPLETA lleva un **anillo magenta fijo**, el número de aforo no respira, las barras reflejan el valor sin transición y la cinta de telemetría es una **lista estática** (en celular se desplaza con el dedo). El reloj de aforo sigue sumando una persona cada 3,5 s: cambian los números y el color por umbral, sin animación. Los esqueletos de carga son estáticos.
- **Operación.** Clases, Membresías y Socios abren una **ficha lateral** (datos de la fila + 2-3 acciones de demo que no guardan nada). Estados de carga con `—` y esqueleto, y aviso de error con "Reintentar" (`shell/carga.tsx`).
- **Escala de ocupación explicada.** Una leyenda junto a los gráficos lee los umbrales de `theme.aforo`: cian "con lugar", volt "casi lleno", magenta "últimos lugares", y COMPLETO al llegar al tope. El chip de cada fila muestra ese rótulo en texto en lugar de repetir el porcentaje de la barra.
- **Color sin contradicciones.** Magenta (`danger`) = lleno / vencido / rechazado (§4, sin cambios): una clase cancelada **ya no es magenta**. Estados de clase: programada = contorno, en curso = relleno cobalto, finalizada y cancelada = neutros. Una membresía o socio congelado no muestra días para vencer ni cobro (`—`).
- **Excepción gris-sobre-gris (pedida acá, como exige `CLAUDE.md`):** los chips neutros por diseño "finalizada" y "cancelada" van en `text-muted` sobre `bg-subtle`, con rótulo de texto y contraste 4.63:1.
- **Datos.** La capacidad del club ya no está duplicada: vive en `modules/config/data.json` (`theme.cupoClub` se eliminó). Las clases del termómetro del panel salen de la agenda. Se agregó el estado de clase `finalizada` y las clases pasadas lo usan.
- **Texto.** Ningún texto con datos baja de 12 px. El menú del panel se llama "Panel" (igual que su título). En celular la tira de navegación avisa con un degradé que hay más secciones y centra la activa; en escritorio el menú es fijo y lleva la cuenta demo.
