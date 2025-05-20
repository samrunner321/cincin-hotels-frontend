// @ts-nocheck
'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import BaseModal from '../ui/modal/BaseModal';
import styles from './HotelModal.module.css';

export interface HotelData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  location?: {
    city?: string;
    country?: string;
  };
  images?: Array<{
    id: string;
    url?: string;
    title?: string;
    alt?: string;
  }>;
  rating?: number;
  pricePerNight?: number;
  categories?: Array<{
    id: string;
    name: string;
  }>;
  features?: Array<{
    name: string;
    icon?: string;
  }>;
  rooms?: Array<{
    id: string;
    name: string;
    price?: number;
  }>;
}

export interface HotelModalProps {
  /** Ist das Modal geöffnet? */
  isOpen: boolean;
  /** Callback beim Schließen des Modals */
  onClose: () => void;
  /** Hotel-Daten */
  hotel?: HotelData;
  /** Button-Text für die Buchung */
  bookButtonText?: string;
  /** Callback für den Buchungs-Button */
  onBook?: (hotelId: string) => void;
  /** Callback für Link zum Hotel-Detail */
  onViewDetails?: (hotelId: string) => void;
  /** Button-Text für "Details anzeigen" */
  viewDetailsText?: string;
  /** CSS-Klassen */
  className?: string;
  /** Ob Dummy-Daten angezeigt werden sollen, wenn kein Hotel übergeben wurde */
  showPlaceholder?: boolean;
  /** Ob der Schließen-Button angezeigt werden soll */
  showCloseButton?: boolean;
  /** Ob die Modal-Animation aktiviert sein soll */
  animation?: 'fade' | 'zoom' | 'slide-up';
  /** Ob das Booking-Widget angezeigt werden soll */
  showBookingWidget?: boolean;
}

/**
 * HotelModal Component
 * 
 * Ein spezialisiertes Modal für die Anzeige von Hotel-Details.
 * 
 * @example
 * <HotelModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   hotel={selectedHotel}
 *   onBook={(hotelId) => handleBooking(hotelId)}
 * />
 */
