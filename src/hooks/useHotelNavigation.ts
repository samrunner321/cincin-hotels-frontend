import { useState, useCallback } from 'react';
import { Hotel } from '../types/hotel';
import { useRouter } from 'next/router';

/**
 * Interface für die Rückgabe des useHotelNavigation-Hooks
 */
export interface UseHotelNavigationReturn {
  /** Aktuell ausgewähltes Hotel */
  selectedHotel: Hotel | null;
  /** Ist ein Modal für ein Hotel geöffnet? */
  isModalOpen: boolean;
  /** Funktion zum Auswählen eines Hotels */
  selectHotel: (hotel: Hotel | null) => void;
  /** Funktion zum Öffnen eines Hotel-Modals */
  openModal: (hotel: Hotel) => void;
  /** Funktion zum Schließen des Modals */
  closeModal: () => void;
  /** Funktion zum Navigieren zur Detailseite eines Hotels */
  navigateToHotel: (hotel: Hotel) => void;
  /** Funktion für die Behandlung von Klick-Events */
  handleHotelClick: (e: React.MouseEvent, hotel: Hotel) => void;
}

/**
 * Hook für Hotel-Navigation und Modalsteuerung
 * 
 * @param options Optionale Konfiguration
 * @returns Hooks und Hilfsfunktionen für die Hotel-Navigation
 * 
 * @example
 * const { 
 *   selectedHotel, 
 *   isModalOpen, 
 *   handleHotelClick, 
 *   closeModal 
 * } = useHotelNavigation();
 */
export function useHotelNavigation(options: {
  /** Pfadmuster für Hotel-URLs */
  hotelUrlPattern?: string;
  /** Callback für Hotel-Auswahl */
  onSelectHotel?: (hotel: Hotel | null) => void;
  /** Pfadpräfix für Hotel-URLs */
  urlPrefix?: string;
} = {}): UseHotelNavigationReturn {
  const { 
    hotelUrlPattern = '/hotels/[slug]',
    onSelectHotel,
    urlPrefix = '/hotels/'
  } = options;
  
  const router = useRouter();
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  /**
   * Hotel auswählen
   */
  const selectHotel = useCallback((hotel: Hotel | null) => {
    setSelectedHotel(hotel);
    
    if (onSelectHotel) {
      onSelectHotel(hotel);
    }
  }, [onSelectHotel]);
  
  /**
   * Hotel-Modal öffnen
   */
  const openModal = useCallback((hotel: Hotel) => {
    selectHotel(hotel);
    setIsModalOpen(true);
  }, [selectHotel]);
  
  /**
   * Hotel-Modal schließen
   */
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);
  
  /**
   * Zur Detailseite eines Hotels navigieren
   */
  const navigateToHotel = useCallback((hotel: Hotel) => {
    const slug = hotel.slug || hotel.id;
    const url = `${urlPrefix}${slug}`;
    router.push(url);
  }, [router, urlPrefix]);
  
  /**
   * Klick-Handler für Hotels
   */
  const handleHotelClick = useCallback((e: React.MouseEvent, hotel: Hotel) => {
    e.preventDefault();
    openModal(hotel);
  }, [openModal]);
  
  return {
    selectedHotel,
    isModalOpen,
    selectHotel,
    openModal,
    closeModal,
    navigateToHotel,
    handleHotelClick,
  };
}