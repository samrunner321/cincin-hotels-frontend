import React from 'react';
import { render, screen } from '@testing-library/react';
import DestinationCard from '../DestinationCard';

// Mock the BaseCard component
jest.mock('../BaseCard', () => {
  return {
    __esModule: true,
    default: ({ title, description, link, metadata, badges, tags }: any) => (
      <div data-testid="base-card">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
        <a href={link}>Link</a>
        <div data-testid="metadata">
          {metadata?.map((item: React.ReactNode, i: number) => (
            <div key={i} data-testid="metadata-item">{item}</div>
          ))}
        </div>
        <div data-testid="badges">
          {badges?.map((badge: React.ReactNode, i: number) => (
            <div key={i} data-testid="badge-item">{badge}</div>
          ))}
        </div>
        <div data-testid="tags">
          {tags?.map((tag: any) => (
            <span key={tag.id}>{tag.name}</span>
          ))}
        </div>
      </div>
    ),
  };
});

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaMapMarkerAlt: () => <span data-testid="location-icon">📍</span>,
  FaHotel: () => <span data-testid="hotel-icon">🏨</span>,
}));

describe('DestinationCard Component', () => {
  const mockDestination = {
    id: '1',
    name: 'South Tyrol',
    slug: 'south-tyrol',
    location: {
      country: 'Italy',
      region: 'Alps',
    },
    description: 'Beautiful mountain region in northern Italy',
    image: {
      id: 'img-1',
      title: 'South Tyrol Image',
    },
    hotelCount: 12,
    attractionCount: 24,
    categories: [
      { id: 'cat1', name: 'Mountains' },
      { id: 'cat2', name: 'Nature', color: '#00ff00' },
    ],
    featured: true,
  };

  it('renders destination card with all information', () => {
    render(<DestinationCard destination={mockDestination} />);

    expect(screen.getByText('South Tyrol')).toBeInTheDocument();
    expect(screen.getByText('Beautiful mountain region in northern Italy')).toBeInTheDocument();
    expect(screen.getByText('Mountains')).toBeInTheDocument();
    expect(screen.getByText('Nature')).toBeInTheDocument();
  });

  it('displays location information when showLocation is true', () => {
    render(<DestinationCard destination={mockDestination} showLocation={true} />);
    
    expect(screen.getByText('Alps, Italy')).toBeInTheDocument();
    expect(screen.getByTestId('location-icon')).toBeInTheDocument();
  });

  it('hides location information when showLocation is false', () => {
    render(<DestinationCard destination={mockDestination} showLocation={false} />);
    
    expect(screen.queryByText('Alps, Italy')).not.toBeInTheDocument();
  });

  it('displays hotel count when showHotelCount is true', () => {
    render(<DestinationCard destination={mockDestination} showHotelCount={true} />);
    
    expect(screen.getByText('12 Hotels')).toBeInTheDocument();
    expect(screen.getByTestId('hotel-icon')).toBeInTheDocument();
  });

  it('hides hotel count when showHotelCount is false', () => {
    render(<DestinationCard destination={mockDestination} showHotelCount={false} />);
    
    expect(screen.queryByText('12 Hotels')).not.toBeInTheDocument();
  });

  it('shows singular form for hotel count when there is only one hotel', () => {
    const singleHotelDestination = {
      ...mockDestination,
      hotelCount: 1,
    };
    
    render(<DestinationCard destination={singleHotelDestination} />);
    
    expect(screen.getByText('1 Hotel')).toBeInTheDocument();
  });

  it('displays featured badge when destination is featured', () => {
    render(<DestinationCard destination={mockDestination} />);
    
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('hides featured badge when destination is not featured', () => {
    const nonFeaturedDestination = {
      ...mockDestination,
      featured: false,
    };
    
    render(<DestinationCard destination={nonFeaturedDestination} />);
    
    expect(screen.queryByText('Featured')).not.toBeInTheDocument();
  });

  it('hides description when showDescription is false', () => {
    render(<DestinationCard destination={mockDestination} showDescription={false} />);
    
    expect(screen.queryByText('Beautiful mountain region in northern Italy')).not.toBeInTheDocument();
  });

  it('handles missing optional destination properties gracefully', () => {
    const minimalDestination = {
      id: '2',
      name: 'Minimal Destination',
      slug: 'minimal-destination',
    };

    render(<DestinationCard destination={minimalDestination} />);
    
    expect(screen.getByText('Minimal Destination')).toBeInTheDocument();
    expect(screen.queryByTestId('location-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('hotel-icon')).not.toBeInTheDocument();
  });
});