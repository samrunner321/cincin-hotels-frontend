import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HotelDetailHero, { getHotelImage, formatPrice } from '../HotelDetailHero';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
  Variants: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} data-testid="next-image" />;
  },
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => {
    return <a {...props}>{children}</a>;
  },
}));

// Mock BaseHero component
jest.mock('../../ui/BaseHero', () => ({
  __esModule: true,
  default: ({ title, subtitle, backgroundImage, ctaButtons, showScrollIndicator, scrollToId }: any) => (
    <div data-testid="base-hero">
      <h1>{title}</h1>
      <div>{subtitle}</div>
      {ctaButtons?.map((button: any, index: number) => (
        <a key={index} href={button.href} onClick={button.onClick}>{button.text}</a>
      ))}
      {showScrollIndicator && (
        <button data-testid="scroll-button">Scroll to {scrollToId}</button>
      )}
    </div>
  ),
}));

describe('HotelDetailHero Component', () => {
  const mockHotel = {
    name: 'Test Hotel',
    location: 'Test Location',
    description: 'Test hotel description',
    image: '/images/test-hotel.jpg',
    slug: 'test-hotel',
    rating: 4.5,
    ratingCount: 100,
    price: 250,
    currency: '€',
    categoryTags: ['Mountain', 'Luxury']
  };

  describe('Helper Functions', () => {
    it('getHotelImage returns the image URL if provided', () => {
      expect(getHotelImage('/test.jpg')).toBe('/test.jpg');
      expect(getHotelImage({ url: '/test.jpg' })).toBe('/test.jpg');
    });

    it('getHotelImage returns a fallback image if no image provided', () => {
      const result = getHotelImage(undefined, 'slug');
      expect(result).toMatch(/\/images\/hotels\/hotel-\d\.jpg/);
    });

    it('formatPrice correctly formats the price with currency', () => {
      expect(formatPrice(100, '$')).toBe('$100');
      expect(formatPrice('100', '$')).toBe('$100');
      expect(formatPrice('$100')).toBe('$100');
      expect(formatPrice(100)).toBe('€100');
    });
  });

  it('renders with default props', () => {
    render(<HotelDetailHero />);
    
    // Should render hotel name
    expect(screen.getByText('Hotel Schgaguler')).toBeInTheDocument();
    
    // Should render location
    expect(screen.getByText('Castelrotto, South Tyrol')).toBeInTheDocument();
    
    // Should render category tags
    expect(screen.getByText('Mountains')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
  });

  it('renders with hotel object', () => {
    render(<HotelDetailHero hotel={mockHotel} />);
    
    // Should render hotel data
    expect(screen.getByText(mockHotel.name)).toBeInTheDocument();
    expect(screen.getByText(mockHotel.location)).toBeInTheDocument();
    expect(screen.getByText(mockHotel.description)).toBeInTheDocument();
    expect(screen.getByText('Mountain')).toBeInTheDocument();
    expect(screen.getByText('Luxury')).toBeInTheDocument();
  });

  it('renders with BaseHero when not using split layout', () => {
    render(<HotelDetailHero hotel={mockHotel} useSplitLayout={false} />);
    
    // Should use BaseHero
    expect(screen.getByTestId('base-hero')).toBeInTheDocument();
    expect(screen.getByText(mockHotel.name)).toBeInTheDocument();
  });

  it('renders with split layout by default', () => {
    render(<HotelDetailHero hotel={mockHotel} />);
    
    // Should not use BaseHero directly
    expect(screen.queryByTestId('base-hero')).not.toBeInTheDocument();
    
    // Should have the split layout
    expect(document.querySelector('.md\\:w-\\[55\\%\\]')).toBeInTheDocument();
    expect(document.querySelector('.md\\:w-\\[45\\%\\]')).toBeInTheDocument();
  });

  it('renders with Next/Image when not using Directus image', () => {
    render(<HotelDetailHero hotel={mockHotel} />);
    
    // Should use Next/Image
    expect(screen.getByTestId('next-image')).toBeInTheDocument();
  });

  it('displays price correctly', () => {
    render(<HotelDetailHero hotel={mockHotel} />);
    
    // Should show formatted price
    expect(screen.getByText('€250')).toBeInTheDocument();
    expect(screen.getByText('/ night')).toBeInTheDocument();
  });

  it('handles book button click', async () => {
    const user = userEvent.setup();
    const onBookClick = jest.fn();
    
    render(<HotelDetailHero hotel={mockHotel} onBookClick={onBookClick} />);
    
    // Click the book button
    const bookButton = screen.getByText('Book Now');
    await user.click(bookButton);
    
    // Check that the handler was called
    expect(onBookClick).toHaveBeenCalled();
  });

  it('renders with custom info section color', () => {
    render(<HotelDetailHero hotel={mockHotel} infoSectionColor="bg-blue-100" />);
    
    // Should have custom info section color
    expect(document.querySelector('.bg-blue-100')).toBeInTheDocument();
  });

  it('renders with scroll indicator and handles scroll', () => {
    render(<HotelDetailHero hotel={mockHotel} scrollToId="test-section" />);
    
    // Should show scroll indicator text
    expect(screen.getByText('Discover More')).toBeInTheDocument();
    
    // Should have correct href for scroll
    const scrollLink = screen.getByText('Discover More').closest('a');
    expect(scrollLink).toHaveAttribute('href', '#test-section');
  });

  it('does not render scroll indicator when disabled', () => {
    render(<HotelDetailHero hotel={mockHotel} showScrollIndicator={false} />);
    
    // Should not show scroll indicator
    expect(screen.queryByText('Discover More')).not.toBeInTheDocument();
  });

  it('renders with custom book button text', () => {
    render(<HotelDetailHero hotel={mockHotel} bookButtonText="Reserve Now" />);
    
    // Should show custom button text
    expect(screen.getByText('Reserve Now')).toBeInTheDocument();
  });
});