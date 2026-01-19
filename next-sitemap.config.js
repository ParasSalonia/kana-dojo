/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: process.env.SITE_URL || 'https://kanadojo.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: [
    '/api/*',
    '/_next/*',
    '/*/train/*', // Exclude dynamic training pages
    '/es/*', // Exclude es/ja locales - we only generate /en/* URLs
    '/ja/*', // and add alternateRefs for other locales
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
      },
    ],
    additionalSitemaps: [],
  },
  transform: async (config, path) => {
    // Custom priority for important pages
    const priorities = {
      '/': 1.0,
      '/kana': 0.9,
      '/kanji': 0.9,
      '/vocabulary': 0.9,
      '/translate': 0.9,
      '/academy': 0.8,
      '/preferences': 0.6,
      '/achievements': 0.7,
      '/progress': 0.7,
    };

    const changefreqs = {
      '/': 'daily',
      '/kana': 'weekly',
      '/kanji': 'weekly',
      '/vocabulary': 'weekly',
      '/translate': 'daily',
      '/academy': 'weekly',
      '/preferences': 'monthly',
      '/achievements': 'weekly',
      '/progress': 'weekly',
    };

    // Extract base path without locale (e.g., /en/kana -> /kana)
    const localePattern = /^\/(en|es|ja)(\/.*)?$/;
    const match = path.match(localePattern);
    const basePath = match ? match[2] || '/' : path;

    // Check if this is an academy post URL (matches /academy/[slug] pattern)
    const isAcademyPost = /^\/academy\/[^/]+$/.test(basePath);

    // Determine priority and changefreq using base path
    let priority = priorities[basePath] || config.priority;
    let changefreq = changefreqs[basePath] || config.changefreq;

    // Academy posts get priority 0.8 and weekly changefreq
    if (isAcademyPost) {
      priority = 0.8;
      changefreq = 'weekly';
    }

    const siteUrl = config.siteUrl || 'https://kanadojo.com';

    // FIX: Use absolute URLs for alternateRefs to prevent path doubling
    // next-sitemap was appending href to loc, causing /en/kana/en/kana
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: [
        {
          href: `${siteUrl}/en${basePath}`,
          hreflang: 'en',
          hrefIsAbsolute: true,
        },
        {
          href: `${siteUrl}/es${basePath}`,
          hreflang: 'es',
          hrefIsAbsolute: true,
        },
        {
          href: `${siteUrl}/ja${basePath}`,
          hreflang: 'ja',
          hrefIsAbsolute: true,
        },
        {
          href: `${siteUrl}/en${basePath}`,
          hreflang: 'x-default',
          hrefIsAbsolute: true,
        },
      ],
    };
  },
};
