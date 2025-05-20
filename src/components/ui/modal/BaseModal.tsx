import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../../lib/utils';
import styles from './BaseModal.module.css';

export interface BaseModalProps {
  /** Ist das Modal geöffnet? */
  isOpen: boolean;
  /** Callback beim Schließen des Modals */
  onClose: () => void;
  /** Inhalt des Modals */
  children: React.ReactNode;
  /** ID des Modals für Accessibility */
  id?: string;
  /** Titel des Modals */
  title?: React.ReactNode;
  /** CSS-Klassen */
  className?: string;
  /** CSS-Klassen für den Overlay */
  overlayClassName?: string;
  /** CSS-Klassen für den Modal-Body */
  bodyClassName?: string;
  /** Ob das Modal durch Klick auf den Overlay geschlossen werden kann */
  closeOnOverlayClick?: boolean;
  /** Ob das Modal durch ESC-Taste geschlossen werden kann */
  closeOnEsc?: boolean;
  /** Position des Modals */
  position?: 'center' | 'top' | 'right' | 'bottom' | 'left' | 'full';
  /** Größe des Modals */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Animation des Modals */
  animation?: 'fade' | 'zoom' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'none';
  /** Customizing für die Animation */
  animationConfig?: {
    /** Dauer der Animation in Sekunden */
    duration?: number;
    /** Verzögerung der Animation in Sekunden */
    delay?: number;
    /** Easing-Funktion */
    easing?: string;
  };
  /** Ob der Body-Scroll gesperrt werden soll */
  lockBodyScroll?: boolean;
  /** Ob ein Close-Button angezeigt werden soll */
  showCloseButton?: boolean;
  /** Ob ein Fokus-Trap verwendet werden soll */
  trapFocus?: boolean;
  /** Ob ein initialer Fokus gesetzt werden soll */
  initialFocus?: boolean;
  /** Element, auf das der Fokus nach dem Schließen gesetzt werden soll */
  finalFocusRef?: React.RefObject<HTMLElement>;
  /** Ob das Modal einen Header haben soll */
  hasHeader?: boolean;
  /** Ob das Modal einen Footer haben soll */
  hasFooter?: boolean;
  /** Footer-Inhalt */
  footer?: React.ReactNode;
  /** Overlay-Styles */
  overlayStyles?: React.CSSProperties;
  /** Modal-Styles */
  modalStyles?: React.CSSProperties;
  /** Z-Index für das Modal */
  zIndex?: number;
  /** Ob das Modal aria-modal sein soll */
  ariaModal?: boolean;
  /** Ob das Modal scrollbar sein soll */
  scrollable?: boolean;
  /** Button-Text für den Close-Button */
  closeButtonLabel?: string;
  /** Aria-Label für das Modal */
  ariaLabel?: string;
  /** Beschreibung des Modals für Screen-Reader */
  ariaDescription?: string;
}

/**
 * BaseModal Component
 * 
 * Eine flexible und zugängliche Modal-Komponente, die als Basis für verschiedene Modal-Typen dienen kann.
 * 
 * @example
 * <BaseModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   title="Modal Title"
 * >
 *   <p>Modal Content</p>
 * </BaseModal>
 */