export default function HotelModal({
  isOpen,
  onClose,
  hotel,
  bookButtonText = 'Book Now',
  onBook,
  onViewDetails,
  viewDetailsText = 'View Details',
  className = '',
  showPlaceholder = false,
  showCloseButton = true,
  animation = 'zoom',
  showBookingWidget = false
}: HotelModalProps) {
  // Wenn kein Hotel übergeben wurde und showPlaceholder false ist, nichts rendern
  if (!hotel && !showPlaceholder) return null;
  
  // Placeholder-Daten, wenn kein Hotel übergeben wurde
  const hotelData: HotelData = hotel || {
    id: 'placeholder',
    name: 'Sample Hotel',
    slug: 'sample-hotel',
    description: 'This is a placeholder for a hotel description when no hotel data is provided.',
    location: {
      city: 'Sample City',
      country: 'Sample Country'
    },
    rating: 4.5,
    pricePerNight: 150,
    categories: [
      { id: 'cat1', name: 'Luxury' },
      { id: 'cat2', name: 'City' }
    ],
    features: [
      { name: 'Free WiFi', icon: 'wifi' },
      { name: 'Parking', icon: 'parking' },
      { name: 'Spa', icon: 'spa' }
    ]
  };
  
  /**
   * Handler für den Buchungs-Button
   */
  const handleBook = () => {
    if (onBook) {
      onBook(hotelData.id);
    }
    onClose();
  };
  
  /**
   * Handler für "Details anzeigen"
   */
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(hotelData.id);
    }
    onClose();
  };
  
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={hotelData.name}
      className={cn(styles.hotelModal, className)}
      size="lg"
      animation={animation}
      showCloseButton={showCloseButton}
      hasFooter={true}
      footer={
        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.viewDetailsButton}
            onClick={handleViewDetails}
          >
            {viewDetailsText}
          </button>
          <button
            type="button"
            className={styles.bookButton}
            onClick={handleBook}
          >
            {bookButtonText}
          </button>
        </div>
      }
    >
      <div className={styles.hotelModalContent}>
        {/* Hotel-Bilder */}
        <div className={styles.hotelImages}>
          {hotelData.images && hotelData.images.length > 0 ? (
            <div className={styles.imagesGrid}>
              {hotelData.images.slice(0, 3).map((image, index) => (
                <div 
                  key={image.id} 
                  className={cn(
                    styles.imageContainer,
                    index === 0 && styles.mainImage
                  )}
                >
                  <img
                    src={image.url || `/placeholder-${index + 1}.jpg`}
                    alt={image.alt || `${hotelData.name} - Image ${index + 1}`}
                    className={styles.hotelImage}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.placeholderImage}>
              <div className={styles.placeholderImageText}>
                No images available
              </div>
            </div>
          )}
        </div>
        
        {/* Hotel-Details */}
        <div className={styles.hotelDetails}>
          {/* Standort */}
          {hotelData.location && (
            <div className={styles.hotelLocation}>
              {[hotelData.location.city, hotelData.location.country]
                .filter(Boolean)
                .join(', ')}
            </div>
          )}
          
          {/* Bewertung */}
          {hotelData.rating && (
            <div className={styles.hotelRating}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      styles.star,
                      i < Math.floor(hotelData.rating || 0) && styles.starFilled,
                      i === Math.floor(hotelData.rating || 0) && 
                      hotelData.rating % 1 > 0 && 
                      styles.starHalf
                    )}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className={styles.ratingValue}>
                {hotelData.rating.toFixed(1)}
              </span>
            </div>
          )}
          
          {/* Kategorien */}
          {hotelData.categories && hotelData.categories.length > 0 && (
            <div className={styles.hotelCategories}>
              {hotelData.categories.map(category => (
                <span key={category.id} className={styles.categoryTag}>
                  {category.name}
                </span>
              ))}
            </div>
          )}
          
          {/* Beschreibung */}
          {hotelData.description && (
            <div className={styles.hotelDescription}>
              <p>{hotelData.description}</p>
            </div>
          )}
          
          {/* Features */}
          {hotelData.features && hotelData.features.length > 0 && (
            <div className={styles.hotelFeatures}>
              <h3 className={styles.featuresTitle}>Hotel Features</h3>
              <div className={styles.featuresList}>
                {hotelData.features.map((feature, index) => (
                  <div key={index} className={styles.featureItem}>
                    {feature.icon && (
                      <span className={styles.featureIcon}>
                        {renderFeatureIcon(feature.icon)}
                      </span>
                    )}
                    <span className={styles.featureName}>{feature.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Preis */}
          {hotelData.pricePerNight && (
            <div className={styles.hotelPrice}>
              <span className={styles.priceValue}>
                {hotelData.pricePerNight} €
              </span>
              <span className={styles.priceNight}>per night</span>
            </div>
          )}
          
          {/* Booking-Widget */}
          {showBookingWidget && (
            <div className={styles.bookingWidget}>
              <h3 className={styles.bookingTitle}>Check Availability</h3>
              <div className={styles.bookingForm}>
                <div className={styles.dateInputs}>
                  <div className={styles.dateInput}>
                    <label htmlFor="check-in">Check-in</label>
                    <input
                      type="date"
                      id="check-in"
                      className={styles.dateField}
                    />
                  </div>
                  <div className={styles.dateInput}>
                    <label htmlFor="check-out">Check-out</label>
                    <input
                      type="date"
                      id="check-out"
                      className={styles.dateField}
                    />
                  </div>
                </div>
                <div className={styles.guestsInput}>
                  <label htmlFor="guests">Guests</label>
                  <select id="guests" className={styles.guestField}>
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
}

/**
 * Hilfsfunktion zum Rendern von Feature-Icons
 */
function renderFeatureIcon(icon: string): React.ReactNode {
  // Hier könnten echte Icons basierend auf dem Icon-Namen gerendert werden
  switch (icon) {
    case 'wifi':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.iconSvg}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-6h2v2h-2zm0-8h2v6h-2z"/>
        </svg>
      );
    case 'parking':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.iconSvg}>
          <path d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm0 10H10V7h3c1.1 0 2 .9 2 2s-.9 2-2 2z"/>
        </svg>
      );
    case 'spa':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.iconSvg}>
          <path d="M15.49 9.63c-.18-2.79-1.31-5.51-3.43-7.63-2.14 2.14-3.32 4.86-3.55 7.63 1.28.68 2.46 1.56 3.49 2.63 1.03-1.06 2.21-1.94 3.49-2.63zm-3.44 4.44c-.95-1.06-2.06-1.94-3.3-2.63-1.26.68-2.39 1.57-3.38 2.63-.92 1.05-1.7 2.23-2.23 3.49 2.93 2.97 7.22 3.01 10.12 0-.58-1.26-1.31-2.44-2.21-3.49zM12 2c4.21 0 8.3 2.2 10.7 6-2.37 3.83-6.5 6-10.7 6-4.2 0-8.31-2.17-10.7-6 2.4-3.8 6.5-6 10.7-6z"/>
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.iconSvg}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
      );
  }
}