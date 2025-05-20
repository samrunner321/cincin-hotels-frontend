'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

/**
 * Interface for journal article
 */
interface JournalArticle {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  url: string;
  author?: string;
  date?: string;
  readTime?: string;
  featured?: boolean;
}

/**
 * Interface for component props
 */
interface JournalSectionProps {
  title?: string;
  categories?: string[];
  articles?: JournalArticle[];
  viewAllUrl?: string;
  featuredArticleIndex?: number;
  viewAllText?: string;
  maxArticles?: number;
}

/**
 * JournalSection Component
 * 
 * Displays a section with journal/blog articles in a responsive grid layout,
 * with a featured article on the right side.
 */
export default function JournalSection({
  title = "Journal",
  categories = ["Stories", "People", "Trends"],
  articles = [
    {
      id: 1,
      title: "Where Spring's the Thing",
      category: "Destinations",
      excerpt: "In Edinburgh, Provence, and beyond, we have unearthed spots where spring's bloom is truly glorious.",
      image: "/images/journal-1.png",
      url: "/journal/where-springs-the-thing"
    },
    {
      id: 2,
      title: "A Design Guide to Istanbul",
      category: "Design",
      excerpt: "Two insiders share why Istanbul has become a top destination for contemporary art and design.",
      image: "/images/journal-2.png",
      url: "/journal/design-guide-istanbul"
    },
    {
      id: 3,
      title: "Edinburgh Views",
      category: "Destinations",
      excerpt: "Discover the breathtaking views of Edinburgh's historic skyline and architectural masterpieces.",
      image: "/images/journal-3.png",
      url: "/journal/edinburgh-views",
      featured: true
    }
  ],
  viewAllUrl = "/journal",
  featuredArticleIndex = 2,
  viewAllText = "Uncover more stories",
  maxArticles = 2
}: JournalSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] || '');

  // Find featured article (either the one marked as featured or the one at the specified index)
  const featuredArticle = articles.find(article => article.featured) || 
                        (featuredArticleIndex >= 0 && featuredArticleIndex < articles.length ? 
                          articles[featuredArticleIndex] : articles[articles.length - 1]);
  
  // Filter articles to exclude the featured one and limit to maxArticles
  const regularArticles = articles
    .filter(article => article.id !== featuredArticle.id)
    .slice(0, maxArticles);

  // Filter articles by category if a category is selected
  const filteredArticles = activeCategory ? 
    regularArticles.filter(article => 
      article.category.toLowerCase() === activeCategory.toLowerCase()
    ) : regularArticles;

  // Use actual filtered articles if available, otherwise fall back to regular articles
  const displayedArticles = filteredArticles.length > 0 ? filteredArticles : regularArticles;
  
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="md:col-span-6">
            <h2 className="text-3xl font-normal mb-4 font-brooklyn">{title}</h2>
            
            {/* Categories */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-6 mb-8">
                {categories.map((category, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveCategory(category)}
                    className={`${
                      category === activeCategory ? 
                        'underline underline-offset-4 text-brand-olive-400' : 
                        'hover:underline hover:underline-offset-4 hover:text-brand-olive-400'
                    } transition-all font-brooklyn`}
                    aria-pressed={category === activeCategory}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
            
            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10">
              {displayedArticles.map((article) => (
                <div key={article.id} className="flex flex-col">
                  <Link href={article.url} className="group block overflow-hidden mb-4 rounded-xl">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                  
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm text-brand-olive-400 font-brooklyn">{article.category}</span>
                    
                    {/* Display additional metadata if available */}
                    {article.date && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600 font-brooklyn">{article.date}</span>
                      </>
                    )}
                    
                    {article.readTime && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600 font-brooklyn">{article.readTime}</span>
                      </>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-normal mb-2 font-brooklyn">
                    <Link href={article.url} className="hover:underline hover:text-brand-olive-400 transition-colors">
                      {article.title}
                    </Link>
                  </h3>
                  
                  <p className="text-sm text-gray-700 font-brooklyn">{article.excerpt}</p>
                  
                  {article.author && (
                    <div className="mt-3 text-sm text-gray-600 font-brooklyn">
                      By {article.author}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column - Featured Article */}
          <div className="md:col-span-6 relative flex items-center">
            <Link href={featuredArticle.url} className="block w-full">
              <div className="relative w-full h-[500px] rounded-xl overflow-hidden group">
                <Image
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                
                {/* Featured article overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80"></div>
                
                {/* Featured article content */}
                <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                  <div className="mb-2 text-sm font-brooklyn">{featuredArticle.category}</div>
                  <h3 className="text-2xl font-normal mb-2 font-brooklyn">{featuredArticle.title}</h3>
                  <p className="text-sm text-white/80 mb-6 font-brooklyn max-w-md">{featuredArticle.excerpt}</p>
                </div>
                
                <div className="absolute bottom-0 w-full flex justify-center pb-8">
                  <Link href={viewAllUrl} className="bg-white text-black px-6 py-3 rounded-full text-sm hover:bg-brand-olive-50 hover:text-brand-olive-600 transition-colors font-brooklyn">
                    {viewAllText}
                  </Link>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}