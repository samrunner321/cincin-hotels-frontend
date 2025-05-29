import { getAllJournalArticles } from '@/lib/api';
import JournalGrid from '@/components/journal/JournalGrid';
import Hero from '@/components/journal/Hero';

export async function generateMetadata({ params }) {
  const { locale } = params;
  
  const metadata = {
    de: {
      title: 'Journal - CinCin Hotels',
      description: 'Entdecken Sie Reiseeinblicke, Reiseführer und Geschichten hinter den Kulissen aus unserer Sammlung einzigartiger Hotels.',
    },
    en: {
      title: 'Journal - CinCin Hotels',
      description: 'Discover travel insights, destination guides, and behind-the-scenes stories from our collection of unique hotels.',
    }
  };

  return {
    ...metadata[locale] || metadata.en,
    openGraph: {
      ...metadata[locale] || metadata.en,
      images: [
        {
          url: '/images/og-journal.jpg',
          width: 1200,
          height: 630,
          alt: 'CinCin Hotels Journal',
        },
      ],
    },
    alternates: {
      languages: {
        'de': `/de/journal`,
        'en': `/en/journal`,
      }
    }
  };
}

export default async function JournalPage({ searchParams, params }) {
  const { category } = searchParams;
  const { locale } = params;
  
  // Fetch all journal articles
  const journalData = await getAllJournalArticles();
  const articles = journalData.data;
  
  // Filter articles by category if provided
  let filteredArticles = articles;
  if (category) {
    filteredArticles = articles.filter(article => 
      article.categories.includes(category)
    );
  }
  
  return (
    <main>
      <Hero 
        title={locale === 'de' ? 'Journal & Geschichten' : 'Journal & Stories'}
        description={
          locale === 'de' 
            ? 'Entdecken Sie Reiseeinblicke, Reiseführer und Geschichten hinter den Kulissen aus unserer Sammlung einzigartiger Hotels.'
            : 'Discover travel insights, destination guides, and behind-the-scenes stories from our collection of unique hotels.'
        }
        ctaText={locale === 'de' ? 'Artikel entdecken' : 'Explore Articles'}
        ctaLink="#journal-grid"
        image="/images/journal/journal-2.png"
      />
      
      <div id="journal-grid">
        <JournalGrid 
          articles={filteredArticles}
          activeFilter={category || 'all'}
        />
      </div>
    </main>
  );
}

// Opt into ISR
export const revalidate = 3600; // Revalidate every hour