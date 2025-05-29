'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import RelatedHotelsSection from './RelatedHotelsSection';

export default function JournalPostContent({ article }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('content');

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.clientHeight - windowHeight;
      const scrolled = window.scrollY;
      setScrollProgress(Math.min((scrolled / fullHeight) * 100, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-light text-gray-600">Article not found</h2>
      </div>
    );
  }

  const {
    title,
    content,
    images,
    author,
    date,
    categories = [],
    relatedHotels = []
  } = article;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <article className="relative">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-black transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Article Navigation Bar */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Author Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={author?.image || '/images/authors/default.jpg'}
                  alt={author?.name || 'Author'}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{author?.name}</p>
                <p className="text-xs text-gray-500">{formattedDate}</p>
              </div>
            </div>

            {/* Share & Save Actions */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Article Content */}
          <motion.div 
            className="prose prose-lg prose-gray max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Drop Cap Styling */}
            <style jsx>{`
              .prose p:first-of-type::first-letter {
                float: left;
                font-size: 4rem;
                line-height: 3rem;
                padding-right: 0.5rem;
                padding-top: 0.25rem;
                font-weight: bold;
                color: #1f2937;
              }
            `}</style>
            
            <div 
              dangerouslySetInnerHTML={{ __html: content }} 
              className="text-lg leading-relaxed text-gray-800"
            />
          </motion.div>

          {/* Image Gallery */}
          {images?.gallery && images.gallery.length > 0 && (
            <motion.div 
              className="my-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {images.gallery.slice(0, 4).map((image, index) => (
                  <div 
                    key={index}
                    className={`relative overflow-hidden rounded-lg ${
                      index === 0 ? 'md:col-span-2 aspect-[21/9]' : 'aspect-[4/3]'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Author Bio */}
          <motion.div 
            className="mt-20 pt-12 border-t border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={author?.image || '/images/authors/default.jpg'}
                  alt={author?.name || 'Author'}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{author?.name}</h3>
                <p className="text-gray-600 mb-4">{author?.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category, index) => (
                    <Link
                      key={index}
                      href={`/journal?category=${category}`}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related Hotels Section */}
      {relatedHotels && relatedHotels.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-gray-900 mb-4">Featured Hotels</h2>
              <div className="w-16 h-px bg-gray-400 mx-auto"></div>
            </div>
            <RelatedHotelsSection hotels={relatedHotels} />
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-light mb-4">Stay Inspired</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Get our latest stories and exclusive travel insights delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-white/60 focus:outline-none focus:border-white/40"
            />
            <button className="px-6 py-3 bg-white text-black rounded font-medium hover:bg-white/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </article>
  );
}