export default function BaseModal({
  isOpen,
  onClose,
  children,
  id,
  title,
  className = '',
  overlayClassName = '',
  bodyClassName = '',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  position = 'center',
  size = 'md',
  animation = 'fade',
  animationConfig = {
    duration: 0.3,
    delay: 0,
    easing: 'easeInOut'
  },
  lockBodyScroll = true,
  showCloseButton = true,
  trapFocus = true,
  initialFocus = true,
  finalFocusRef,
  hasHeader = !!title,
  hasFooter = false,
  footer,
  overlayStyles,
  modalStyles,
  zIndex = 50,
  ariaModal = true,
  scrollable = true,
  closeButtonLabel = 'Close',
  ariaLabel,
  ariaDescription
}: BaseModalProps) {
  const isClient = typeof window !== 'undefined';

  // Wenn wir im Server-Rendering sind oder das Modal nicht geöffnet ist, nichts rendern
  if (!isClient || !isOpen) return null;
  
  // Refs für Fokus-Management
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  
  // Body-Scroll-Lock
  useEffect(() => {
    if (isOpen && lockBodyScroll) {
      // Speichere den aktuellen Overflow-Wert
      const originalOverflow = document.body.style.overflow;
      // Speichere das aktuell fokussierte Element
      previousFocus.current = document.activeElement as HTMLElement;
      
      // Sperre den Body-Scroll
      document.body.style.overflow = 'hidden';
      
      // Setze den Fokus auf das Modal, wenn initialFocus true ist
      if (initialFocus && modalRef.current) {
        setTimeout(() => {
          const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements && focusableElements.length > 0) {
            focusableElements[0].focus();
          } else {
            modalRef.current?.focus();
          }
        }, 50);
      }
      
      return () => {
        // Stelle den ursprünglichen Overflow-Wert wieder her
        document.body.style.overflow = originalOverflow;
        
        // Setze den Fokus zurück
        if (finalFocusRef && finalFocusRef.current) {
          finalFocusRef.current.focus();
        } else if (previousFocus.current) {
          previousFocus.current.focus();
        }
      };
    }
  }, [isOpen, lockBodyScroll, initialFocus, finalFocusRef]);
  
  // Tastatur-Support (ESC zum Schließen)
  useEffect(() => {
    if (isOpen && closeOnEsc) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose, closeOnEsc]);
  
  // Fokus-Falle
  useEffect(() => {
    if (isOpen && trapFocus && modalRef.current) {
      const modalElement = modalRef.current;
      const focusableElements = modalElement.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      };
      
      modalElement.addEventListener('keydown', handleTabKey);
      return () => modalElement.removeEventListener('keydown', handleTabKey);
    }
  }, [isOpen, trapFocus]);
  
  // Definiere Animation-Varianten basierend auf position und animation
  const getAnimationVariants = () => {
    const duration = animationConfig.duration || 0.3;
    const delay = animationConfig.delay || 0;
    const easing = animationConfig.easing || 'easeInOut';
    
    const defaultTransition = {
      duration,
      delay,
      ease: easing
    };
    
    switch (animation) {
      case 'zoom':
        return {
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1, transition: defaultTransition },
          exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
        };
      case 'slide-up':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: defaultTransition },
          exit: { opacity: 0, y: 50, transition: { duration: 0.2 } }
        };
      case 'slide-down':
        return {
          hidden: { opacity: 0, y: -50 },
          visible: { opacity: 1, y: 0, transition: defaultTransition },
          exit: { opacity: 0, y: -50, transition: { duration: 0.2 } }
        };
      case 'slide-left':
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0, transition: defaultTransition },
          exit: { opacity: 0, x: 50, transition: { duration: 0.2 } }
        };
      case 'slide-right':
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0, transition: defaultTransition },
          exit: { opacity: 0, x: -50, transition: { duration: 0.2 } }
        };
      case 'none':
        return {
          hidden: { opacity: 1 },
          visible: { opacity: 1 },
          exit: { opacity: 1 }
        };
      case 'fade':
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: defaultTransition },
          exit: { opacity: 0, transition: { duration: 0.2 } }
        };
    }
  };
  
  // Overlay-Animation-Varianten
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: animationConfig.duration || 0.3, 
        delay: 0 
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.2, 
        delay: 0 
      }
    }
  };
  
  // Content-Animation-Varianten
  const contentVariants = getAnimationVariants();
  
  // CSS-Klassen basierend auf props
  const modalClasses = cn(
    styles.baseModal,
    styles[`position${position.charAt(0).toUpperCase() + position.slice(1)}`],
    styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`],
    scrollable && styles.scrollable,
    className
  );
  
  const overlayClasses = cn(
    styles.overlay,
    overlayClassName
  );
  
  const bodyClasses = cn(
    styles.modalBody,
    scrollable && styles.scrollable,
    bodyClassName
  );
  
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className={styles.modalContainer}
          style={{ zIndex }}
          role="presentation"
        >
          {/* Overlay */}
          <motion.div
            className={overlayClasses}
            style={overlayStyles}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            onClick={closeOnOverlayClick ? onClose : undefined}
            aria-hidden="true"
          />
          
          {/* Modal */}
          <motion.div
            ref={modalRef}
            id={id}
            className={modalClasses}
            style={modalStyles}
            role="dialog"
            aria-modal={ariaModal}
            aria-labelledby={title ? `${id}-title` : undefined}
            aria-describedby={ariaDescription ? `${id}-description` : undefined}
            aria-label={ariaLabel}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}
            tabIndex={-1}
          >
            {/* Header */}
            {hasHeader && (
              <div className={styles.modalHeader}>
                {typeof title === 'string' ? (
                  <h2 id={`${id}-title`} className={styles.modalTitle}>
                    {title}
                  </h2>
                ) : (
                  title
                )}
                
                {showCloseButton && (
                  <button
                    type="button"
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label={closeButtonLabel}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={styles.closeIcon} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M6 18L18 6M6 6l12 12" 
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}
            
            {/* Body */}
            <div className={bodyClasses}>
              {children}
              {ariaDescription && (
                <div id={`${id}-description`} className="sr-only">
                  {ariaDescription}
                </div>
              )}
            </div>
            
            {/* Footer */}
            {hasFooter && (
              <div className={styles.modalFooter}>
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}