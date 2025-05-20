/**
 * HotelMapView Component Unit Test
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HotelMapView from '../HotelMapView';
import { EnhancedTranslationsProvider } from '../../../../components/i18n/EnhancedTranslationsProvider';

// Mock the map components to avoid DOM issues in tests
jest.mock('../../ui/maps/MapComponent', () => {
  return {
    __esModule: true,
    default: ({ items, onItemClick, isLoading, errorMessage, className }: any) => (
      <div 
        data-testid="map-component" 
        className={className}
        data-items={JSON.stringify(items)}
        data-loading={isLoading}
        data-error={errorMessage}
      >
        <button 
          data-testid="test-marker"
          onClick={() => onItemClick && onItemClick(items[0])}
        >
          Test Marker
        </button>
      </div>
    ),
  };
});

// Mock the hooks and utilities
jest.mock('../../../hooks/useRtl', () => ({
  __esModule: true,
  useRtl: () => ({
    isRtl: false,
    direction: 'ltr',
    getFlexDirection: (dir: any) => dir,
    getTextAlign: (align: any) => align,
    getSideProperty: () => ({}),
    getOrderedArray: (arr: any) => arr,
    flip: (val: any) => val,
    getIconRotation: (val: any) => val,
  }),
}));

jest.mock('../../../utils/image-helpers', () => ({
  getHotelImage: jest.fn((image, slug) => `/images/hotels/${slug || 'default'}.jpg`),
}));

// Test data
const mockHotels = [
  {
    id: '1',
    name: 'Grand Hotel',
    location: 'Zurich, Switzerland',
    slug: 'grand-hotel-zurich',
    image: '/images/hotels/grand-hotel.jpg',
    coordinates: { lat: 47.3769, lng: 8.5417 }
  },
  {
    id: '2',
    name: 'Mountain Resort',
    location: 'Alps, Switzerland',
    slug: 'mountain-resort-alps',
    image: '/images/hotels/mountain-resort.jpg',
    coordinates: { lat: 46.8182, lng: 8.2275 }
  }
];

// Wrap tests in the translations provider
const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <EnhancedTranslationsProvider initialLanguage="en">
      {ui}
    </EnhancedTranslationsProvider>
  );
};

describe('HotelMapView Component', () => {
  it('renders correctly with hotels data', async () => {
    renderWithProvider(<HotelMapView hotels={mockHotels} onHotelClick={() => {}} />);
    
    // Map component should be rendered
    const mapComponent = screen.getByTestId('map-component');
    expect(mapComponent).toBeInTheDocument();
    
    // Check if hotels data was passed correctly
    const itemsData = JSON.parse(mapComponent.getAttribute('data-items') || '[]');
    expect(itemsData).toHaveLength(2);
    expect(itemsData[0].name).toBe('Grand Hotel');
  });
  
  it('shows loading state initially', () => {
    renderWithProvider(<HotelMapView hotels={mockHotels} onHotelClick={() => {}} />);
    
    const mapComponent = screen.getByTestId('map-component');
    expect(mapComponent.getAttribute('data-loading')).toBe('true');
  });
  
  it('handles hotel click correctly', () => {
    const mockOnClick = jest.fn();
    renderWithProvider(<HotelMapView hotels={mockHotels} onHotelClick={mockOnClick} />);
    
    // Find and click the test marker
    const marker = screen.getByTestId('test-marker');
    fireEvent.click(marker);
    
    // Check if the click handler was called with the correct hotel
    expect(mockOnClick).toHaveBeenCalledWith(mockHotels[0]);
  });
  
  it('renders with custom class and styles', () => {
    const customClassName = 'custom-map-class';
    renderWithProvider(
      <HotelMapView 
        hotels={mockHotels} 
        onHotelClick={() => {}} 
        className={customClassName}
        style={{ height: '800px' }}
      />
    );
    
    const mapComponent = screen.getByTestId('map-component');
    expect(mapComponent).toHaveClass(customClassName);
  });
  
  it('transitions from loading to loaded state', async () => {
    renderWithProvider(<HotelMapView hotels={mockHotels} onHotelClick={() => {}} />);
    
    // Initially loading
    const mapComponent = screen.getByTestId('map-component');
    expect(mapComponent.getAttribute('data-loading')).toBe('true');
    
    // Should transition to loaded state
    await waitFor(() => {
      expect(mapComponent.getAttribute('data-loading')).toBe('false');
    }, { timeout: 1000 });
  });
});