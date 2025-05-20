/**
 * DetailHeroBanner Component Unit Test
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DetailHeroBanner from '../DetailHeroBanner';
import { EnhancedTranslationsProvider } from '../../../../components/i18n/EnhancedTranslationsProvider';

// Mock the framer-motion components to avoid DOM issues in tests
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    ...actual,
    motion: {
      section: jest.fn().mockImplementation(({ children, ...props }) => (
        <section data-testid="framer-motion-section" {...props}>{children}</section>
      )),
      div: jest.fn().mockImplementation(({ children, ...props }) => (
        <div data-testid="framer-motion-div" {...props}>{children}</div>
      )),
      h1: jest.fn().mockImplementation(({ children, ...props }) => (
        <h1 data-testid="framer-motion-h1" {...props}>{children}</h1>
      )),
      p: jest.fn().mockImplementation(({ children, ...props }) => (
        <p data-testid="framer-motion-p" {...props}>{children}</p>
      )),
      a: jest.fn().mockImplementation(({ children, onClick, ...props }) => (
        <a data-testid="framer-motion-a" onClick={onClick} {...props}>{children}</a>
      )),
    },
    AnimatePresence: jest.fn().mockImplementation(({ children }) => <>{children}</>),
    useInView: () => [jest.fn(), true],
    useReducedMotion: () => false,
    useScroll: () => ({ scrollYProgress: { current: 0 } }),
    useTransform: () => ({ current: 0 }),
    useSpring: () => ({ current: 0 }),
  };
});

// Mock the ParallaxImage component
jest.mock('../../ui/common/ParallaxImage', () => {
  return {
    __esModule: true,
    default: ({ src, alt, onLoad }: any) => {
      React.useEffect(() => {
        if (onLoad) onLoad();
      }, [onLoad]);
      
      return (
        <div data-testid="parallax-image" data-src={src} data-alt={alt}>
          Parallax Image Mock
        </div>
      );
    },
  };
});

// Mock the ProgressiveDirectusImage component
jest.mock('../../common/ProgressiveDirectusImage', () => {
  return {
    __esModule: true,
    default: ({ fileId, alt, onLoad }: any) => {
      React.useEffect(() => {
        if (onLoad) onLoad();
      }, [onLoad]);
      
      return (
        <div data-testid="directus-image" data-file-id={fileId} data-alt={alt}>
          Directus Image Mock
        </div>
      );
    },
  };
});

// Mock the hooks
jest.mock('../../../hooks/useAssetLoading', () => ({
  useAssetLoading: () => ({
    preloadAsset: jest.fn(),
  }),
}));

jest.mock('../../../hooks/useAnimation', () => ({
  useAnimation: () => ({
    getEntranceProps: () => ({}),
    getExitProps: () => ({}),
    getStaggerProps: () => ({}),
  }),
}));

jest.mock('../../../hooks/useRtl', () => ({
  useRtl: () => ({
    isRtl: false,
    direction: 'ltr',
  }),
}));

jest.mock('../../../utils/image-helpers', () => ({
  getHotelImage: jest.fn((backgroundImage, slug) => `/images/hotels/${slug || 'default'}.jpg`),
  isValidImageUrl: jest.fn((url) => url?.startsWith('/') || url?.startsWith('http')),
  generateSrcSet: jest.fn(() => 'mock-srcset'),
  shouldLoadWithPriority: jest.fn(() => true),
  getObjectFit: jest.fn(() => 'cover'),
}));

// Test data
const mockProps = {
  hotelName: "Test Hotel & Spa",
  location: "Test City, Test Country",
  description: "A beautiful test hotel with amazing amenities.",
  backgroundImage: "/images/hotels/test-hotel.jpg",
  slug: "test-hotel",
  isRoomsPage: false,
};

// Wrap tests in the translations provider
const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <EnhancedTranslationsProvider initialLanguage="en">
      {ui}
    </EnhancedTranslationsProvider>
  );
};

describe('DetailHeroBanner Component', () => {
  beforeEach(() => {
    // Setup window.scrollTo mock
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });
  
  it('renders correctly with provided props', async () => {
    renderWithProvider(<DetailHeroBanner {...mockProps} />);
    
    // Wait for the content to be rendered
    await waitFor(() => {
      expect(screen.getByText(mockProps.hotelName)).toBeInTheDocument();
    });
    
    // Check if all content is rendered correctly
    expect(screen.getByText(mockProps.location)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
    expect(screen.getByText('show more')).toBeInTheDocument();
  });
  
  it('renders correctly with default props', async () => {
    renderWithProvider(<DetailHeroBanner />);
    
    // Wait for the content to be rendered
    await waitFor(() => {
      expect(screen.getByText("Seezeitlodge Hotel & Spa")).toBeInTheDocument();
    });
    
    // Check if all default content is rendered correctly
    expect(screen.getByText("Gonnesweiler, Saarland, Germany")).toBeInTheDocument();
  });
  
  it('renders the correct image component based on image type', async () => {
    // Test with normal image
    renderWithProvider(<DetailHeroBanner {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('parallax-image')).toBeInTheDocument();
    });
    
    // Test with Directus asset ID
    renderWithProvider(<DetailHeroBanner {...mockProps} backgroundImage="directus-asset-id" />);
    
    await waitFor(() => {
      expect(screen.getByTestId('directus-image')).toBeInTheDocument();
    });
  });
  
  it('scrolls to overview section when "show more" is clicked', async () => {
    // Create a mock element for the overview section
    const mockOverviewElement = document.createElement('div');
    mockOverviewElement.id = 'overview';
    document.body.appendChild(mockOverviewElement);
    
    renderWithProvider(<DetailHeroBanner {...mockProps} />);
    
    // Wait for content to be rendered
    await waitFor(() => {
      expect(screen.getByText('show more')).toBeInTheDocument();
    });
    
    // Click the "show more" link
    fireEvent.click(screen.getByText('show more'));
    
    // Check if scrollIntoView was called
    expect(mockOverviewElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    
    // Cleanup
    document.body.removeChild(mockOverviewElement);
  });
  
  it('applies appropriate RTL styling when direction is RTL', async () => {
    // Override the RTL mock for this specific test
    jest.spyOn(require('../../../hooks/useRtl'), 'useRtl').mockImplementation(() => ({
      isRtl: true,
      direction: 'rtl',
    }));
    
    renderWithProvider(<DetailHeroBanner {...mockProps} />);
    
    // Check if the section has RTL direction attribute
    await waitFor(() => {
      const section = screen.getByTestId('framer-motion-section');
      expect(section).toHaveAttribute('dir', 'rtl');
    });
    
    // Reset the mock
    jest.restoreAllMocks();
  });
  
  it('handles visibility prop correctly', () => {
    renderWithProvider(<DetailHeroBanner {...mockProps} visible={false} />);
    
    // The component should not be rendered
    expect(screen.queryByTestId('framer-motion-section')).not.toBeInTheDocument();
  });
  
  it('includes accessibility features', async () => {
    renderWithProvider(<DetailHeroBanner {...mockProps} />);
    
    // Wait for the content to be rendered
    await waitFor(() => {
      // Check for the screen reader text
      const srElement = screen.getByText((content) => 
        content.includes(`Hotel: ${mockProps.hotelName}`) && 
        content.includes(`Location: ${mockProps.location}`) && 
        content.includes(mockProps.description)
      );
      
      expect(srElement).toHaveClass('sr-only');
    });
  });
});