/**
 * Tests für TravelJourneyDesigner Komponente
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TravelJourneyDesigner from '../TravelJourneyDesigner';
import { UIStateProvider } from '../../../../components/UIStateContext';

// Mock hooks
jest.mock('../../../hooks/useTravelPlanner', () => ({
  useTravelPlanner: () => ({
    preferences: {
      travelerType: null,
      destination: null,
      experiences: [],
      accommodationType: null,
      seasonality: null
    },
    updatePreference: jest.fn((key, value) => {
      // Mock-Implementation für Tests
      mockPreferences[key] = value;
    }),
    resetPreferences: jest.fn(),
    matchedJourney: mockMatchedJourney,
    allMatches: [{ journey: mockMatchedJourney, score: 0.8 }],
    isLoading: false,
    findMatches: jest.fn()
  })
}));

jest.mock('../../../hooks/useFeatureInteraction', () => ({
  useFeatureInteraction: () => ({
    getFeatureProps: () => ({
      onClick: jest.fn(),
      onMouseEnter: jest.fn(),
      onMouseLeave: jest.fn()
    }),
    getTooltipProps: () => ({}),
    isHovered: false,
    isActive: false,
    isTooltipVisible: false
  })
}));

// Mock Next.js-Komponenten
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => (
    <img 
      src={props.src} 
      alt={props.alt} 
      style={{ objectFit: props.objectFit }} 
      data-testid="mock-image"
    />
  )
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props} data-testid="mock-link">
      {children}
    </a>
  )
}));

// Mock-Daten
const mockPreferences: Record<string, any> = {
  travelerType: null,
  destination: null,
  experiences: [],
  accommodationType: null,
  seasonality: null
};

const mockMatchedJourney = {
  id: 1,
  title: "Alpine Wellness Retreat",
  description: "Erholen Sie sich in den Schweizer Alpen mit Spa-Behandlungen.",
  matches: {
    travelerType: ['couple', 'solo'],
    destination: 'mountains',
    experiences: ['wellness', 'nature'],
    accommodationType: ['luxury', 'design'],
    seasonality: ['winter', 'summer']
  },
  hotels: [
    { id: 1, name: "Chetzeron", location: "Crans-Montana", image: "/images/hotels/hotel-1.jpg" },
    { id: 2, name: "LeCrans Hotel & Spa", location: "Crans-Montana", image: "/images/hotels/hotel-2.jpg" }
  ],
  imageBg: "/images/hotels/hotel-2.jpg"
};

// Wrapper für Tests
const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <UIStateProvider>
      {ui}
    </UIStateProvider>
  );
};

describe('TravelJourneyDesigner', () => {
  it('rendert einen Button zum Öffnen des Designers', () => {
    renderWithProvider(<TravelJourneyDesigner isFloating={true} />);
    
    // Der Button sollte da sein
    expect(screen.getByText(/Design Your Journey/i)).toBeInTheDocument();
  });
  
  it('öffnet den Modal, wenn der Button geklickt wird', () => {
    renderWithProvider(<TravelJourneyDesigner isFloating={true} />);
    
    // Klick auf den Button
    fireEvent.click(screen.getByText(/Design Your Journey/i));
    
    // Modal sollte sichtbar sein
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Travel Journey Designer/i)).toBeInTheDocument();
  });
  
  it('zeigt den ersten Schritt an', () => {
    renderWithProvider(<TravelJourneyDesigner initialOpen={true} />);
    
    // Prüfen, ob der erste Schritt angezeigt wird
    expect(screen.getByText(/Welche Art von Reisender sind Sie?/i)).toBeInTheDocument();
    expect(screen.getByText(/Schritt 1 von 5/i)).toBeInTheDocument();
    
    // Optionen sollten angezeigt werden
    expect(screen.getByText(/Alleinreisender/i)).toBeInTheDocument();
    expect(screen.getByText(/Paar/i)).toBeInTheDocument();
    expect(screen.getByText(/Familie/i)).toBeInTheDocument();
    expect(screen.getByText(/Freundesgruppe/i)).toBeInTheDocument();
  });
  
  it('schließt den Modal, wenn der Schließen-Button geklickt wird', () => {
    renderWithProvider(<TravelJourneyDesigner initialOpen={true} />);
    
    // Prüfen, ob der Modal sichtbar ist
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // Klick auf den Schließen-Button
    const closeButton = screen.getByLabelText(/Designer schließen/i);
    fireEvent.click(closeButton);
    
    // Modal sollte verschwinden
    waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
  
  it('zeigt den Fortschrittsbalken korrekt an', () => {
    renderWithProvider(<TravelJourneyDesigner initialOpen={true} />);
    
    // Fortschrittsbalken sollte bei 0% starten (1. Schritt von 5)
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });
  
  it('rendert die Ergebnisseite mit empfohlenen Hotels', () => {
    // Mock für den letzten Schritt
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [5, jest.fn()]);
    
    renderWithProvider(<TravelJourneyDesigner initialOpen={true} />);
    
    // Prüfen, ob die Ergebnisseite angezeigt wird
    expect(screen.getByText(/Ihre perfekte Reiseroute/i)).toBeInTheDocument();
    expect(screen.getByText(/Alpine Wellness Retreat/i)).toBeInTheDocument();
    
    // Empfohlene Hotels sollten angezeigt werden
    expect(screen.getByText(/Empfohlene Hotels/i)).toBeInTheDocument();
    expect(screen.getByText(/Chetzeron/i)).toBeInTheDocument();
    expect(screen.getByText(/LeCrans Hotel & Spa/i)).toBeInTheDocument();
    
    // Links zu Hotels sollten korrekt sein
    const hotelLinks = screen.getAllByTestId('mock-link');
    expect(hotelLinks[0]).toHaveAttribute('href', '/hotels/1');
    expect(hotelLinks[1]).toHaveAttribute('href', '/hotels/2');
  });
});