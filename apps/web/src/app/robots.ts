import type { MetadataRoute } from 'next'
import { sitio } from '@/lib/config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/author/'] },
    ],
    sitemap: `${sitio.url}/sitemap.xml`,
  }
}
