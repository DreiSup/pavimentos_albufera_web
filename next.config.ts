import type { NextConfig } from 'next'
import { sitio } from './lib/config'

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    // trailingSlash:true normaliza la URL entrante antes de evaluar los
    // redirects, así que cada `source` tiene que llevar barra final para
    // que llegue a coincidir.
    return [
      // Dominio de producción de Vercel → dominio propio. Sin esto sirve
      // la web completa como duplicado exacto. Va primero para que gane
      // a cualquier otra regla. Los previews usan otras URLs y no se tocan.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'pavimentos-albufera-web.vercel.app' }],
        destination: `${sitio.url}/:path*`,
        permanent: true,
      },

      // Servicios — URLs largas y redundantes de la web actual
      { source: '/pavimentos-de-hormigon-impreso/', destination: '/hormigon-impreso/', permanent: true },
      { source: '/pavimentos-de-hormigon-pulido/', destination: '/hormigon-pulido/', permanent: true },
      { source: '/pavimentos-de-hormigon-lavado/', destination: '/hormigon-lavado/', permanent: true },
      { source: '/microcemento-decorativo/', destination: '/microcemento/', permanent: true },
      { source: '/pavimentos-de-caucho/', destination: '/obra-publica/', permanent: true },

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
      { source: '/hormigon-pulido-en-alicante/', destination: '/zonas/alicante/', permanent: true },
      { source: '/pavimentos-de-hormigon-impreso-en-denia/', destination: '/zonas/denia/', permanent: true },
      { source: '/hormigon-lavado-en-valencia-godella/', destination: '/zonas/godella/', permanent: true },
      { source: '/microcemento-alicante-2021/', destination: '/zonas/alicante/', permanent: true },

      // Artículos divulgativos → /blog/
      {
        source: '/pavimentos-de-hormigon-impreso-innovacion-y-estilo-para-tus-espacios/',
        destination: '/blog/hormigon-impreso-innovacion-y-estilo/',
        permanent: true,
      },
      {
        source: '/brillo-y-elegancia-explorando-el-hormigon-pulido/',
        destination: '/blog/guia-hormigon-pulido/',
        permanent: true,
      },
      {
        source: '/descubriendo-la-elegancia-y-durabilidad-del-hormigon-impreso-en-valencia/',
        destination: '/blog/hormigon-impreso-valencia-guia/',
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
