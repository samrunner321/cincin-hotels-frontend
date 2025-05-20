import React from 'react';
import { render, screen } from '@testing-library/react';
import RelatedHotelCard from '../RelatedHotelCard';

// Mock the BaseCard component
jest.mock('../BaseCard', () => {
  return {
    __esModule: true,
    default: ({ title, subtitle, link, metadata, badges }: any) => (
      <div data-testid="base-card">
        <h3>{title}</h3>
        {subtitle && <h4>{subtitle}</h4>}
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
      </div>
    ),
  };
});

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaMapMarkerAlt: () => <span data-testid="location-icon">📍</span>,
}));

describe('RelatedHotelCard Component', () => {
  const mockHotel = {
    id: '1',
    name: 'Hotel Schgaguler',
    slug: 'hotel-schgaguler',
    location: {
      city: 'Castelrotto',
      country: 'Italy',
    },
    image: {
      id: 'img-1',
      title: 'Hotel Schgaguler',
    },
    categories: [
      { id: 'cat1', name: 'Mountain' },
      { id: 'cat2', name: 'Design' },
    ],
    distance: 5.2,
    distanceUnit: 'km',
    relationshipType: 'nearby',
    relationshipScore: 85,
    relationshipReason: 'Close to your destination',
  };

  it('renders related hotel card with all information', () => {
    render(<RelatedHotelCard hotel={mockHotel} />);

    expect(screen.getByText('Hotel Schgaguler')).toBeInTheDocument();
    expect(screen.getByText('Close to your destination')).toBeInTheDocument();
  });

  it('displays location information when showLocation is true', () => {
    render(<RelatedHotelCard hotel={mockHotel} showLocation={true} />);
    
    expect(screen.getByText('Castelrotto, Italy')).toBeInTheDocument();
    expect(screen.getByTestId('location-icon')).toBeInTheDocument();
  });

  it('hides location information when showLocation is false', () => {
    render(<RelatedHotelCard hotel={mockHotel} showLocation={false} />);
    
    expect(screen.queryByText('Castelrotto, Italy')).not.toBeInTheDocument();
  });

  it('displays distance when showDistance is true', () => {
    render(<RelatedHotelCard hotel={mockHotel} showDistance={true} />);
    
    expect(screen.getByText('5.2 km')).toBeInTheDocument();
  });

  it('hides distance when showDistance is false', () => {
    render(<RelatedHotelCard hotel={mockHotel} showDistance={false} />);
    
    expect(screen.queryByText('5.2 km')).not.toBeInTheDocument();
  });

  it('displays relationship badge based on relationshipType', () => {
    render(<RelatedHotelCard hotel={mockHotel} />);
    
    expect(screen.getByText('Nearby')).toBeInTheDocument();
  });

  it('uses categories as subtitle when relationshipReason is not shown', () => {
    render(<RelatedHotelCard hotel={mockHotel} showRelationshipReason={false} />);
    
    expect(screen.getByText('Mountain, Design')).toBeInTheDocument();
    expect(screen.queryByText('Close to your destination')).not.toBeInTheDocument();
  });

  it('hides categories when showCategory is false and relationshipReason is not shown', () => {
    render(
      <RelatedHotelCard 
        hotel={mockHotel} 
        showRelationshipReason={false} 
        showCategory={false} 
      />
    );
    
    expect(screen.queryByText('Mountain, Design')).not.toBeInTheDocument();
    expect(screen.queryByText('Close to your destination')).not.toBeInTheDocument();
  });

  it('handles missing optional hotel properties gracefully', () => {
    const minimalHotel = {
      id: '2',
      name: 'Minimal Hotel',
      slug: 'minimal-hotel',
    };

    render(<RelatedHotelCard hotel={minimalHotel} />);
    
    expect(screen.getByText('Minimal Hotel')).toBeInTheDocument();
    expect(screen.queryByTestId('location-icon')).not.toBeInTheDocument();
    expect(screen.queryByText('km')).not.toBeInTheDocument();
    expect(screen.queryByTestId('badge-item')).not.toBeInTheDocument();
  });
});