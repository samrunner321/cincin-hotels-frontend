'use client';

import JournalPostHero from './JournalPostHero';
import ArticleInfo from './ArticleInfo';
import TabbedAttractionsSection from './TabbedAttractionsSection';
import TravelContent from './TravelContent';
import RelatedHotelsSection from './RelatedHotelsSection';

export default function JournalPostContent({ 
  post = {},
  relatedHotels = []
}) {
  if (!post) {
    return <div className="text-center py-12">Article not found</div>;
  }

  const {
    title = "A Taste of Mocha Mousse",
    categories = ["All", "Design"],
    excerpt = "Explore the must-see highlights of this year's bold and boundary-pushing",
    heroImage = "/images/journal/journal-2.png",
    authorName = "Samuel Renner",
    date = "12/02/2025",
    subtitle = "Discover the Magic of Zermatt",
    content = "Surrounded by some of the highest peaks in the Alps, Zermatt is a paradise for outdoor enthusiasts and nature lovers alike.",
    attractions = [],
    mainImage = "/images/journal/journal-1.png",
    secondaryImage = "/images/journal/journal-3.png",
    tertiaryImage = "/images/journal/journal-4.png",
    mainContent = "Zermatt is a world-class skiing destination...",
    secondaryContent = "The Gornergrat Railway takes you to 3,089 meters..."
  } = post;

  return (
    <>
      <JournalPostHero 
        backgroundImage={heroImage}
        categories={categories}
        title={title}
        excerpt={excerpt}
        ctaLink="#content"
      />
      
      <div id="content">
        <ArticleInfo 
          authorName={authorName}
          date={date}
          title={subtitle}
          content={content}
          leftImage={mainImage}
          rightImage={secondaryImage}
        />
        
        {attractions && attractions.length > 0 && (
          <TabbedAttractionsSection 
            title="CinCin's Picks: Best Food & Drink"
            attractions={attractions}
          />
        )}
        
        <TravelContent 
          mainImage={mainImage}
          secondaryImage={secondaryImage}
          tertiaryImage={tertiaryImage}
          mainContent={mainContent}
          secondaryContent={secondaryContent}
        />
        
        {relatedHotels && relatedHotels.length > 0 && (
          <RelatedHotelsSection 
            title="Where to Stay"
            hotels={relatedHotels}
          />
        )}
      </div>
    </>
  );
}