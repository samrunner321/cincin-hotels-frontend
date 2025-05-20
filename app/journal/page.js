import { getAllJournalArticles } from '../../lib/api';
import JournalGrid from '../../src/components/journal/JournalGrid';
import Hero from '../../src/components/journal/Hero';

export const metadata = {
  title: 'Journal - CinCin Hotels',
  description: 'Discover travel insights, destination guides, and behind-the-scenes stories from our collection of unique hotels.',
  openGraph: {
    title: 'Journal - CinCin Hotels',
    description: 'Discover travel insights, destination guides, and behind-the-scenes stories from our collection of unique hotels.',
    images: [
      {
        url: '/images/og-journal.jpg',
        width: 1200,
        height: 630,
        alt: 'CinCin Hotels Journal',
      },
    ],
  },
};

export default async function JournalPage({ searchParams }) {
  const { category } = searchParams;
  
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
        title="Journal & Stories"
        description="Discover travel insights, destination guides, and behind-the-scenes stories from our collection of unique hotels."
        ctaText="Explore Articles"
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