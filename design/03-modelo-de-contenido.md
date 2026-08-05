# 03 · Modelo de contenido

## 1. Tipos

```ts
export type ServicioId =
  | 'impreso' | 'pulido' | 'microcemento'
  | 'lavado'  | 'fratasado' | 'desactivado'

export type Provincia = 'Valencia' | 'Castellón' | 'Alicante'

export type Proyecto = {
  slug: string
  titulo: string
  municipio: string
  provincia: Provincia
  servicio: ServicioId
  modelo?: ModeloId          // solo en impreso
  color?: ColorId
  superficie?: number        // m². undefined = dato sin confirmar → se pinta [m²]
  anio?: number
  plazoDias?: number
  encargo?: string           // 2-3 frases. undefined → bloque pendiente de redacción
  ejecucion?: string
  imagenes: Imagen[]
  destacado: boolean
}

export type Imagen = {
  src: string                // municipio-servicio-modelo-color-año.jpg
  alt: string                // obligatorio y descriptivo. Nunca el nombre del archivo
  tipo: 'final' | 'proceso' | 'detalle' | 'antes'
}

export type Acabado = {
  slug: string               // espiga-117
  nombre: string             // Espiga
  modelo?: ModeloId
  color: ColorId
  codigo: string             // C-117 · GRIS · CREMA — como se muestra en pantalla
  servicio: ServicioId
  muestra?: string           // imagen de detalle macro
  proyectos: string[]        // slugs de Proyecto
}

export type Zona = {
  slug: string               // moraira
  municipio: string
  provincia: Provincia
  anillo: 1 | 2 | 3
  proyectos: string[]
  servicios: ServicioId[]
}

export type Articulo = {
  slug: string
  titulo: string
  entradilla: string
  fecha: string              // ISO
  servicio: ServicioId       // la técnica que explica → alimenta el enlace cruzado
  cuerpo: string             // MDX
  imagenApertura?: Imagen
}
```

Con `Proyecto`, `Acabado` y `Zona` se generan automáticamente `/proyectos/[slug]`,
`/acabados/[modelo]`, `/zonas/[municipio]` y todos los filtros. **Un dato `undefined` no es un
error**: se renderiza como corchete atenuado (`01 §3.9`), y eso es intencionado.

Regla de derivación: **una `Zona` solo existe si tiene al menos un `Proyecto`.** Sin obra
documentada no se genera la ruta. Igual para `Acabado`: si no tiene ni muestra ni proyecto, no
entra en el muestrario.

### 1.1 Qué cuenta como «obra documentada»

El contador del muestrario (`02-pantallas.md §A3`) y el de zonas dependen de esta definición,
así que es normativa y no interpretable:

> Un acabado tiene **obra documentada** cuando está asociado a un proyecto **cuyo municipio
> está confirmado**. Un proyecto con `municipio: null` existe y se muestra, pero **no cuenta**
> como documentado: en pantalla su municipio sale como `[MUNICIPIO]`, y un contador no puede
> apoyarse en un dato que el propio diseño está declarando pendiente.

```ts
export const estaDocumentado = (a: Acabado, proyectos: Proyecto[]) =>
  a.proyectos.some(slug => {
    const p = proyectos.find(p => p.slug === slug)
    return Boolean(p?.municipio)
  })

// 16 acabados · 8 con obra documentada
const total = acabados.length
const documentados = acabados.filter(a => estaDocumentado(a, proyectos)).length
```

No usar `a.proyectos.length > 0`: daría **9**, porque `manta-gris` está vinculado a
`impreso-manta-gris`, un proyecto real cuyo municipio el cliente aún no ha confirmado.
En cuanto lo confirme, el mismo cálculo pasa a 9 solo: el contador se corrige al rellenar el
dato, no tocando código.

## 2. Catálogo real de la empresa

No es contenido de relleno. Es el catálogo con el que trabaja Pavimentos Albufera.

### 2.1 Técnicas

`impreso` · `pulido` · `microcemento` · `lavado` · `fratasado` · `desactivado`

### 2.2 Modelos de molde (solo aplican a impreso)

| ModeloId | Nombre en pantalla |
|---|---|
| `espiga` | Espiga |
| `adoquin-irregular` | Adoquín irregular |
| `adoquin-pequeno` | Adoquín pequeño |
| `manta` | Manta (imitación roca de montaña) |
| `silleria-grande` | Sillería grande |
| `piedra-silleria` | Piedra sillería |
| `piedra-rodena` | Piedra rodena |
| `piedra-inglesa` | Piedra inglesa |

