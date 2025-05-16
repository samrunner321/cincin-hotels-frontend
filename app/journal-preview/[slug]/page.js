import { notFound } from 'next/navigation';
import { getJournalArticleBySlug } from '../../../lib/api';
import { JournalPostContent } from '../../../components/journal_post';

export const metadata = {
  title: 'Journal Article Preview - CinCin Hotels',
  description: 'Preview our latest journal article design.',
};

export default async function JournalPreviewPage({ params }) {
  try {
    // Fetch article data
    const { slug } = params;
    const articleData = await getJournalArticleBySlug(slug);
    
    // If article not found, return 404
    if (!articleData || !articleData.data) {
      return notFound();
    }
    
    const article = articleData.data;
    const relatedHotels = article.relatedHotels || [];
    
    // Update metadata
    metadata.title = `${article.title} - CinCin Hotels Journal Preview`;
    metadata.description = article.excerpt;
    
    return (
      <JournalPostContent 
        post={article}
        relatedHotels={relatedHotels}
      />
    );
  } catch (error) {
    console.error('Error fetching article data:', error);
    return notFound();
  }
}