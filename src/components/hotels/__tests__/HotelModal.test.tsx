import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HotelModal from '../HotelModal';
import { HotelModalData } from '../../../types/layout';

// Mock getHotelImage
jest.mock('../HotelCard', () => ({
  getHotelImage: jest.fn().mockReturnValue('/images/hotels/hotel-1.jpg'),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />
  }
}));

// Mock hooks
jest.mock('../../../utils/layout-helpers', () => ({
  useClickOutside: jest.fn(),
  useKeyboardNavigation: jest.fn(),
  useBodyScrollLock: jest.fn(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props} />,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock HotelQuickView component
jest.mock('../HotelQuickView', () => {
  return {
    __esModule: true,
    default: ({ hotel }: { hotel: HotelModalData }) => (
      <div data-testid="hotel-quick-view">
        Quick View for {hotel.name}
      </div>
    )
  };
});

describe('HotelModal Component', () => {
  const mockHotel: HotelModalData = {
    name: 'Test Hotel',
    location: 'Test Location',
    description: 'This is a test hotel description',
    slug: 'test-hotel',
    categories: ['Luxury', 'Beachfront', 'Spa'],
    extraInfo: 'Extra info about the hotel',
  };
  
  const mockClose = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders nothing when isOpen is false', () => {
    render(<HotelModal hotel={mockHotel} isOpen={false} onClose={mockClose} />);
    
    // Modal should not be in the document
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  
  it('renders modal content when isOpen is true', () => {
    render(<HotelModal hotel={mockHotel} isOpen={true} onClose={mockClose} />);
    
    // Modal should be in the document
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // Hotel details should be displayed
    expect(screen.getByText('Test Hotel')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText('This is a test hotel description')).toBeInTheDocument();
    expect(screen.getByText('Extra info about the hotel')).toBeInTheDocument();
    
    // Categories should be displayed
    expect(screen.getByText('Luxury')).toBeInTheDocument();
    expect(screen.getByText('Beachfront')).toBeInTheDocument();
    expect(screen.getByText('Spa')).toBeInTheDocument();
    
    // HotelQuickView component should be rendered
    expect(screen.getByTestId('hotel-quick-view')).toBeInTheDocument();
    
    // Action buttons should be present
    expect(screen.getByText('Save for Later')).toBeInTheDocument();
    expect(screen.getByText('View Details')).toBeInTheDocument();
  });
  
  it('calls onClose when close button is clicked', () => {
    render(<HotelModal hotel={mockHotel} isOpen={true} onClose={mockClose} />);
    
    // Click the close button
    fireEvent.click(screen.getByLabelText('Close modal'));
    
    // onClose should have been called
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
  
  it('toggles date selection form when show/hide button is clicked', () => {
    render(<HotelModal hotel={mockHotel} isOpen={true} onClose={mockClose} />);
    
    // Date form should not be visible initially
    expect(screen.queryByLabelText('Check-in')).not.toBeInTheDocument();
    
    // Click the show button
    fireEvent.click(screen.getByText('Show'));
    
    // Date form should now be visible
    expect(screen.getByLabelText('Check-in')).toBeInTheDocument();
    expect(screen.getByLabelText('Check-out')).toBeInTheDocument();
    expect(screen.getByText('Check Rates')).toBeInTheDocument();
    
    // Click the hide button
    fireEvent.click(screen.getByText('Hide'));
    
    // Date form should not be visible again
    expect(screen.queryByLabelText('Check-in')).not.toBeInTheDocument();
  });
});