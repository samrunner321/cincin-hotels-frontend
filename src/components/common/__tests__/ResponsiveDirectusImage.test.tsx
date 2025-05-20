import React from 'react';
import { render, screen } from '@testing-library/react';
import ResponsiveDirectusImage from '../ResponsiveDirectusImage';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ''} />;
  },
}));

// Mock the directus-client getAssetUrl function
jest.mock('../../../lib/api/directus-client', () => ({
  getAssetUrl: (fileId: string, options = {}) => {
    return `https://directus.example.com/assets/${fileId}?${new URLSearchParams(options as Record<string, string>).toString()}`;
  },
}));

describe('ResponsiveDirectusImage', () => {
  it('renders nothing when fileId is not provided', () => {
    const { container } = render(
      <ResponsiveDirectusImage fileId="" alt="Test image" />
    );
    
    expect(container.firstChild).toBeNull();
  });
  
  it('renders an image with correct props when fileId is provided', () => {
    render(
      <ResponsiveDirectusImage
        fileId="test-file-id"
        alt="Test image"
        width={300}
        height={200}
      />
    );
    
    const image = screen.getByAltText('Test image');
    
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('test-file-id'));
    expect(image).toHaveAttribute('width', '300');
    expect(image).toHaveAttribute('height', '200');
  });
  
  it('renders a local image when fileId is a path', () => {
    render(
      <ResponsiveDirectusImage
        fileId="/local/image.jpg"
        alt="Local image"
        width={300}
        height={200}
      />
    );
    
    const image = screen.getByAltText('Local image');
    
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/local/image.jpg');
  });
  
  it('applies correct CSS classes including the custom className', () => {
    render(
      <ResponsiveDirectusImage
        fileId="test-file-id"
        alt="Test image"
        width={300}
        height={200}
        className="custom-class"
      />
    );
    
    const image = screen.getByAltText('Test image');
    
    expect(image).toHaveClass('custom-class');
    expect(image).toHaveClass('opacity-0'); // Initially loading
  });
  
  it('shows error state when image fails to load', () => {
    // Create a test implementation where we can trigger the onError handler
    const { getByAltText } = render(
      <ResponsiveDirectusImage
        fileId="test-file-id"
        alt="Test image"
        width={300}
        height={200}
      />
    );
    
    const image = getByAltText('Test image');
    
    // Simulate an error
    image.dispatchEvent(new Event('error', { bubbles: true }));
    
    // Check if error fallback is displayed
    expect(screen.getByText('Image not available')).toBeInTheDocument();
  });
});