import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BaseHero from '../BaseHero';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  useScroll: () => ({ scrollY: { get: () => 0, onChange: jest.fn() } }),
  useTransform: jest.fn(() => 0),
  Variants: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock ResponsiveDirectusImage
jest.mock('../../common/ResponsiveDirectusImage', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img src="mocked-directus-image.jpg" alt={props.alt} data-testid="directus-image" />;
  },
}));

describe('BaseHero Component', () => {
  it('renders with default props', () => {
    render(<BaseHero />);
    
    // The component should render without errors
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('renders title and subtitle correctly', () => {
    const title = 'Test Title';
    const subtitle = 'Test Subtitle';
    
    render(<BaseHero title={title} subtitle={subtitle} />);
    
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(subtitle)).toBeInTheDocument();
  });

  it('renders with string background image', () => {
    const backgroundImage = '/test-image.jpg';
    
    render(<BaseHero backgroundImage={backgroundImage} />);
    
    // Check that the image is rendered
    const imgElement = document.querySelector('img');
    expect(imgElement).toHaveAttribute('src', backgroundImage);
  });

  it('renders with Directus background image', () => {
    const backgroundImage = { id: 'test-id', fileId: 'test-file-id' };
    
    render(<BaseHero backgroundImage={backgroundImage} isDirectusImage={true} />);
    
    // Check that the Directus image component is rendered
    expect(screen.getByTestId('directus-image')).toBeInTheDocument();
  });

  it('renders with call-to-action buttons', () => {
    const ctaButtons = [
      { text: 'Button 1', href: '/test1' },
      { text: 'Button 2', href: '/test2', variant: 'outline' as const },
    ];
    
    render(<BaseHero ctaButtons={ctaButtons} />);
    
    // Check that both buttons are rendered
    expect(screen.getByText('Button 1')).toBeInTheDocument();
    expect(screen.getByText('Button 2')).toBeInTheDocument();
    
    // Check that links have correct href
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/test1');
    expect(links[1]).toHaveAttribute('href', '/test2');
  });

  it('calls onScrollClick when scroll indicator is clicked', async () => {
    const user = userEvent.setup();
    const onScrollClick = jest.fn();
    
    render(<BaseHero showScrollIndicator={true} onScrollClick={onScrollClick} />);
    
    // Find and click the scroll button
    const scrollButton = screen.getByLabelText('Scroll down');
    await user.click(scrollButton);
    
    // Check that the click handler was called
    expect(onScrollClick).toHaveBeenCalledTimes(1);
  });

  it('renders with different text alignment', () => {
    render(<BaseHero title="Test" textAlignment="center" />);
    
    // Check for center alignment class
    const contentDiv = screen.getByText('Test').closest('div');
    expect(contentDiv).toHaveClass('text-center');
  });

  it('renders with different layout styles', () => {
    const { rerender } = render(<BaseHero layout="fullscreen" />);
    expect(screen.getByRole('region')).toHaveClass('min-h-screen');
    
    rerender(<BaseHero layout="banner" />);
    expect(screen.getByRole('region')).toHaveClass('min-h-[40vh]');
    
    rerender(<BaseHero layout="split" />);
    expect(screen.getByRole('region')).toHaveClass('md:grid');
    
    rerender(<BaseHero layout="contained" />);
    expect(screen.getByRole('region')).toHaveClass('max-w-screen-xl');
  });

  it('renders children correctly', () => {
    render(
      <BaseHero>
        <div data-testid="child-element">Custom content</div>
      </BaseHero>
    );
    
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });

  it('applies custom height', () => {
    render(<BaseHero height="500px" />);
    
    // Check that the style attribute has correct height
    expect(screen.getByRole('region')).toHaveStyle({ height: '500px' });
  });

  it('applies custom overlay color and opacity', () => {
    render(<BaseHero overlayColor="red" overlayOpacity={0.8} />);
    
    // Check that the overlay div has correct background
    const overlayDiv = document.querySelector('.absolute.inset-0:not([aria-hidden="true"])');
    expect(overlayDiv).toHaveStyle({ background: 'linear-gradient(to bottom, red/80 0%, red/60 100%)' });
  });
});