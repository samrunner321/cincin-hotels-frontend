import React from 'react';
import { motion } from 'framer-motion';
import styles from './BaseSection.module.css';

export interface BaseSectionProps {
  // Core props
  id?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  
  // Layout options
  width?: 'full' | 'container' | 'narrow';
  padding?: 'none' | 'small' | 'medium' | 'large';
  spacing?: 'none' | 'small' | 'medium' | 'large';
  alignment?: 'left' | 'center' | 'right';
  
  // Background options
  backgroundColor?: string;
  backgroundImage?: string;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  
  // Animation options
  animate?: boolean;
  animationDelay?: number;
  
  // Children and custom content
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  children: React.ReactNode;
}

const BaseSection: React.FC<BaseSectionProps> = ({
  id,
  className = '',
  title,
  subtitle,
  description,
  width = 'container',
  padding = 'medium',
  spacing = 'medium',
  alignment = 'left',
  backgroundColor,
  backgroundImage,
  overlay = false,
  overlayColor = 'rgba(0, 0, 0, 0.5)',
  overlayOpacity = 0.5,
  animate = false,
  animationDelay = 0,
  headerContent,
  footerContent,
  children,
}) => {
  // Generate section class names
  const sectionClasses = `
    ${styles.baseSection} 
    ${styles[`width${width.charAt(0).toUpperCase() + width.slice(1)}`]}
    ${styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`]}
    ${styles[`spacing${spacing.charAt(0).toUpperCase() + spacing.slice(1)}`]}
    ${styles[`alignment${alignment.charAt(0).toUpperCase() + alignment.slice(1)}`]}
    ${backgroundImage ? styles.hasBackgroundImage : ''}
    ${overlay ? styles.hasOverlay : ''}
    ${className}
  `;

  // Background styles
  const backgroundStyles: React.CSSProperties = {
    backgroundColor: backgroundColor,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
  };

  // Overlay styles
  const overlayStyles: React.CSSProperties = {
    backgroundColor: overlayColor,
    opacity: overlayOpacity,
  };

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        delay: animationDelay,
        when: 'beforeChildren',
        staggerChildren: 0.2,
      }
    },
  };

  // Child animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    },
  };

  // Render header content
  const renderHeader = () => {
    if (headerContent) {
      return headerContent;
    }

    if (!title && !subtitle && !description) {
      return null;
    }

    return (
      <div className={styles.sectionHeader}>
        {subtitle && <h3 className={styles.sectionSubtitle}>{subtitle}</h3>}
        {title && <h2 className={styles.sectionTitle}>{title}</h2>}
        {description && <p className={styles.sectionDescription}>{description}</p>}
      </div>
    );
  };

  // Main render
  if (animate) {
    return (
      <motion.section
        id={id}
        className={sectionClasses}
        style={backgroundStyles}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={sectionVariants}
        data-testid="base-section"
      >
        {overlay && <div className={styles.overlay} style={overlayStyles} />}
        <div className={styles.sectionInner}>
          {renderHeader() && (
            <motion.div variants={itemVariants}>
              {renderHeader()}
            </motion.div>
          )}
          
          <motion.div className={styles.sectionContent} variants={itemVariants}>
            {children}
          </motion.div>
          
          {footerContent && (
            <motion.div className={styles.sectionFooter} variants={itemVariants}>
              {footerContent}
            </motion.div>
          )}
        </div>
      </motion.section>
    );
  }

  // Non-animated version
  return (
    <section
      id={id}
      className={sectionClasses}
      style={backgroundStyles}
      data-testid="base-section"
    >
      {overlay && <div className={styles.overlay} style={overlayStyles} />}
      <div className={styles.sectionInner}>
        {renderHeader()}
        <div className={styles.sectionContent}>
          {children}
        </div>
        {footerContent && (
          <div className={styles.sectionFooter}>
            {footerContent}
          </div>
        )}
      </div>
    </section>
  );
};

export default BaseSection;