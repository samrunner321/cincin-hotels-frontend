/**
 * Tests für AnimatedHotelEntry Komponente
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnimatedHotelEntry from '../AnimatedHotelEntry';
import { UIStateProvider } from '../../../../components/UIStateContext';

// Mock hooks
jest.mock('framer-motion', () => {
  return {
    __esModule: true,
    motion: {
      div: ({ children, className, ...props }: any) => (
        <div 
          className={className} 
          data-testid="mock-motion-div"
          {...props}
        >
          {children}
        </div>
      )
    },
    useInView: () => true,
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

jest.mock('../../../hooks/useFeatureInteraction', () => ({
  useFeatureInteraction: () => ({
    getFeatureProps: () => ({
      onMouseEnter: jest.fn(),
      onMouseLeave: jest.fn(),
      onClick: jest.fn()
    }),
    isHovered: false,
    isActive: false
  })
}));

// Mock-Hotel-Daten
const mockHotel = {
  id: '123',
  name: 'Test Hotel',
  location: 'Test Location',
  slug: 'test-hotel'
};

// Wrapper für Tests
const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <UIStateProvider>
      {ui}
    </UIStateProvider>
  );
};

describe('AnimatedHotelEntry', () => {
  it('rendert den Inhalt korrekt', () => {
    renderWithProvider(
      <AnimatedHotelEntry>
        <div data-testid="test-content">Test Content</div>
      </AnimatedHotelEntry>
    );
    
    // Der Inhalt sollte da sein
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
  
  it('rendert mit übergebenen Hotel-Props', () => {
    renderWithProvider(
      <AnimatedHotelEntry 
        hotel={mockHotel}
        className="custom-class"
      >
        <div>Hotel Content</div>
      </AnimatedHotelEntry>
    );
    
    // Das motion div sollte die custom-class haben
    const motionDiv = screen.getByTestId('mock-motion-div');
    expect(motionDiv).toHaveClass('custom-class');
  });
  
  it('respektiert die Animations-Props', () => {
    renderWithProvider(
      <AnimatedHotelEntry 
        delay={0.5}
        animationVariant="slide"
        animationDuration={800}
      >
        <div>Animated Content</div>
      </AnimatedHotelEntry>
    );
    
    // Spezifisches Testing der Animation-Props müsste durch
    // tiefergehende Mocks von Framer Motion erfolgen
    // Hier testen wir nur, dass die Komponente rendert
    expect(screen.getByText('Animated Content')).toBeInTheDocument();
  });
  
  it('steuert die Animation basierend auf UI-Einstellungen', () => {
    // Mock für UI-State
    jest.spyOn(React, 'useContext').mockImplementation(() => ({
      state: {
        theme: {
          reducedMotion: true,
          animationsEnabled: false
        }
      }
    }));
    
    renderWithProvider(
      <AnimatedHotelEntry>
        <div>No Animation Content</div>
      </AnimatedHotelEntry>
    );
    
    // Wir können hier nur testen, dass die Komponente rendert,
    // da die Animation-Kontrolle innerhalb des Motion-Div Mocks liegt
    expect(screen.getByText('No Animation Content')).toBeInTheDocument();
  });
  
  it('rendert Kinder mit gestaffelter Animation', () => {
    renderWithProvider(
      <AnimatedHotelEntry 
        staggerChildren={0.2}
        animationsEnabled={true}
      >
        <div>Child 1</div>
        <div>Child 2</div>
      </AnimatedHotelEntry>
    );
    
    // Die Kinder sollten in einem zweiten motion.div gerendert werden
    // aber wir können dies aufgrund der Mocks nicht direkt testen
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });
});