import React from 'react';
import { render, screen } from '@testing-library/react';
import FeatureSection from '../FeatureSection';

// Mock BaseSection component
jest.mock('../../ui/BaseSection', () => {
  return {
    __esModule: true,
    default: ({ title, subtitle, description, children, className }: any) => (
      <div data-testid="base-section" className={className}>
        {title && <h2>{title}</h2>}
        {subtitle && <h3>{subtitle}</h3>}
        {description && <p>{description}</p>}
        <div data-testid="section-content">{children}</div>
      </div>
    ),
  };
});

describe('FeatureSection Component', () => {
  const mockFeatures = [
    {
      id: '1',
      title: 'Swimming Pool',
      description: 'Outdoor infinity pool with mountain views',
      icon: 'icon-pool',
    },
    {
      id: '2',
      title: 'Spa & Wellness',
      description: 'Full-service spa with sauna and treatments',
      icon: 'icon-spa',
    },
    {
      id: '3',
      title: 'Fine Dining',
      description: 'Award-winning restaurant with local specialties',
      icon: 'icon-restaurant',
      image: {
        id: 'img-1',
        title: 'Restaurant Image',
      },
    },
  ];

  it('renders with default props and features', () => {
    render(<FeatureSection features={mockFeatures} />);

    expect(screen.getByText('Features & Amenities')).toBeInTheDocument();
    expect(screen.getByText('Swimming Pool')).toBeInTheDocument();
    expect(screen.getByText('Outdoor infinity pool with mountain views')).toBeInTheDocument();
    expect(screen.getByText('Spa & Wellness')).toBeInTheDocument();
    expect(screen.getByText('Fine Dining')).toBeInTheDocument();
  });

  it('renders with custom title, subtitle, and description', () => {
    render(
      <FeatureSection 
        features={mockFeatures}
        title="Hotel Amenities"
        subtitle="Luxury Features"
        description="Enjoy our premium amenities during your stay"
      />
    );

    expect(screen.getByText('Hotel Amenities')).toBeInTheDocument();
    expect(screen.getByText('Luxury Features')).toBeInTheDocument();
    expect(screen.getByText('Enjoy our premium amenities during your stay')).toBeInTheDocument();
  });

  it('renders icons when showIcons is true', () => {
    render(<FeatureSection features={mockFeatures} showIcons={true} />);
    
    // Find elements with class name that includes the icon class
    const icons = document.querySelectorAll('i');
    expect(icons.length).toBe(3);
    expect(icons[0].className).toBe('icon-pool');
    expect(icons[1].className).toBe('icon-spa');
    expect(icons[2].className).toBe('icon-restaurant');
  });

  it('does not render icons when showIcons is false', () => {
    render(<FeatureSection features={mockFeatures} showIcons={false} />);
    
    const icons = document.querySelectorAll('i');
    expect(icons.length).toBe(0);
  });

  it('renders images when showImages is true', () => {
    render(<FeatureSection features={mockFeatures} showImages={true} />);
    
    const images = document.querySelectorAll('img');
    expect(images.length).toBe(1); // Only one feature has an image
    expect(images[0].getAttribute('src')).toBe('/api/assets/img-1');
    expect(images[0].getAttribute('alt')).toBe('Restaurant Image');
  });

  it('does not render images when showImages is false', () => {
    render(<FeatureSection features={mockFeatures} showImages={false} />);
    
    const images = document.querySelectorAll('img');
    expect(images.length).toBe(0);
  });

  it('applies list layout when specified', () => {
    render(<FeatureSection features={mockFeatures} layout="list" />);
    
    const listContainer = document.querySelector('.featureList');
    expect(listContainer).toBeInTheDocument();
  });

  it('applies alternating layout when specified', () => {
    render(<FeatureSection features={mockFeatures} layout="alternating" />);
    
    const alternatingContainer = document.querySelector('.alternatingFeatures');
    expect(alternatingContainer).toBeInTheDocument();
  });

  it('applies grid layout with correct columns when specified', () => {
    render(<FeatureSection features={mockFeatures} layout="grid" columnsPerRow={4} />);
    
    const gridContainer = document.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer?.className).toContain('grid-cols-1 md:grid-cols-2 lg:grid-cols-4');
  });
});