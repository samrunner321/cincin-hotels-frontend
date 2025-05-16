'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { formatDate } from '../../lib/utils';

// Importieren Sie hier Ihre CSS-Datei, die die e-filter Styles enthält
// import '../styles/filter.css';

export default function JournalGrid({ 
  articles = [],
  activeFilter = 'all'
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [filter, setFilter] = useState(activeFilter);
  
  // Set up simplified categories for filtering
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'design', name: 'Design' },
    { id: 'destinations', name: 'Destinations' },
    { id: 'originals', name: 'Originals' },
  ];
  
  // Sync URL with active filter
  useEffect(() => {
    if (filter === 'all') {
      // Remove the category parameter if filter is 'all'
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('category');
      router.replace(`${pathname}${newParams.toString() ? '?' + newParams.toString() : ''}`, { scroll: false });
    } else {
      // Add or update the category parameter
      const newParams = new URLSearchParams(searchParams);
      newParams.set('category', filter);
      router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    }
  }, [filter, pathname, router, searchParams]);
  
  // Filter articles based on active filter
  const filteredArticles = filter === 'all' 
    ? articles 
    : articles.filter(article => article.categories.includes(filter));
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const articleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Filters - Exact HTML structure from provided code */}
      <div className="elementor-widget-container">
        <search className="e-filter" role="search" data-base-url="https://cincinhotels.com/journal/" data-page-num="1" data-page-x="">
          <button className="e-filter-item" data-filter="all" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All</button>
          <button className="e-filter-item" data-filter="design" aria-pressed={filter === 'design'} onClick={() => setFilter('design')}>Design</button>
          <button className="e-filter-item" data-filter="destinations" aria-pressed={filter === 'destinations'} onClick={() => setFilter('destinations')}>Destinations</button>
          <button className="e-filter-item" data-filter="originals" aria-pressed={filter === 'originals'} onClick={() => setFilter('originals')}>Originals</button>
        </search>
      </div>
      
      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredArticles.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              variants={articleVariants}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600 mb-6">
            No articles matching this category were found. Try selecting a different category.
          </p>
          <button 
            onClick={() => setFilter('all')}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            View All Articles
          </button>
        </div>
      )}
      
      {/* Pagination - Static for now */}
      {filteredArticles.length > 0 && (
        <div className="mt-16 flex justify-center">
          <nav className="inline-flex rounded-md shadow-sm">
            <span className="px-4 py-2 text-gray-500 bg-white border border-gray-300 rounded-l-md cursor-not-allowed">
              Previous
            </span>
            <span className="px-4 py-2 text-white bg-black border border-black">
              1
            </span>
            <Link 
              href="#"
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              2
            </Link>
            <Link 
              href="#"
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 transition-colors"
            >
              Next
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}

function ArticleCard({ article, variants }) {
  return (
    <motion.article 
      className="flex flex-col h-full"
      variants={variants}
    >
      <Link href={`/journal/${article.slug}`} className="block overflow-hidden rounded-lg">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={article.images.main}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="mt-5 flex-grow flex flex-col">
        <div className="flex flex-wrap gap-2 mb-3">
          {article.categories.slice(0, 2).map(category => (
            <Link 
              key={category}
              href={`/journal?category=${category}`}
              className="inline-flex text-xs font-medium text-gray-800 bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>
        
        <h4 className="text-xl font-semibold mb-3 leading-tight">
          <Link 
            href={`/journal/${article.slug}`}
            className="hover:text-gray-600 transition-colors"
          >
            {article.title}
          </Link>
        </h4>
        
        <p className="text-gray-600 line-clamp-3 mb-4">{article.excerpt}</p>
        
        <div className="mt-auto flex items-center text-sm text-gray-500">
          <time dateTime={article.date}>{formatDate(article.date)}</time>
          <span className="mx-2">•</span>
          <span>{article.author.name}</span>
        </div>
      </div>
    </motion.article>
  );
}