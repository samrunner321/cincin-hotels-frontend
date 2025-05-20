import React from 'react';
import { motion } from 'framer-motion';
import BaseSection from '../../ui/BaseSection';
import styles from './HighlightsSection.module.css';

export interface Highlight {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  directusImage?: {
    id: string;
    title?: string;
  };
}

export interface HighlightsSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  highlights: Highlight[];
  backgroundColor?: string;
  showAnimation?: boolean;
  className?: string;
}

const HighlightsSection: React.FC<HighlightsSectionProps> = ({
  title = 'Destination Highlights',
  subtitle = 'Experience the Best',
  description,
  highlights,
  backgroundColor,
  showAnimation = true,
  className = '',
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
  };

  // Render highlight items
  const renderHighlights = () => {
    return highlights.map((highlight, index) => {
      const isImageRight = index % 2 !== 0;
      
      const content = (
        <div className={styles.highlightContent}>
          <h3 className={styles.highlightTitle}>{highlight.title}</h3>
          <p className={styles.highlightDescription}>{highlight.description}</p>
        </div>
      );
      
      const image = (highlight.imageUrl || highlight.directusImage) && (
        <div className={styles.highlightImageContainer}>
          {highlight.directusImage ? (
            <img 
              src={`/api/assets/${highlight.directusImage.id}`} 
              alt={highlight.directusImage.title || highlight.title}
              className={styles.highlightImage}
            />
          ) : highlight.imageUrl ? (
            <img 
              src={highlight.imageUrl} 
              alt={highlight.title}
              className={styles.highlightImage}
            />
          ) : null}
        </div>
      );

      if (showAnimation) {
        return (
          <motion.div
            key={highlight.id}
            className={`${styles.highlight} ${isImageRight ? styles.imageRight : styles.imageLeft}`}
            variants={itemVariants}
          >
            {isImageRight ? (
              <>
                {content}
                {image}
              </>
            ) : (
              <>
                {image}
                {content}
              </>
            )}
          </motion.div>
        );
      }

      return (
        <div
          key={highlight.id}
          className={`${styles.highlight} ${isImageRight ? styles.imageRight : styles.imageLeft}`}
        >
          {isImageRight ? (
            <>
              {content}
              {image}
            </>
          ) : (
            <>
              {image}
              {content}
            </>
          )}
        </div>
      );
    });
  };

  return (
    <BaseSection
      title={title}
      subtitle={subtitle}
      description={description}
      backgroundColor={backgroundColor}
      padding="large"
      spacing="medium"
      width="container"
      animate={showAnimation}
      className={`${styles.highlightsSection} ${className}`}
    >
      <div className={styles.highlightsContainer}>
        {renderHighlights()}
      </div>
    </BaseSection>
  );
};

export default HighlightsSection;