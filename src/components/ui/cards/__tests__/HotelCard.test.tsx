import React from 'react';
import { render, screen } from '@testing-library/react';
import HotelCard from '../HotelCard';

// Mock the BaseCard component
jest.mock('../BaseCard', () => {
  return {
    __esModule: true,
    default: ({ title, description, link, metadata, tags }: any) => (
      <div data-testid="base-card">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
        <a href={link}>Link</a>
        <div data-testid="metadata">
          {metadata?.map((item: React.ReactNode, i: number) => (
            <div key={i} data-testid="metadata-item">{item}</div>
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
  FaStar: () => <span data-testid="star-icon">★</span>,
  FaMapMarkerAlt: () => <span data-testid="location-icon">📍</span>,
}));

describe('HotelCard Component', () => {
  const mockHotel = {
    id: '1',
    name: 'Test Hotel',
    slug: 'test-hotel',
    location: {
      city: 'Berlin',
      country: 'Germany',
    },
    description: 'A beautiful hotel in the heart of Berlin',
    image: {
      id: 'img-1',
      title: 'Hotel Image',
    },
    rating: 4.5,
    pricePerNight: 150,
    currency: '€',
    categories: [
      { id: 'cat1', name: 'Luxury' },
      { id: 'cat2', name: 'City', color: '#ff0000' },
    ],
  };

  it('renders hotel card with all information', () => {
    render(<HotelCard hotel={mockHotel} />);

    expect(screen.getByText('Test Hotel')).toBeInTheDocument();
    expect(screen.getByText('A beautiful hotel in the heart of Berlin')).toBeInTheDocument();
    expect(screen.getByText('Luxury')).toBeInTheDocument();
    expect(screen.getByText('City')).toBeInTheDocument();
  });

  it('displays location information when showLocation is true', () => {
    render(<HotelCard hotel={mockHotel} showLocation={true} />);
    
    const metadataItems = screen.getAllByTestId('metadata-item');
    expect(metadataItems.length).toBeGreaterThan(0);
    expect(screen.getByText('Berlin, Germany')).toBeInTheDocument();
    expect(screen.getByTestId('location-icon')).toBeInTheDocument();
  });

  it('hides location information when showLocation is false', () => {
    render(<HotelCard hotel={mockHotel} showLocation={false} />);
    
    expect(screen.queryByText('Berlin, Germany')).not.toBeInTheDocument();
  });

  it('displays price information when showPrice is true', () => {
    render(<HotelCard hotel={mockHotel} showPrice={true} />);
    
    expect(screen.getByText('150 €')).toBeInTheDocument();
    expect(screen.getByText('/night')).toBeInTheDocument();
  });

  it('hides price information when showPrice is false', () => {
    render(<HotelCard hotel={mockHotel} showPrice={false} />);
    
    expect(screen.queryByText('150 €')).not.toBeInTheDocument();
    expect(screen.queryByText('/night')).not.toBeInTheDocument();
  });

  it('displays rating when showRating is true', () => {
    render(<HotelCard hotel={mockHotel} showRating={true} />);
    
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getAllByTestId('star-icon').length).toBeGreaterThan(0);
  });

  it('hides rating when showRating is false', () => {
    render(<HotelCard hotel={mockHotel} showRating={false} />);
    
    expect(screen.queryByText('4.5')).not.toBeInTheDocument();
  });

  it('hides description when showDescription is false', () => {
    render(<HotelCard hotel={mockHotel} showDescription={false} />);
    
    expect(screen.queryByText('A beautiful hotel in the heart of Berlin')).not.toBeInTheDocument();
  });

  it('handles missing optional hotel properties gracefully', () => {
    const minimalHotel = {
      id: '2',
      name: 'Minimal Hotel',
      slug: 'minimal-hotel',
    };

    render(<HotelCard hotel={minimalHotel} />);
    
    expect(screen.getByText('Minimal Hotel')).toBeInTheDocument();
    expect(screen.queryByTestId('location-icon')).not.toBeInTheDocument();
    expect(screen.queryByText('/night')).not.toBeInTheDocument();
    expect(screen.queryByTestId('star-icon')).not.toBeInTheDocument();
  });
});