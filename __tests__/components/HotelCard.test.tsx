import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HotelCard from '../../src/components/hotels/HotelCard';

// Mock the HotelCard with common props
const mockHotel = {
  id: '123',
  name: 'Test Hotel',
  slug: 'test-hotel',
  location: 'Test Location, Country',
  short_description: 'A beautiful test hotel with amazing amenities.',
  main_image_url: '/images/hotels/test-hotel.jpg',
  categories: [
    { id: 'luxury', name: 'Luxury' },
    { id: 'beach', name: 'Beach' }
  ],
  price_from: 250,
  currency: 'EUR'
};

describe('HotelCard Component', () => {
  it('renders hotel information correctly', () => {
    render(<HotelCard {...mockHotel} />);
    
    // Check that hotel name is displayed
    expect(screen.getByText('Test Hotel')).toBeInTheDocument();
    
    // Check location is displayed
    expect(screen.getByText('Test Location, Country')).toBeInTheDocument();
    
    // Check description is displayed
    expect(screen.getByText('A beautiful test hotel with amazing amenities.')).toBeInTheDocument();
    
    // Check image is rendered
    const image = screen.getByAltText('Test Hotel');
    expect(image).toBeInTheDocument();
    
    // Check price is displayed
    expect(screen.getByText(/250/)).toBeInTheDocument();
  });
  
  it('truncates long descriptions', () => {
    const longDescription = 'This is a very long description that should be truncated. '.repeat(10);
    
    render(
      <HotelCard 
        {...mockHotel} 
        short_description={longDescription} 
        maxDescriptionLength={50}
      />
    );
    
    // The description should be truncated with ellipsis
    expect(screen.getByText(/This is a very long description.+\.\.\./)).toBeInTheDocument();
    
    // The full description should not be visible
    expect(screen.queryByText(longDescription)).not.toBeInTheDocument();
  });
  
  it('displays categories when provided', () => {
    render(<HotelCard {...mockHotel} />);
    
    // Check that categories are displayed
    expect(screen.getByText('Luxury')).toBeInTheDocument();
    expect(screen.getByText('Beach')).toBeInTheDocument();
  });
  
  it('hides categories when showCategories is false', () => {
    render(<HotelCard {...mockHotel} showCategories={false} />);
    
    // Categories should not be visible
    expect(screen.queryByText('Luxury')).not.toBeInTheDocument();
    expect(screen.queryByText('Beach')).not.toBeInTheDocument();
  });
  
  it('hides description when hideDescription is true', () => {
    render(<HotelCard {...mockHotel} hideDescription={true} />);
    
    // Description should not be visible
    expect(screen.queryByText('A beautiful test hotel with amazing amenities.')).not.toBeInTheDocument();
  });
  
  it('applies additional className when provided', () => {
    const { container } = render(<HotelCard {...mockHotel} className="test-class" />);
    
    // Check that the class is applied
    expect(container.firstChild).toHaveClass('test-class');
  });
});