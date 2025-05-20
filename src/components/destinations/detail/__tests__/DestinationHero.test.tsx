import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DestinationHero from '../DestinationHero';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
  useScroll: () => ({ scrollY: { get: () => 0 } }),
  useTransform: jest.fn(() => 0),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} data-testid="next-image" />;
  },
}));

// Mock BaseHero component
jest.mock('../../../ui/BaseHero', () => ({
  __esModule: true,
  default: ({ title, subtitle, backgroundImage, ctaButtons, showScrollIndicator, onScrollClick }: any) => (
    <div data-testid="base-hero">
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {ctaButtons?.map((button: any, index: number) => (
        <a key={index} href={button.href}>{button.text}</a>
      ))}
      {showScrollIndicator && (
        <button onClick={onScrollClick} data-testid="scroll-button">Scroll</button>
      )}
    </div>
  ),
}));

describe('DestinationHero Component', () => {
  const mockDestination = {
    id: '1',
    name: 'Test Destination',
    country: 'Test Country',
    description: 'Test description for this beautiful destination.',
    image: '/test-image.jpg',
    slug: 'test-destination'
  };

  it('renders with minimal props', () => {
    render(<DestinationHero destination={mockDestination} />);
    
    // Should render destination name
    expect(screen.getByText(mockDestination.name)).toBeInTheDocument();
    
    // Should render destination country
    expect(screen.getByText(mockDestination.country)).toBeInTheDocument();
    
    // Should render description
    expect(screen.getByText(mockDestination.description)).toBeInTheDocument();
  });

  it('renders with BaseHero when not using split layout', () => {
    render(<DestinationHero destination={mockDestination} useSplitLayout={false} />);
    
    // Should use BaseHero
    expect(screen.getByTestId('base-hero')).toBeInTheDocument();
  });

  it('renders with split layout by default', () => {
    render(<DestinationHero destination={mockDestination} />);
    
    // Should not use BaseHero directly
    expect(screen.queryByTestId('base-hero')).not.toBeInTheDocument();
    
    // Should have the split layout
    expect(document.querySelector('.md\\:w-\\[55\\%\\]')).toBeInTheDocument();
    expect(document.querySelector('.md\\:w-\\[45\\%\\]')).toBeInTheDocument();
  });

  it('renders with Next/Image when not using Directus image', () => {
    render(<DestinationHero destination={mockDestination} />);
    
    // Should use Next/Image
    expect(screen.getByTestId('next-image')).toBeInTheDocument();
    expect(screen.getByTestId('next-image')).toHaveAttribute('src', mockDestination.image);
  });

  it('renders with custom CTA buttons', async () => {
    const user = userEvent.setup();
    const onButtonClick = jest.fn();
    
    const customButtons = [
      {
        text: 'Custom Button 1',
        href: '#custom1',
        onClick: onButtonClick
      },
      {
        text: 'Custom Button 2',
        href: '#custom2'
      }
    ];
    
    render(<DestinationHero destination={mockDestination} ctaButtons={customButtons} />);
    
    // Should render custom buttons
    expect(screen.getByText('Custom Button 1')).toBeInTheDocument();
    expect(screen.getByText('Custom Button 2')).toBeInTheDocument();
    
    // Click should trigger the handler
    await user.click(screen.getByText('Custom Button 1'));
    expect(onButtonClick).toHaveBeenCalled();
  });

  it('renders with scroll indicator and handles click', async () => {
    const user = userEvent.setup();
    const onScrollClick = jest.fn();
    
    render(
      <DestinationHero 
        destination={mockDestination} 
        showScrollIndicator={true}
        onScrollClick={onScrollClick}
      />
    );
    
    // Should show scroll indicator text
    expect(screen.getByText('Scroll to Explore')).toBeInTheDocument();
    
    // Click should trigger the handler
    const scrollButton = screen.getByText('Scroll to Explore').closest('button');
    await user.click(scrollButton!);
    expect(onScrollClick).toHaveBeenCalled();
  });

  it('does not show scroll indicator when disabled', () => {
    render(<DestinationHero destination={mockDestination} showScrollIndicator={false} />);
    
    // Should not show scroll indicator
    expect(screen.queryByText('Scroll to Explore')).not.toBeInTheDocument();
  });

  it('renders with custom accent color', () => {
    render(<DestinationHero destination={mockDestination} accentColor="bg-blue-500" />);
    
    // Should have custom accent color
    expect(document.querySelector('.bg-blue-500')).toBeInTheDocument();
  });
});