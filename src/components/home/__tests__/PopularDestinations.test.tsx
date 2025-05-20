import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PopularDestinations from '../PopularDestinations';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  Variants: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} data-testid={`image-${props.src.split('/').pop().split('.')[0]}`} />;
  },
}));

// Mock ResponsiveDirectusImage
jest.mock('../../common/ResponsiveDirectusImage', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img src="mocked-directus-image.jpg" alt={props.alt} data-testid={`directus-image-${props.fileId}`} />;
  },
}));

describe('PopularDestinations Component', () => {
  const mockDestinations = [
    {
      id: 1,
      name: 'Test Destination 1',
      country: 'Test Country 1',
      description: 'Test Description 1',
      image: '/images/test-destination-1.jpg',
      url: '/destinations/test-1'
    },
    {
      id: 2,
      name: 'Test Destination 2',
      country: 'Test Country 2',
      description: 'Test Description 2',
      image: '/images/test-destination-2.jpg',
      url: '/destinations/test-2'
    }
  ];

  const mockHotels = [
    {
      id: 1,
      name: 'Test Hotel 1',
      image: '/images/test-hotel-1.jpg',
      url: '/hotels/test-1'
    },
    {
      id: 2,
      name: 'Test Hotel 2',
      image: '/images/test-hotel-2.jpg',
      url: '/hotels/test-2'
    }
  ];

  it('renders with default props', () => {
    render(<PopularDestinations />);
    
    // Check title is rendered
    expect(screen.getByText('Popular Destinations')).toBeInTheDocument();
    
    // Check default destinations are rendered
    expect(screen.getByText('South Tyrol')).toBeInTheDocument();
    expect(screen.getByText('Bretagne')).toBeInTheDocument();
    
    // Check default hotels are rendered
    expect(screen.getByText('Schgaguler Hotel')).toBeInTheDocument();
    expect(screen.getByText('Rockresort')).toBeInTheDocument();
    expect(screen.getByText('Giardino Mountain')).toBeInTheDocument();
    expect(screen.getByText('Aurora Spa Villas')).toBeInTheDocument();
  });

  it('renders with custom title and subtitle', () => {
    const title = 'Custom Title';
    const subtitle = 'Custom Subtitle';
    
    render(<PopularDestinations title={title} subtitle={subtitle} />);
    
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(subtitle)).toBeInTheDocument();
  });

  it('renders custom destinations and hotels', () => {
    render(
      <PopularDestinations 
        featuredDestinations={mockDestinations} 
        hotels={mockHotels} 
      />
    );
    
    // Check custom destinations are rendered
    expect(screen.getByText('Test Destination 1')).toBeInTheDocument();
    expect(screen.getByText('Test Destination 2')).toBeInTheDocument();
    
    // Check custom hotels are rendered
    expect(screen.getByText('Test Hotel 1')).toBeInTheDocument();
    expect(screen.getByText('Test Hotel 2')).toBeInTheDocument();
  });

  it('calls onDestinationClick when a destination is clicked', async () => {
    const user = userEvent.setup();
    const onDestinationClick = jest.fn();
    
    render(
      <PopularDestinations 
        featuredDestinations={mockDestinations} 
        onDestinationClick={onDestinationClick} 
      />
    );
    
    // Find and click the first destination
    const destinationDiv = screen.getByText('Test Destination 1').closest('div');
    await user.click(destinationDiv!);
    
    // Check that click handler was called with correct destination
    expect(onDestinationClick).toHaveBeenCalledWith(mockDestinations[0]);
  });

  it('calls onHotelClick when a hotel is clicked', async () => {
    const user = userEvent.setup();
    const onHotelClick = jest.fn();
    
    render(
      <PopularDestinations 
        hotels={mockHotels} 
        onHotelClick={onHotelClick} 
      />
    );
    
    // Find and click the first hotel
    const hotelDiv = screen.getByText('Test Hotel 1').closest('div');
    await user.click(hotelDiv!);
    
    // Check that click handler was called with correct hotel
    expect(onHotelClick).toHaveBeenCalledWith(mockHotels[0]);
  });

  it('renders custom view all text and link', () => {
    const viewAllText = 'Custom View All';
    const viewAllLink = '/custom-link';
    
    render(
      <PopularDestinations 
        viewAllText={viewAllText} 
        viewAllLink={viewAllLink} 
      />
    );
    
    const linkElement = screen.getByText(viewAllText);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.closest('a')).toHaveAttribute('href', viewAllLink);
  });

  it('renders with Directus images', () => {
    const directusDestinations = [
      {
        id: 1,
        name: 'Directus Destination',
        country: 'Directus Country',
        description: 'Directus Description',
        image: { id: 'dest-image-id', fileId: 'dest-file-id' },
        url: '/destinations/directus',
        isDirectusImage: true
      }
    ];
    
    const directusHotels = [
      {
        id: 1,
        name: 'Directus Hotel',
        image: { id: 'hotel-image-id', fileId: 'hotel-file-id' },
        url: '/hotels/directus',
        isDirectusImage: true
      }
    ];
    
    render(
      <PopularDestinations 
        featuredDestinations={directusDestinations} 
        hotels={directusHotels} 
      />
    );
    
    // Check that Directus image components are rendered
    expect(screen.getByTestId('directus-image-dest-file-id')).toBeInTheDocument();
    expect(screen.getByTestId('directus-image-hotel-file-id')).toBeInTheDocument();
  });

  it('adjusts grid columns based on props', () => {
    const { rerender } = render(
      <PopularDestinations 
        destinationsPerRow={2} 
        hotelsPerRow={3} 
      />
    );
    
    // Check destination grid
    let destinationGrid = screen.getByText('South Tyrol').closest('.grid');
    expect(destinationGrid).toHaveClass('md:grid-cols-2');
    
    // Check hotel grid
    let hotelGrid = screen.getByText('Schgaguler Hotel').closest('.grid');
    expect(hotelGrid).toHaveClass('lg:grid-cols-3');
    
    // Rerender with different grid settings
    rerender(
      <PopularDestinations 
        destinationsPerRow={1} 
        hotelsPerRow={4} 
      />
    );
    
    // Check updated destination grid
    destinationGrid = screen.getByText('South Tyrol').closest('.grid');
    expect(destinationGrid).toHaveClass('grid-cols-1');
    
    // Check updated hotel grid
    hotelGrid = screen.getByText('Schgaguler Hotel').closest('.grid');
    expect(hotelGrid).toHaveClass('lg:grid-cols-4');
  });
});