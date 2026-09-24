import type { MetadataRoute } from 'next'
import { buildRobots } from '@site/seo'
import { sitio } from '@/lib/config'

export default function robots(): MetadataRoute.Robots {
  return buildRobots(sitio.url, ['/author/'])
}
