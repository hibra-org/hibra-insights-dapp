import { DefaultSeoProps } from 'next-seo';

const SEO: DefaultSeoProps = {
  title: 'Hibra Insights',
  description: 'Hibra Insights by TruongDN',
  titleTemplate: '%s | Hibra Insights',
  openGraph: {
    type: 'website',
    locale: 'en',
    url: 'https://nextjs-core-project.vercel.app',
    siteName: 'Hibra Insights',
  },
  twitter: {
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image',
  },
};

export { SEO };
