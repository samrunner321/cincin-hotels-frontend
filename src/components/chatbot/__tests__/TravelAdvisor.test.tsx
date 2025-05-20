/**
 * Tests für TravelAdvisor Komponente
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TravelAdvisor from '../TravelAdvisor';
import { UIStateProvider } from '../../../../components/UIStateContext';

// Mock hooks
jest.mock('../../../hooks/useFeatureInteraction', () => ({
  useFeatureInteraction: () => ({
    getFeatureProps: () => ({
      onClick: jest.fn(),
      onMouseEnter: jest.fn(),
      onMouseLeave: jest.fn(),
      'aria-expanded': false,
      'data-feature-id': 'mock-feature'
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
  default: ({ src, alt, ...props }: any) => (
    <img 
      src={src} 
      alt={alt} 
      {...props} 
      data-testid="mock-image"
    />
  )
}));

// Formatierungsfunktion für Tests
const testTimeFormatter = (date: Date): string => {
  return '12:34';
};

// Wrapper für Tests
const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <UIStateProvider>
      {ui}
    </UIStateProvider>
  );
};

describe('TravelAdvisor', () => {
  beforeEach(() => {
    // Mock timer for animations and delayed responses
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('rendert einen Button zum Öffnen des Chats', () => {
    renderWithProvider(<TravelAdvisor isFloating={true} />);
    
    // Der Button sollte da sein
    expect(screen.getByRole('button', { name: /Reiseberater öffnen/i })).toBeInTheDocument();
  });
  
  it('öffnet den Chat, wenn der Button geklickt wird', () => {
    renderWithProvider(<TravelAdvisor isFloating={true} />);
    
    // Klick auf den Button
    fireEvent.click(screen.getByRole('button', { name: /Reiseberater öffnen/i }));
    
    // Chat sollte sichtbar sein
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Travel Advisor/i)).toBeInTheDocument();
  });
  
  it('zeigt die initiale Nachricht an', () => {
    const initialMessage = "Test Initial Message";
    renderWithProvider(<TravelAdvisor initialOpen={true} initialMessage={initialMessage} />);
    
    // Initiale Nachricht sollte angezeigt werden
    expect(screen.getByText(initialMessage)).toBeInTheDocument();
  });
  
  it('schließt den Chat, wenn der Schließen-Button geklickt wird', () => {
    renderWithProvider(<TravelAdvisor initialOpen={true} />);
    
    // Prüfen, ob der Chat sichtbar ist
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // Klick auf den Schließen-Button
    const closeButton = screen.getByLabelText(/Chat schließen/i);
    fireEvent.click(closeButton);
    
    // Chat sollte verschwinden
    waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
  
  it('zeigt Vorschlagbuttons an', () => {
    const testSuggestions = ["Test Suggestion 1", "Test Suggestion 2"];
    renderWithProvider(<TravelAdvisor initialOpen={true} initialSuggestions={testSuggestions} />);
    
    // Vorschläge sollten angezeigt werden
    expect(screen.getByText("Test Suggestion 1")).toBeInTheDocument();
    expect(screen.getByText("Test Suggestion 2")).toBeInTheDocument();
  });
  
  it('ermöglicht Texteingabe und Nachrichtenversand', async () => {
    renderWithProvider(<TravelAdvisor initialOpen={true} />);
    
    // Text eingeben
    const input = screen.getByPlaceholderText(/Schreiben Sie Ihre Nachricht/i);
    fireEvent.change(input, { target: { value: 'Test Message' } });
    
    // Nachricht senden
    const sendButton = screen.getByLabelText(/Nachricht senden/i);
    fireEvent.click(sendButton);
    
    // Benutzernachricht sollte angezeigt werden
    expect(screen.getByText('Test Message')).toBeInTheDocument();
    
    // Schreib-Indikator sollte angezeigt werden
    expect(document.querySelector('.flex.space-x-1')).toBeInTheDocument();
    
    // Timer für Antwort
    jest.advanceTimersByTime(1000);
    
    // Antwort sollte angezeigt werden
    await waitFor(() => {
      expect(screen.getByText(/Das ist eine ausgezeichnete Frage zu Test Message/i)).toBeInTheDocument();
    });
  });
  
  it('aktualisiert die Vorschläge basierend auf dem Gesprächsverlauf', async () => {
    renderWithProvider(<TravelAdvisor initialOpen={true} />);
    
    // Text mit "berg" eingeben
    const input = screen.getByPlaceholderText(/Schreiben Sie Ihre Nachricht/i);
    fireEvent.change(input, { target: { value: 'Erzählen Sie mir von Bergen' } });
    
    // Nachricht senden
    const sendButton = screen.getByLabelText(/Nachricht senden/i);
    fireEvent.click(sendButton);
    
    // Timer für Antwort
    jest.advanceTimersByTime(1000);
    
    // Neue bergbezogene Vorschläge sollten angezeigt werden
    await waitFor(() => {
      expect(screen.getByText(/Erzählen Sie mir von Luxus-Berghotels/i)).toBeInTheDocument();
      expect(screen.getByText(/Beste Reisezeit für die Alpen/i)).toBeInTheDocument();
    });
  });
  
  it('sendet eine Nachricht, wenn Enter gedrückt wird', () => {
    renderWithProvider(<TravelAdvisor initialOpen={true} />);
    
    // Text eingeben
    const input = screen.getByPlaceholderText(/Schreiben Sie Ihre Nachricht/i);
    fireEvent.change(input, { target: { value: 'Enter Test' } });
    
    // Enter drücken
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    // Benutzernachricht sollte angezeigt werden
    expect(screen.getByText('Enter Test')).toBeInTheDocument();
  });
  
  it('ruft einen benutzerdefinierten responseGenerator auf, wenn bereitgestellt', async () => {
    const mockResponseGenerator = jest.fn().mockResolvedValue('Custom Response');
    
    renderWithProvider(
      <TravelAdvisor 
        initialOpen={true} 
        responseGenerator={mockResponseGenerator}
      />
    );
    
    // Text eingeben und senden
    const input = screen.getByPlaceholderText(/Schreiben Sie Ihre Nachricht/i);
    fireEvent.change(input, { target: { value: 'Generate Custom Response' } });
    fireEvent.click(screen.getByLabelText(/Nachricht senden/i));
    
    // Timer für Antwort
    jest.advanceTimersByTime(1000);
    
    // responseGenerator sollte aufgerufen worden sein
    await waitFor(() => {
      expect(mockResponseGenerator).toHaveBeenCalledWith('Generate Custom Response');
    });
  });
});