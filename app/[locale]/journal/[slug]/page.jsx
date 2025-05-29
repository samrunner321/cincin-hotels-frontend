import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getJournalArticleBySlug } from '@/lib/api';

export async function generateMetadata({ params }) {
  const { slug, locale = 'en' } = params;
  
  try {
    const articleData = await getJournalArticleBySlug(slug);
    const article = articleData?.data;
    
    if (!article) {
      return {
        title: 'Article Not Found',
      };
    }
    
    return {
      title: article.title,
      description: article.excerpt,
      openGraph: {
        title: article.title,
        description: article.excerpt,
        images: article.images?.main ? [article.images.main] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Article Not Found',
    };
  }
}

export default async function ArticlePage({ params }) {
  const { slug, locale = 'en' } = params;
  
  try {
    const articleData = await getJournalArticleBySlug(slug);
    const article = articleData?.data;

    if (!article) {
      notFound();
    }

    // Get other articles for related section (simple approach)
    const otherArticles = article.relatedArticles || [];

    return (
      <main className="min-h-screen bg-white">
        {/* Article Header */}
        <section className="relative">
          <div className="relative h-96 md:h-[500px]">
            <Image
              src={article.images?.main || article.heroImage || '/images/journal/journal-1.png'}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-40" />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <div className="max-w-4xl">
                <div className="flex items-center text-white text-sm mb-4">
                  {article.categories && article.categories.length > 0 && (
                    <>
                      <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                        {article.categories[0]}
                      </span>
                      <span className="mx-2">•</span>
                    </>
                  )}
                  <time>{new Date(article.date).toLocaleDateString('de-DE')}</time>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  {article.title}
                </h1>
                
                <p className="text-xl text-white text-opacity-90 mb-4">
                  {article.excerpt}
                </p>
                
                <div className="text-white text-opacity-80">
                  Von {article.author?.name || article.author}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {otherArticles.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  Weitere Artikel
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {otherArticles.slice(0, 2).map((relatedArticle) => (
                    <article key={relatedArticle.id} className="group">
                      <Link href={`/de/journal/${relatedArticle.slug}`} className="block">
                        <div className="relative aspect-[4/3] mb-4 overflow-hidden rounded-lg">
                          <Image
                            src={relatedArticle.images?.main || '/images/journal/journal-2.png'}
                            alt={relatedArticle.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          {relatedArticle.categories && relatedArticle.categories.length > 0 && (
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="bg-gray-100 px-3 py-1 rounded-full">
                                {relatedArticle.categories[0]}
                              </span>
                              <span className="mx-2">•</span>
                              <time>{new Date(relatedArticle.date).toLocaleDateString('de-DE')}</time>
                            </div>
                          )}
                          
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {relatedArticle.title}
                          </h3>
                          
                          <p className="text-gray-600 line-clamp-3">
                            {relatedArticle.excerpt}
                          </p>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Back to Journal */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Link 
                href="/de/journal" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                ← Zurück zum Journal
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error('Error loading journal article:', error);
    notFound();
  }
}