### 2.3 Colores

| ColorId | En pantalla |
|---|---|
| `117` | C-117 |
| `113` | C-113 |
| `109` | C-109 |
| `107` | C-107 |
| `gris` | GRIS |
| `arena` | ARENA |
| `crema` | CREMA |

Los códigos numéricos se muestran con el prefijo `C-`. Los nominales, en versalitas.

⚠️ El primer prototipo usó nombres de acabado provisionales (pizarra, madera envejecida, losa
romana, adoquín rústico, antracita, tierra). **Están sustituidos por este catálogo y no deben
volver a aparecer.** `data/acabados.json` ya trae la versión correcta.

### 2.4 Municipios con obra

Moncada · Alzira · Corbera · Moraira · Torrent (Vedat) · Ollería · Carlet · Catadau · Turís ·
Alfafar · Godella · Benissa · Denia · Xàbia · Ribarroja · Sollana

Sollana es además la sede. **Solo se crea página de zona donde haya obra documentada que
enseñar**, no para los 16 automáticamente.

### 2.5 Anillos de servicio

| Anillo | Cobertura | Condición |
|---|---|---|
| 1 | Valencia, Castellón y Alicante | Cualquier superficie, sin desplazamiento |
| 2 | Murcia, Albacete, Almería, Tarragona, Teruel | A partir de `[100]` m², con desplazamiento |
| 3 | Resto de España | Solo proyectos de volumen, a consultar |

## 3. Obras documentadas

Las 11 entradas actuales del cliente, ya clasificadas. Los `[corchetes]` son datos que faltan.

| Slug | Municipio | Servicio | Modelo · Color | m² | Año | |
|---|---|---|---|---|---|---|
| `moncada-impreso-espiga-117` | Moncada, Valencia | impreso | Espiga · C-117 | `[180]` | 2025 |
| `alzira-impreso-adoquin-irregular-107` | Alzira, Valencia | impreso | Adoquín irregular · C-107 | `[m²]` | `[año]` |
| `moraira-impreso-adoquin-arena` | Moraira, Alicante | impreso | Adoquín pequeño · ARENA | `[m²]` | 2025 |
| `corbera-fratasado-arena` | Corbera, Valencia | fratasado | — · ARENA | `[m²]` | `[año]` |
| `impreso-manta-gris` | `[municipio]` | impreso | Manta · GRIS | `[m²]` | `[año]` | ← municipio sin confirmar: **no cuenta como documentada** (§1.1) |
| `denia-impreso-piedra-inglesa` | Denia, Alicante | impreso | Piedra inglesa · GRIS + CREMA | `[m²]` | `[año]` |
| `ribarroja-pulido` | Ribarroja, Valencia | pulido | — · GRIS | `[m²]` | `[año]` |
| `xabia-pulido` | Xàbia, Alicante | pulido | — · `[color]` | `[m²]` | `[año]` |
| `godella-lavado-arido-visto` | Godella, Valencia | lavado | — · GRIS | `[m²]` | `[año]` |

### Ficha técnica real de la obra de Denia

Dato verificado, útil en la ficha de proyecto y en el artículo de la técnica:

```
HORMIGÓN         HM-20
ESPESOR          10 cm
ÁRIDO            12 mm
MALLAZO          20×30 de 4 mm
FIBRA            polipropileno
COLOR            4 kg/m²
ACABADOS         dos en la misma vivienda:
                 piedra inglesa en gris mate  ·  piedra inglesa en crema
```

Es el mejor ejemplo del registro que busca el sistema: especificación, no adjetivos. Que dos
acabados convivan en una vivienda es además un argumento de venta que la web actual no usa.

### Ficha técnica genérica de impreso (§7.2)

```
ESPESOR USO PEATONAL        10 cm
ESPESOR PASO DE VEHÍCULOS   12–15 cm
ARMADO                      mallazo electrosoldado + fibra de polipropileno
HORMIGÓN                    HA-25 según EHE-08
JUNTAS DE DILATACIÓN        cada [16-25] m²
SELLADO                     resina acrílica, [2] manos
TRÁNSITO PEATONAL           24–48 h
CURADO COMPLETO             28 días
```

