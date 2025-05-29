'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

// Helper function to get proper image URL
function getImageUrl(imageValue) {
  if (imageValue && imageValue.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    return `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${imageValue}`;
  }
  if (imageValue && (imageValue.startsWith('http://') || imageValue.startsWith('https://'))) {
    return imageValue;
  }
  return imageValue || '/images/hotels/hotel-2.jpg';
}

export default function HotelArticles({ articles = [], locale = 'de' }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-16">
      <div className="max-w-[1536px] mx-auto px-4">
        {articles.map((article, index) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`mb-16 ${
              article.layout === 'fullwidth' ? '' : 'grid md:grid-cols-2 gap-8 items-center'
            }`}
          >
            {article.layout === 'text-left' && (
              <>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">{article.title}</h3>
                  <div 
                    className="prose prose-lg"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </div>
                {article.image && (
                  <div className="relative h-96 rounded-xl overflow-hidden">
                    <Image
                      src={getImageUrl(article.image)}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </>
            )}

            {article.layout === 'text-right' && (
              <>
                {article.image && (
                  <div className="relative h-96 rounded-xl overflow-hidden">
                    <Image
                      src={getImageUrl(article.image)}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">{article.title}</h3>
                  <div 
                    className="prose prose-lg"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </div>
              </>
            )}

            {article.layout === 'fullwidth' && (
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-center">{article.title}</h3>
                {article.image && (
                  <div className="relative h-[500px] rounded-xl overflow-hidden">
                    <Image
                      src={getImageUrl(article.image)}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div 
                  className="prose prose-lg max-w-4xl mx-auto"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </section>
  );
}