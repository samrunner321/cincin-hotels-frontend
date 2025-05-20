import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HotelCard from '../HotelCard';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className }: any) => {
    return <img src={src} alt={alt} className={className} data-testid="next-image" />;
  },
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...rest }: any) => {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  };
});

describe('HotelCard', () => {
  const mockHotel = {
    id: '1',
    name: 'Test Hotel',
    slug: 'test-hotel',
    location: 'Test Location',
    description: 'This is a test description for the hotel.',
    short_description: 'Short test description.',
    main_image_url: '/images/test-hotel.jpg',
    categories: [
      { id: '1', name: 'Beach', slug: 'beach' },
      { id: '2', name: 'Luxury', slug: 'luxury' }
    ],
    price_from: 200,
    currency: 'EUR'
  };

  it('renders hotel card with all information', () => {
    render(<HotelCard {...mockHotel} />);
    
    // Check name and location
    expect(screen.getByText('Test Hotel')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    
    // Check description
    expect(screen.getByText('Short test description.')).toBeInTheDocument();
    
    // Check price
    expect(screen.getByText('Ab EUR 200')).toBeInTheDocument();
    
    // Check categories
    expect(screen.getByText('Beach')).toBeInTheDocument();
    expect(screen.getByText('Luxury')).toBeInTheDocument();
    
    // Check image (implementation detail is different due to mocking)
    const image = screen.getByTestId('next-image');
    expect(image).toBeInTheDocument();
  });

  it('truncates long descriptions', () => {
    const longDesc = 'This is a very long description that should be truncated at the maxDescriptionLength. It contains more text than should be shown in the UI to avoid overwhelming the user.';
    
    render(<HotelCard 
      {...mockHotel} 
      short_description={undefined}
      description={longDesc} 
      maxDescriptionLength={50}
    />);
    
    // Check that the description is truncated with ellipsis
    const description = screen.getByText(/This is a very long description that should be truncated/);
    expect(description.textContent).toMatch(/\.\.\.$/);
    expect(description.textContent?.length).toBeLessThanOrEqual(53); // 50 + '...'
  });

  it('hides description when hideDescription is true', () => {
    render(<HotelCard 
      {...mockHotel} 
      hideDescription={true}
    />);
    
    // Check that the description is not rendered
    expect(screen.queryByText('Short test description.')).not.toBeInTheDocument();
  });

  it('hides price when showPrice is false', () => {
    render(<HotelCard 
      {...mockHotel} 
      showPrice={false}
    />);
    
    // Check that the price is not rendered
    expect(screen.queryByText('Ab EUR 200')).not.toBeInTheDocument();
  });

  it('hides categories when showCategories is false', () => {
    render(<HotelCard 
      {...mockHotel} 
      showCategories={false}
    />);
    
    // Check that the categories are not rendered
    expect(screen.queryByText('Beach')).not.toBeInTheDocument();
    expect(screen.queryByText('Luxury')).not.toBeInTheDocument();
  });

  it('applies additional classes correctly', () => {
    render(<HotelCard 
      {...mockHotel} 
      className="custom-class"
    />);
    
    // Check that the custom class is applied to the article element
    const article = screen.getByRole('article');
    expect(article).toHaveClass('custom-class');
  });
});