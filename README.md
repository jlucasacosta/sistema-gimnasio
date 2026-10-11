# Forja Athletic Club — Sistema para gimnasios

Un sistema de gestion para gimnasios: clases del dia con cupos y lista de espera, membresias y cobros, conversaciones con socios y ficha de socios. Un sistema demo hecho con Next.js.

> Es un demo **frontend** con datos de ejemplo (mock). No tiene backend conectado: sirve para ver cómo se ve y cómo funciona un sistema así, y para aprender a construirlo. Nada de lo que hagas en pantalla se guarda: al refrescar (F5) vuelve todo a los datos originales.

---

## Demo en vivo
👉 https://sistema-gimnasio-zeta.vercel.app

## Sumate al Club de la IA

Aprendé a crear tu Agencia de IA y conseguir tu primer cliente. Eso lo trabajamos adentro del Club de la IA, nuestro Skool privado.

👉 https://www.skool.com/club-de-la-ia-8047/about

---

## Qué incluye
- Dashboard: ocupacion del club en vivo, ocupacion de cada clase del bloque actual (barras que se llenan hasta "COMPLETO"), curva de check-ins por franja y cinta de telemetria del dia
- Clases (agenda del dia en linea de tiempo, con coach, sala, cupo y lista de espera)
- Conversaciones (inbox de socios)
- Membresias (cola de vencimientos y cobros: activo, por vencer, vencido, congelado, y debitos rechazados)
- Socios (tabla con buscador por nombre o documento, plan y estado de cuota)
- Configuracion

## Requisitos (instalá esto primero)

Necesitás dos programas gratis en tu computadora:

1. **Node.js** (versión 18 o mayor). Descargalo en https://nodejs.org y elegí la opción **LTS**.
2. **Git**. Descargalo en https://git-scm.com

Para chequear que quedaron instalados, abrí una terminal y escribí:

    node -v
    git --version

Si te devuelven un número de versión, ya está.

## Cómo clonar y correr (paso a paso)

1. Abrí una terminal en la carpeta donde quieras guardar el proyecto.
2. Cloná el repo:

       git clone https://github.com/jlucasacosta/sistema-gimnasio.git

3. Entrá a la carpeta del proyecto:

       cd sistema-gimnasio

4. Instalá las dependencias (baja lo que el proyecto necesita):

       npm install

5. Levantá el proyecto:

       npm run dev

6. Abrí el navegador en http://localhost:3000

Listo. Vas a ver el sistema funcionando.

## Estructura de carpetas

    app/            las pantallas (una carpeta por ruta) y los estilos globales
    modules/        un modulo por pantalla: index.tsx (la UI), api.ts (las funciones de datos) y data.json (los datos)
    modules/*/BACKEND.md   qué tablas y tareas necesitaria cada modulo con backend real
    shell/          el chasis: theme.ts (el diseño), navegacion, fuentes, aforo.ts y auth-stub.ts
    docs/           IMPLEMENTAR.md: la guia para llevarlo a produccion
    DISENO.md       la ficha de diseño: por qué se ve como se ve
    .env.example    las variables de entorno que usaria un backend real (todas vacias)

## Cambiar los datos de ejemplo

Todos los datos del demo viven en archivos `.json`, uno por modulo:

    modules/dashboard/data.json       aforo del club, clases del bloque, curva y cinta de telemetria
    modules/agenda/data.json          clases del dia
    modules/ventas/data.json          membresias y cobros
    modules/contactos/data.json       socios
    modules/conversaciones/data.json  hilos y mensajes

Editá un archivo, guardá, y la pantalla se actualiza. Son de **solo lectura**: lo que cambies desde la interfaz vive solo en pantalla y **F5 restaura** el JSON original. No hay base de datos ni se guarda nada en el navegador.

Si cambiás nombres de campos, ajustá también los tipos en el `api.ts` de ese modulo.

## Personalizarlo

Todo el diseño (colores, tipografía, nombre de la marca) vive en un solo archivo: `shell/theme.ts`. Cambiás eso y muta el sistema entero. Probá y mirá qué pasa.

## Llevalo a producción

Este repo es un demo: no guarda nada. Para convertirlo en un sistema real, la guía paso a paso (para principiantes y con el código copiable) está en [`docs/IMPLEMENTAR.md`](docs/IMPLEMENTAR.md). En resumen:

1. **Supabase**: la base de datos y el login (el SQL de las tablas ya está escrito en la guia, con seguridad RLS).
2. **Conectar los modulos**: se cambia el cuerpo de las funciones de cada `api.ts`; las pantallas no se tocan.
3. **Railway + pg-boss**: tareas automaticas (avisos de vencimiento, estados de membresia al dia).
4. **Vercel**: publicar la web con tu dominio.
5. **IA (OpenAI o Gemini)**: sugerir respuestas a las consultas de los socios, con la clave solo en el servidor.
6. **Checklist de seguridad** antes de cargar datos reales.

Las variables que vas a necesitar estan listadas (vacias) en `.env.example`. **Nunca subas un `.env` con valores reales.**

## Licencia

MIT. Ver el archivo [`LICENSE`](LICENSE). Podés usar, copiar y modificar este proyecto.

## Te trabaste

Si algo no te salió, preguntá en el Club de la IA:

👉 https://www.skool.com/club-de-la-ia-8047/about
