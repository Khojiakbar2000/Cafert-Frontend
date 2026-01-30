import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
  noindex?: boolean;
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Cafert - Premium Coffee Shop Experience',
  description = 'Discover the perfect blend of coffee and comfort at Cafert. Handcrafted beverages made with the finest ingredients. Order now and experience premium coffee.',
  image = '/img/misc/logo.webp',
  url = typeof window !== 'undefined' ? window.location.href : 'https://cafert.uz',
  type = 'website',
  keywords = 'coffee, cafe, coffee shop, premium coffee, espresso, cappuccino, latte, coffee beans, coffee drinks, cafe menu, coffee delivery',
  noindex = false,
  structuredData
}) => {
  const siteName = 'Cafert';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const fullImage = image.startsWith('http') ? image : `${typeof window !== 'undefined' ? window.location.origin : 'https://cafert.uz'}${image}`;
  const fullUrl = url.startsWith('http') ? url : `${typeof window !== 'undefined' ? window.location.origin : 'https://cafert.uz'}${url}`;

  // Default structured data for LocalBusiness
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Cafert',
    description: 'Premium Coffee Shop Experience',
    image: fullImage,
    url: fullUrl,
    telephone: '+998-XX-XXX-XXXX', // Update with actual phone
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'UZ',
      addressLocality: 'Tashkent', // Update with actual city
      addressRegion: 'Tashkent Region' // Update with actual region
    },
    servesCuisine: 'Coffee',
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '08:00',
        closes: '22:00'
      }
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150'
    }
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow" />}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Additional Meta Tags */}
      <meta name="author" content="Cafert" />
      <meta name="theme-color" content="#8B4513" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Cafert" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;