El hormigón lavado añade **clase 3, Rd > 45** de resistencia al deslizamiento. Es el único punto
donde la web actual demuestra conocimiento técnico real: hay que **extender ese registro a todos
los servicios**, no eliminarlo.

## 4. Artículos del blog

Tres artículos divulgativos reales, ya separados de los partes de obra:

| Slug | Técnica que explica |
|---|---|
| `hormigon-desactivado-piedra-vista` | desactivado |
| `hormigon-fratasado-fino-en-viviendas` | fratasado |
| `guia-hormigon-pulido` | pulido |

Cada artículo alimenta su enlace cruzado por el campo `servicio`: el bloque
`ESTA TÉCNICA, EJECUTADA` consulta `proyectos.filter(p => p.servicio === articulo.servicio)`.

## 5. Precios

Rangos del §7.1. **Todos sin validar por el cliente** (bloqueante 4 del §11): se muestran entre
corchetes hasta que los confirme.

| Servicio | Uso | €/m² sin IVA |
|---|---|---|
| Impreso | Peatonal (patios, porches, jardines) | `[28-38]` |
| Impreso | Paso de vehículos (entradas, rampas) | `[35-48]` |
| Pulido | Interior de vivienda | `[30-45]` |
| Pulido | Nave, parking o industrial | `[22-35]` |
| Microcemento | Sobre suelo existente | `[55-85]` |
| Lavado | Zonas de paso y piscinas | `[30-42]` |
| Fratasado | Peatonal | `[pendiente]` |
| Desactivado | Peatonal y accesos | `[pendiente]` |

**Incluido siempre:** preparación del soporte, mallazo, fibra de polipropileno, hormigón de
10 cm, molde, pigmento, desmoldeante y sellado final.

**Se presupuesta aparte:** demolición del pavimento anterior, movimiento de tierras, drenajes y
rebajes de acceso difícil.

Multiplicadores de la calculadora, **derivados por diseño y sin validar**:

| Estado del terreno | Multiplicador | Motivo |
|---|---|---|
| Limpio | × 1,00 | Sin recargo |
| Con pavimento a demoler | × 1,15 | +15 % por demolición |
| Sin preparar | × 1,30 | +30 % por movimiento de tierras |

## 6. NAP

**Sin cerrar.** Es el bloqueante 1 del §11: la web actual tiene 4 teléfonos y 2 direcciones.

```
Dirección   [CALLE Y NÚMERO], Sollana · 46430 · Valencia
Teléfono    [+34 6XX XXX XXX]        ← uno solo en todo el sitio
Email       comercial@pavimentos-albufera.com
```

El teléfono aparece en cabecera, pie, barra fija de móvil, CTA de cierre y schema
`LocalBusiness`. Un único valor en configuración, referenciado desde todos ellos: no repetirlo
literal en cada plantilla.

## 7. Mensajes núcleo

Los cinco argumentos que la web debe repetir sin adornarlos:

1. **17 años de obra propia** en la Comunidad Valenciana.
2. **Garantía de 10 años con mantenimiento incluido** — el diferencial real, hoy enterrado en el
   tercio inferior de las páginas.
3. **Más de 3 de cada 10 clientes repiten** — la mejor prueba social que tienen, y la única que
   no se puede comprar.
4. **Acabado elegible de antemano** — el muestrario responde a *¿cómo va a quedar lo mío?*
5. **Precio publicado con honestidad**, incluido cuándo NO contratarles.

## 8. Tono de voz

- **Tú**, no usted. Cliente particular, no ingeniería de obra civil.
- Se habla de **espacios** («la entrada del garaje», «el porche»), no de sistemas constructivos.
- Frases cortas. El copy actual tiene párrafos de 80-100 palabras sin puntuación interna,
  ilegibles en el móvil, que es de donde llega el 70-80 % del tráfico del sector.
- **Cero superlativos sin sustento**: nada de «calidad inmejorable», «líderes en confianza»,
  «queremos ser los mejores». Todo el mundo lo dice y nadie lo cree.
- El dato sustituye al adjetivo: `HA-25 · EHE-08 · 10 cm` dice más que «máxima resistencia».
- Nunca reutilizar el mismo bloque de texto en varias páginas: Google lo lee como contenido
  duplicado interno, y es uno de los problemas de la web actual.
- Sin listados de municipios sin formato al pie. Eso es *keyword stuffing* de 2012.
