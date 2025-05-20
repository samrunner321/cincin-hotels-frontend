'use client';

import React from 'react';
import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { SEOProps } from '../../types/seo';

/**
 * SEO component for managing page metadata
 * This is a client component for pages that need dynamic SEO updates
 */
const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  openGraph,
  twitter,
  noindex = false,
  nofollow = false,
  structuredData,
}) => {
  const pathname = usePathname();
  const domain = 'https://cincinhotels.com'; // Change to your actual domain
  const url = canonical || `${domain}${pathname}`;

  // Prepare robots meta
  let robots = '';
  if (noindex) robots += 'noindex';
  if (nofollow) robots += robots ? ', nofollow' : 'nofollow';
  if (!robots) robots = 'index, follow';

  // Format structured data
  const jsonLd = structuredData 
    ? (Array.isArray(structuredData) 
        ? structuredData 
        : [structuredData])
    : [];

  return (
    <Head>
      {/* Basic metadata */}
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta name="robots" content={robots} />
      <link rel="canonical" href={url} />

      {/* OpenGraph metadata */}
      <meta property="og:title" content={openGraph?.title || title} />
      {(openGraph?.description || description) && 
        <meta property="og:description" content={openGraph?.description || description} />
      }
      <meta property="og:url" content={url} />
      <meta property="og:type" content={openGraph?.type || 'website'} />
      <meta property="og:site_name" content={openGraph?.siteName || 'CinCin Hotels'} />
      <meta property="og:locale" content={openGraph?.locale || 'en_US'} />
      
      {/* OpenGraph images */}
      {openGraph?.images && openGraph.images.map((image, index) => (
        <React.Fragment key={`og-image-${index}`}>
          <meta property="og:image" content={image.url} />
          {image.width && <meta property="og:image:width" content={image.width.toString()} />}
          {image.height && <meta property="og:image:height" content={image.height.toString()} />}
          {image.alt && <meta property="og:image:alt" content={image.alt} />}
        </React.Fragment>
      ))}

      {/* Twitter Card metadata */}
      <meta name="twitter:card" content={twitter?.card || 'summary_large_image'} />
      {twitter?.site && <meta name="twitter:site" content={twitter.site} />}
      {twitter?.creator && <meta name="twitter:creator" content={twitter.creator} />}
      <meta name="twitter:title" content={twitter?.title || openGraph?.title || title} />
      {(twitter?.description || openGraph?.description || description) && 
        <meta name="twitter:description" content={twitter?.description || openGraph?.description || description} />
      }
      {twitter?.image && <meta name="twitter:image" content={twitter.image} />}
      {twitter?.imageAlt && <meta name="twitter:image:alt" content={twitter.imageAlt} />}

      {/* Structured Data / JSON-LD */}
      {jsonLd.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd.length === 1 ? jsonLd[0] : jsonLd)
          }}
        />
      )}
    </Head>
  );
};

export default SEO;