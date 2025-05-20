'use client';

import React from 'react';
import { JsonLdProps } from '../../types/seo';

/**
 * JsonLd component for adding structured data to the page
 * Since this component uses dangerouslySetInnerHTML, it's marked as a client component
 */
const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  // Format the JSON-LD data
  const jsonLdData = Array.isArray(data) ? data : [data];
  
  return (
    <>
      {jsonLdData.map((item, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item)
          }}
        />
      ))}
    </>
  );
};

export default JsonLd;