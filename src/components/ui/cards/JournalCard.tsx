import React from 'react';
import { FaCalendarAlt, FaUser } from 'react-icons/fa';
import BaseCard, { BaseCardProps } from './BaseCard';
import styles from './JournalCard.module.css';

export interface JournalCardProps {
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    publishedDate?: string;
    author?: {
      name: string;
      avatar?: {
        id: string;
      };
    };
    image?: {
      id: string;
      title?: string;
    };
    categories?: Array<{
      id: string;
      name: string;
      color?: string;
    }>;
    readTime?: number; // in minutes
    isFeatured?: boolean;
  };
  showDate?: boolean;
  showAuthor?: boolean;
  showExcerpt?: boolean;
  showReadTime?: boolean;
  layout?: 'vertical' | 'horizontal' | 'featured';
  showAnimation?: boolean;
  className?: string;
}

const JournalCard: React.FC<JournalCardProps> = ({
  article,
  showDate = true,
  showAuthor = true,
  showExcerpt = true,
  showReadTime = true,
  layout = 'vertical',
  showAnimation = true,
  className = '',
}) => {
  // Format date if available
  const formattedDate = article.publishedDate 
    ? new Date(article.publishedDate).toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      })
    : '';

  // Create tags from categories
  const tags = article.categories || [];
  
  // Build metadata items
  const metadata: JSX.Element[] = [];

  if (showDate && formattedDate) {
    metadata.push(
      <div key="date" className={styles.date}>
        <FaCalendarAlt />
        <span>{formattedDate}</span>
      </div>
    );
  }

  if (showAuthor && article.author) {
    metadata.push(
      <div key="author" className={styles.author}>
        <FaUser />
        <span>{article.author.name}</span>
      </div>
    );
  }

  if (showReadTime && article.readTime) {
    metadata.push(
      <div key="readTime" className={styles.readTime}>
        <span>{article.readTime} min read</span>
      </div>
    );
  }

  // Create badges
  const badges: JSX.Element[] = [];
  if (article.isFeatured) {
    badges.push(
      <div key="featured" className={styles.featuredBadge}>Featured</div>
    );
  }

  // Determine card configuration based on layout
  let imageSize: 'small' | 'medium' | 'large' | 'full' = 'medium';
  let aspectRatio: 'portrait' | 'landscape' | 'square' = 'landscape';
  
  if (layout === 'featured') {
    imageSize = 'full';
    aspectRatio = 'landscape';
  } else if (layout === 'horizontal') {
    imageSize = 'medium';
    aspectRatio = 'square';
  }

  // Map to BaseCard props
  const baseCardProps: BaseCardProps = {
    id: `journal-card-${article.id}`,
    className: `${styles.journalCard} ${styles[`${layout}Layout`]} ${className}`,
    title: article.title,
    description: showExcerpt ? article.excerpt : undefined,
    link: `/journal/${article.slug}`,
    directusImage: article.image,
    imageAlt: article.image?.title || article.title,
    imageSize,
    aspectRatio,
    tags,
    badges,
    metadata,
    layout: layout === 'featured' ? 'overlay' : layout,
    contentAlignment: layout === 'featured' ? 'left' : 'left',
    showAnimation,
    truncateDescription: true,
    truncateLength: layout === 'horizontal' ? 100 : 150,
    primaryAction: {
      label: 'Read Article',
      href: `/journal/${article.slug}`,
    },
  };

  return <BaseCard {...baseCardProps} />;
};

export default JournalCard;