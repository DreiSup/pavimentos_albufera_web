# CLAUDE.md — Pavimentos Albufera

Rediseño y migración de pavimentos-albufera.com de WordPress a Next.js 15.
La especificación completa está en `design/`. **Léela antes de escribir código.**

- `design/README.md` — panorama, stack, orden de trabajo
- `design/01-sistema-de-diseno.md` — tokens y los 14 componentes base, con valores exactos
- `design/02-pantallas.md` — pantalla por pantalla, móvil y escritorio
- `design/03-modelo-de-contenido.md` — tipos, catálogo real, datos de obra
- `design/04-desarrollo-y-deploy.md` — rutas, redirecciones 301, schema, despliegue
- `design/05-pendientes-y-decisiones.md` — datos sin confirmar y decisiones tomadas
- `design/Pavimentos Albufera.dc.html` — prototipo. **Referencia visual, no código a copiar**

## Reglas de este proyecto

**Diseño**

- Tokens: `#E9EAE6` fondo · `#DADCD6` fondo alterno · `#1B1E1C` tinta · `#5C625E` tinta media ·
  `#D9A441` pigmento · `#41535C` acero. No añadir colores.
- `border-radius: 0` en todo. Una sola sombra en toda la web: la de la barra fija de móvil.
- Escala tipográfica cerrada: 12 / 14 / 16 / 20 / 26 / 34 / 46 / 64 / 88. Nada intermedio.
- Tres familias: Archivo Expanded (display), Instrument Sans (texto), Martian Mono (datos).
  Todo dato del oficio va en monoespaciada, en versalitas, con formato de etiqueta de
  especificación. Suelo absoluto de la monoespaciada: 10 px.
- **Regla del ocre:** dos roles por pantalla, un CTA primario y el estado activo. Nada más.
  El ocre nunca como texto pequeño sobre fondo claro.
- Layout siempre con flex/grid y `gap`. Nunca márgenes por elemento.

**Contenido**

- Copy solo del documento maestro. **No inventar texto, datos, testimonios ni reseñas.**
- Los datos sin confirmar se renderizan con `<DatoPendiente>` y se ven entre corchetes
  atenuados. Es intencionado: no maquillar un dato que no existe.
- Cero fotos de stock de personas. Sin originales, `<BloquePosicion>`.
- El nombre de archivo de una imagen no aparece nunca en pantalla.
- Un solo teléfono y una sola dirección en todo el sitio, desde configuración.

**Técnica**

- Componentes de servidor por defecto. `'use client'` solo donde hay estado real.
- **Presupuesto de JS inicial — unidad fijada el 2026-08-30.** Se mide en **brotli q11**, sumando
  archivo a archivo los `<script src>` sin `noModule` del HTML prerenderizado de cada ruta. **No es
  la columna de `next build`:** esa es gzip ‑9 y se calcula sobre `app-build-manifest.json`, que
  omite `chunks/444` y `chunks/app/layout` —7,5 kB brotli por ruta que las 45 páginas sí descargan.
  Tampoco se concatenan los archivos antes de comprimir: cada chunk es una respuesta HTTP
  independiente. El payload RSC en línea (`self.__next_f.push`, 68,9 kB crudos en la home) son
  bytes de HTML y quedan fuera de este número a propósito.
  - Suelo del framework con 0 B propios: **86,5 kB**. Suelo real del sitio, con `chunks/444` y
    `chunks/app/layout`, que las 45 rutas piden: **94,0 kB**.
  - Hoy: 97,1 kB las tres legales · 99,3 `/precios` · 105,7 la home · 107,1 las seis de servicio
    (máximo del sitio).
  - **Techo duro, rompe el build: 112 kB por ruta. Objetivo informativo: 105 kB.**
  - El presupuesto viejo de **cien kilobytes queda retirado**: con 94,0 kB de suelo dejaba 6 kB
    para todo el código propio del proyecto.
  - El **JS de terceros va aparte** y hoy es 0. `gtag.js` (146,9 kB br) y `fbevents.js`
    (110,1 kB br) no entran nunca en este número.
  - El techo es un detector de regresión determinista sobre nuestro bundle, no una afirmación
    sobre los bytes que entrega el CDN: Vercel no documenta su calidad de brotli. Con un preview
    desplegado se contrasta el `content-length` de
    `curl -sI -H 'Accept-Encoding: br' <preview>/_next/static/chunks/4bd1b696-*.js` contra 46.749.
- Sin librerías de animación, de iconos ni de formularios.
- `trailingSlash: true` fijo.
- Sin `AggregateRating` mientras no haya reseñas verificables.
- 44 px de objetivo táctil, foco de teclado visible siempre, contraste AA,
  `prefers-reduced-motion` respetado.
- Cada `[corchete]` sustituido por un dato real es un commit que además elimina su tratamiento
  visual.

## Comandos

```bash
npm run dev
npm run build       # debe pasar sin warnings antes de cada commit
npm run lint
```

## Si algo no encaja

Si un componente aprobado no aguanta en un contexto nuevo, **no improvises una excepción**:
créalo en el mismo lenguaje, añádelo a `design/01-sistema-de-diseno.md` y dilo en el commit.
El sistema tiene que seguir siendo describible al terminar.
