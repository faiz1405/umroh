export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  article?: {
    publishedTime?: string;
    author?: string;
  };
}

export function generateMetaTags({
  title,
  description,
  image = '/images/og-default.jpg',
  url,
  type = 'website',
  article,
}: SEOProps) {
  const metaTags: Array<{ name?: string; property?: string; content: string }> = [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:image', content: image },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ];

  if (url) {
    metaTags.push({ property: 'og:url', content: url });
  }

  if (type === 'article' && article) {
    if (article.publishedTime) {
      metaTags.push({
        property: 'article:published_time',
        content: article.publishedTime,
      });
    }
    if (article.author) {
      metaTags.push({ property: 'article:author', content: article.author });
    }
  }

  return metaTags;
}

// JSON-LD Schema helpers
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'UmrohKita',
    description: 'Layanan umroh dan haji terpercaya',
    url: 'https://umrohkita.com',
  };
}

export function generateBlogPostSchema({
  title,
  description,
  image,
  publishedAt,
  url,
}: {
  title: string;
  description: string;
  image: string;
  publishedAt: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: image,
    datePublished: publishedAt,
    url: url,
  };
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

