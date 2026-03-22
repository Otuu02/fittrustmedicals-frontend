import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/account', '/checkout'],
    },
    sitemap: 'https://fittrustmedicals.com/sitemap.xml',
  };
}