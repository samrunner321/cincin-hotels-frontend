import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getJournalArticleBySlug, getRecentJournalArticles } from '../../../lib/api';
import { formatDate } from '../../../lib/utils';
import { JournalPostContent } from '../../../components/journal_post';

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const { slug } = params;
  const articleData = await getJournalArticleBySlug(slug);
  
  if (!articleData) {
    return {
      title: 'Article Not Found - CinCin Hotels',
    };
  }
  
  const article = articleData.data;
  
  return {
    title: `${article.title} - CinCin Hotels Journal`,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} - CinCin Hotels Journal`,
      description: article.excerpt,
      images: [
        {
          url: article.images.main,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
  };
}

export default async function JournalArticlePage({ params }) {
  const { slug } = params;
  
  // Fetch article and related content in parallel
  const [articleData, recentArticlesData] = await Promise.all([
    getJournalArticleBySlug(slug),
    getRecentJournalArticles(3)
  ]);
  
  // If article not found, return 404 page
  if (!articleData) {
    notFound();
  }
  
  const article = articleData.data;
  const relatedHotels = article.relatedHotels || [];
  
  // Option to use new JournalPostContent layout
  const useNewLayout = false; // Set to true to use the new layout
  
  if (useNewLayout) {
    return <JournalPostContent post={article} relatedHotels={relatedHotels} />;
  }
  
  // Filter out current article from recent articles
  const recentArticles = recentArticlesData.data
    .filter(a => a.slug !== slug)
    .slice(0, 2);
  
  return (
    <main className="bg-white">
      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh] bg-gray-900">
        <Image
          src={article.images.main}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {article.categories.map(category => (
                <Link
                  key={category}
                  href={`/journal?category=${category}`}
                  className="text-sm text-brand-blue-600 hover:text-brand-blue-700 transition-colors bg-blue-50 px-3 py-1 rounded-full"
                >
                  {category}
                </Link>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            
            <div className="flex items-center text-gray-600 mb-4">
              <div className="flex items-center mr-6">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src={article.author.image}
                    alt={article.author.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <span>{article.author.name}</span>
              </div>
              
              <time dateTime={article.date}>{formatDate(article.date)}</time>
            </div>
            
            <p className="text-lg text-gray-700 mb-8">
              {article.excerpt}
            </p>
          </div>
          
          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          
          {/* Image Gallery */}
          {article.images.gallery && article.images.gallery.length > 0 && (
            <div className="my-12">
              <h2 className="text-2xl font-semibold mb-6">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {article.images.gallery.map((image, index) => (
                  <div key={index} className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`${article.title} - image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Related Hotels */}
          {article.relatedHotels && article.relatedHotels.length > 0 && (
            <div className="my-12">
              <h2 className="text-2xl font-semibold mb-6">Mentioned Hotels</h2>
              <div className="flex flex-wrap gap-2">
                {article.relatedHotels.map(hotel => {
                  // Handle different formats of hotel data
                  let hotelSlug, hotelName, displayName;
                  
                  if (typeof hotel === 'string') {
                    // Case 1: Simple string (e.g., "forestis")
                    hotelSlug = hotel;
                    displayName = hotel.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ');
                  } else if (hotel && typeof hotel === 'object') {
                    // Case 2: Object with properties
                    hotelSlug = hotel.slug || '';
                    displayName = hotel.title || 'Related Hotel';
                  } else {
                    // Case 3: Unexpected format - provide fallback
                    console.warn('Unexpected hotel format:', hotel);
                    return null; // Skip this hotel in the render
                  }
                  
                  // Normalize the slug for href
                  let href;
                  if (!hotelSlug) {
                    // No slug available
                    return null;
                  } else if (typeof hotelSlug === 'string' && hotelSlug.startsWith('/hotels/')) {
                    // Already a full path
                    href = hotelSlug;
                    // Extract just the slug portion for the key
                    hotelSlug = hotelSlug.replace('/hotels/', '');
                  } else {
                    // Just the slug, need to create path
                    href = `/hotels/${hotelSlug}`;
                  }
                  
                  return (
                    <Link
                      key={hotelSlug}
                      href={href}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md transition-colors"
                    >
                      {displayName}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* About Author */}
          <div className="border-t border-gray-200 pt-8 mt-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={article.author.image}
                  alt={article.author.name}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">{article.author.name}</h3>
                <p className="text-gray-700">{article.author.bio}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* More Articles */}
        {recentArticles.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-8 text-center">More Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {recentArticles.map(article => (
                <div key={article.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                  <Link href={`/journal/${article.slug}`} className="block">
                    <div className="relative h-48 md:h-64">
                      <Image
                        src={article.images.main}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="p-6">
                      <div className="text-xs text-gray-600 mb-2">
                        {article.categories.slice(0, 2).join(', ')}
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-700 line-clamp-2">{article.excerpt}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// Opt into ISR
export const revalidate = 3600; // Revalidate every hour