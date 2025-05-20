import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BaseCard from '../BaseCard';

// Mock next/image because it's not available in the test environment
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock DirectusImage component
jest.mock('../../../common/DirectusImage', () => ({
  __esModule: true,
  default: ({ imageId, alt }: any) => <img src={`/mock-images/${imageId}`} alt={alt} data-testid="directus-image" />,
}));

describe('BaseCard Component', () => {
  const mockOnClick = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with basic props', () => {
    render(
      <BaseCard 
        title="Test Card" 
        description="This is a test description"
      />
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });

  it('renders with subtitle', () => {
    render(
      <BaseCard 
        title="Test Card" 
        subtitle="Test Subtitle"
      />
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('renders with local image', () => {
    render(
      <BaseCard 
        title="Test Card" 
        imageUrl="/test-image.jpg"
        imageAlt="Test image"
      />
    );

    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  it('renders with directus image', () => {
    render(
      <BaseCard 
        title="Test Card" 
        directusImage={{
          id: 'test-id',
          title: 'Test Directus Image',
        }}
      />
    );

    const image = screen.getByTestId('directus-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/mock-images/test-id');
  });

  it('renders with tags', () => {
    render(
      <BaseCard 
        title="Test Card" 
        tags={[
          { id: '1', name: 'Tag 1' },
          { id: '2', name: 'Tag 2', color: '#ff0000' },
        ]}
      />
    );

    expect(screen.getByText('Tag 1')).toBeInTheDocument();
    expect(screen.getByText('Tag 2')).toBeInTheDocument();
  });

  it('renders with link and handles click', async () => {
    render(
      <BaseCard 
        title="Test Card" 
        link="/test-link"
        onClick={mockOnClick}
      />
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test-link');
    
    await userEvent.click(link);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('renders with primary and secondary actions', () => {
    const primaryMock = jest.fn();
    const secondaryMock = jest.fn();
    
    render(
      <BaseCard 
        title="Test Card" 
        primaryAction={{
          label: 'Book Now',
          onClick: primaryMock,
        }}
        secondaryAction={{
          label: 'Learn More',
          href: '/learn-more',
        }}
      />
    );

    expect(screen.getByText('Book Now')).toBeInTheDocument();
    expect(screen.getByText('Learn More')).toBeInTheDocument();
    
    const learnMoreLink = screen.getByText('Learn More');
    expect(learnMoreLink.closest('a')).toHaveAttribute('href', '/learn-more');
  });

  it('truncates description when truncateDescription is true', () => {
    const longDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, eget ultricies nisl nisl eget ultricies aliquam, nunc nisl aliquet nunc, eget ultricies nisl.';
    
    render(
      <BaseCard 
        title="Test Card" 
        description={longDescription}
        truncateDescription
        truncateLength={50}
      />
    );

    const truncatedText = screen.getByText(/Lorem ipsum dolor sit amet, consectetur adipiscing elit.../);
    expect(truncatedText).toBeInTheDocument();
    expect(truncatedText.textContent?.length).toBeLessThan(longDescription.length);
  });

  it('applies different layouts', () => {
    const { rerender } = render(
      <BaseCard 
        title="Test Card" 
        layout="horizontal"
      />
    );
    
    let cardElement = screen.getByText('Test Card').closest('div');
    expect(cardElement?.className).toContain('horizontalLayout');
    
    rerender(
      <BaseCard 
        title="Test Card" 
        layout="overlay"
      />
    );
    
    cardElement = screen.getByText('Test Card').closest('div');
    expect(cardElement?.className).toContain('overlayLayout');
  });

  it('renders custom children', () => {
    render(
      <BaseCard title="Test Card">
        <div data-testid="custom-content">Custom Content</div>
      </BaseCard>
    );
    
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });
});