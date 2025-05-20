'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: {
    name: string;
    image: string;
  };
  categories: string[];
  images: {
    main: string;
    [key: string]: string | string[];
  };
}

interface JournalGridProps {
  articles: Article[];
  activeFilter?: string;
}

/**
 * This is a placeholder component for the JournalGrid
 * It will be replaced with the fully migrated component in the future
 */
const JournalGrid = ({ articles, activeFilter = 'all' }: JournalGridProps) => {
  const [filter, setFilter] = useState(activeFilter);
  
  // Extract all unique categories from articles
  const uniqueCategories = Array.from(new Set(articles.flatMap(article => article.categories || [])));
  const allCategories = ['all', ...uniqueCategories];
  
  // Filter articles based on selected category
  const filteredArticles = filter === 'all' 
    ? articles 
    : articles.filter(article => article.categories.includes(filter));
  
  return (
    <section className="py-12 md:py-16 px-4">
      <div className="container mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-semibold text-center mb-8">Journal Articles</h2>
          
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  filter === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 px-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No articles found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Link 
                href={`/journal/${article.slug}`}
                key={article.id}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 md:h-64">
                  <Image
                    src={article.images.main}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {article.categories.slice(0, 2).map((category) => (
                      <span 
                        key={category}
                        className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                      <Image
                        src={article.author.image}
                        alt={article.author.name}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <span>{article.author.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default JournalGrid;