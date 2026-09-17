import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    // El defecto de Next menos 3840, más 1536. `imageSizes` se deja sin declarar:
    // su defecto sirve, y ningún `sizes` del repo pide un peldaño que no cubra.
    // 3840 sobra. La foto más ancha del repo son 2048 px, y `optimizeImage()`
    // redimensiona con `withoutEnlargement`, así que w=3840 devuelve el MISMO
    // archivo que w=2048: `denia-impreso-piedra-inglesa-gris.jpg` da 387,4 kB y
    // sha256 `ae53a79f134c6e60` en los dos anchos. Es una transformación
    // facturada que entrega bytes duplicados.
    // 1536 falta. Con el defecto, el srcset de un `sizes="100vw"` salta de 1200
    // a 1920, y en ese hueco caen el iPhone Plus (414×3), el Pro Max (430×3),
    // el tablet retina (768×2) y el portátil de 1440 a DPR 1. En el hero a
    // sangre de `/proyectos/[slug]/`, que es el LCP, la misma foto pesa 334,5 kB
    // AVIF a w=1920 y 252,4 kB a w=1536: −82,1 kB, −25 %. Añadir un peldaño no
    // cuesta bytes nunca: para las fuentes más estrechas que 1536,
    // `withoutEnlargement` lo deja byte a byte igual a 1920.
    deviceSizes: [640, 750, 828, 1080, 1200, 1536, 1920, 2048],
    // `image-optimizer.js` solo valida el parámetro `q` si esta lista existe; el
    // ancho lo valida siempre. Sin declararla, `/_next/image?…&q=1..100` abre
    // 16 anchos × 2 formatos × 100 calidades = 3.200 transformaciones
    // facturables por foto de origen; con la lista, 32. Hoy no cambia ni un
    // byte servido —nada del repo pasa `quality`, y `Foto.tsx` ni lo acepta ni
    // lo reenvía—, pero deja fijado el 75 que Next 16 exigirá declarar.
    // ⚠️ Todo `quality` nuevo hay que añadirlo aquí: fuera de la lista la
    // petición devuelve un 400 en producción, y el build no avisa.
    qualities: [75],
    // El defecto son 60 s: cada foto optimizada revalida cada minuto. El coste
    // recurrente es una revalidación, no una recodificación, pero son 31 días
    // de caché de navegador que no se estaban cobrando. 2678400 s = 31 días.
    // ⚠️ La contrapartida, que no es teórica. Next emite este valor tal cual
    // como `max-age` del NAVEGADOR (`image-optimizer.js`: `public,
    // max-age=${maxAge}, must-revalidate`), y las URLs `/_next/image?url=…` no
    // llevan hash de contenido. El pendiente número uno de CLAUDE.md es la
    // sesión fotográfica de las 8 obras documentadas, que sustituye esos
    // ficheros CON EL MISMO NOMBRE: quien ya haya visto la ficha seguiría
    // viendo la foto vieja hasta 31 días. Con los 60 s de defecto el problema
    // no existía. Regla que lo cierra, y hay que respetarla: **toda foto
    // sustituida cambia de nombre de archivo**. Eso obliga a tocar
    // `content/*.json`, y ahí sí lo ve `scripts/verificar-imagenes.mjs`. Si no
    // se quiere asumir esa regla, hay que bajar el TTL a días.
    minimumCacheTTL: 2678400,
  },
  experimental: {
    // El formulario admite una foto de hasta 4 MB. El límite por defecto de los
    // Server Actions es 1 MB, y al superarlo el envío falla con un error opaco.
    // Se deja en 5 para dar margen al resto del formulario, por debajo de los
    // 4,5 MB que Vercel corta a nivel de plataforma.
    serverActions: { bodySizeLimit: '5mb' },
  },
  async redirects() {
    // trailingSlash:true normaliza la URL entrante antes de evaluar los
    // redirects, así que cada `source` tiene que llevar barra final para
    // que llegue a coincidir.
    return [
      // Servicios — URLs largas y redundantes de la web actual
      { source: '/pavimentos-de-hormigon-impreso/', destination: '/hormigon-impreso/', permanent: true },
      { source: '/pavimentos-de-hormigon-pulido/', destination: '/hormigon-pulido/', permanent: true },
      { source: '/pavimentos-de-hormigon-lavado/', destination: '/hormigon-lavado/', permanent: true },
      { source: '/microcemento-decorativo/', destination: '/microcemento/', permanent: true },
      // ⚠️ Provisional. `design/05` §C decisión 6 —¿los pavimentos de caucho se
      // mantienen como «Obra pública» o se retiran?— sigue sin contestar, y es
      // una decisión de negocio, no de fotos. Mientras tanto va a la home en vez
      // de a un 404. De las 164 fotos de la web viva solo hay 3 de caucho, a
      // 800×600 y sin obra identificable: no dan para una página propia.
      { source: '/pavimentos-de-caucho/', destination: '/', permanent: true },

      // Institucional y conversión
      { source: '/pavimentos-de-hormigon-valencia/', destination: '/empresa/', permanent: true },
      { source: '/contacto/', destination: '/presupuesto/', permanent: true },
      { source: '/galeria/', destination: '/proyectos/', permanent: true },

      // Blog e índices
      { source: '/category/blog/', destination: '/blog/', permanent: true },
      { source: '/category/blog/page/2/', destination: '/blog/', permanent: true },
      { source: '/fr/category/blog/', destination: '/blog/', permanent: true },
      { source: '/author/pavadmin/', destination: '/empresa/', permanent: true },
      { source: '/author/pavadmin/page/2/', destination: '/empresa/', permanent: true },

      // Entradas de proyecto → /proyectos/[slug]/
      {
        source: '/hormigon-impreso-en-modelo-espiga-y-color-117-proyecto-en-moncada-valencia/',
        destination: '/proyectos/moncada-impreso-espiga-117/',
        permanent: true,
      },
      {
        source: '/hormigon-impreso-en-color-gris-modelo-manta-imitacion-roca-de-montana/',
        destination: '/proyectos/impreso-manta-gris/',
        permanent: true,
      },
      {
        source: '/hormigon-impreso-en-adoquin-pequeno-y-color-arena-proyecto-en-moraira/',
        destination: '/proyectos/moraira-impreso-adoquin-arena/',
        permanent: true,
      },
      {
        source: '/hormigon-fratasado-en-color-arena-trabajo-realizado-en-corbera-valencia/',
        destination: '/proyectos/corbera-fratasado-arena/',
        permanent: true,
      },
      {
        source:
          '/hormigon-impreso-en-color-107-y-modelo-adoquin-irregular-trabajo-realizado-en-alzira/',
        destination: '/proyectos/alzira-impreso-adoquin-irregular-107/',
        permanent: true,
      },

      // Entradas que en realidad eran páginas de técnica o de zona
      {
        source: '/hormigon-desactivado-con-piedra-vista-estetica-y-funcionalidad-en-un-solo-material/',
        destination: '/hormigon-desactivado/',
        permanent: true,
      },
      {
        source: '/hormigon-fratasado-fino-decorativo-en-viviendas/',
        destination: '/hormigon-fratasado/',
        permanent: true,
      },
      { source: '/hormigon-impreso-en-moraira/', destination: '/zonas/moraira/', permanent: true },
      { source: '/hormigon-pulido-en-ribarroja-del-turia/', destination: '/zonas/ribarroja/', permanent: true },
      { source: '/hormigon-pulido-en-xabia/', destination: '/zonas/xabia/', permanent: true },
      // Alicante NO tiene página de zona, y no debe tenerla: `content/zonas.json`
      // solo genera ruta donde hay obra documentada con foto, porque Google
      // penaliza las doorway pages (`design/05` §D). Van a su servicio.
      { source: '/hormigon-pulido-en-alicante/', destination: '/hormigon-pulido/', permanent: true },
      { source: '/pavimentos-de-hormigon-impreso-en-denia/', destination: '/zonas/denia/', permanent: true },
      { source: '/hormigon-lavado-en-valencia-godella/', destination: '/zonas/godella/', permanent: true },
      { source: '/microcemento-alicante-2021/', destination: '/microcemento/', permanent: true },

      // Artículos divulgativos → /blog/
      // ⚠️ Estos dos artículos NO existen en `content/articulos.json` (solo hay
      // tres, y ninguno es de impreso). Van a la página de servicio, que es el
      // destino temáticamente equivalente. Si algún día se escriben, se repunta.
      {
        source: '/pavimentos-de-hormigon-impreso-innovacion-y-estilo-para-tus-espacios/',
        destination: '/hormigon-impreso/',
        permanent: true,
      },
      {
        source: '/brillo-y-elegancia-explorando-el-hormigon-pulido/',
        destination: '/blog/guia-hormigon-pulido/',
        permanent: true,
      },
      {
        source: '/descubriendo-la-elegancia-y-durabilidad-del-hormigon-impreso-en-valencia/',
        destination: '/hormigon-impreso/',
        permanent: true,
      },

      // Vertical de pádel — 301 externo
      { source: '/pistas-de-padel-y-pickleball/', destination: 'https://padelalbufera.com/', permanent: true },

      // Versión francesa
      { source: '/fr/:path*', destination: '/', permanent: true },

      // Legales
      { source: '/cookies/', destination: '/politica-de-cookies/', permanent: true },
    ]
  },
}

export default nextConfig
