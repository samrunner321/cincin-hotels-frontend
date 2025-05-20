import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeatureItem from '../FeatureItem';

describe('FeatureItem', () => {
  const mockTitle = 'Mountain View';
  const mockDescription = 'Enjoy beautiful mountain views from your room';
  
  it('renders with all props', () => {
    render(
      <FeatureItem 
        icon="mountains" 
        title={mockTitle} 
        description={mockDescription} 
      />
    );
    
    const title = screen.getByText(mockTitle);
    expect(title).toBeInTheDocument();
    
    const description = screen.getByText(mockDescription);
    expect(description).toBeInTheDocument();
    
    // Since SVG is rendered, we can check for the parent div
    const iconContainer = screen.getByText(mockTitle).parentElement?.previousSibling;
    expect(iconContainer).toBeInTheDocument();
  });

  it('renders without title', () => {
    render(
      <FeatureItem 
        icon="mountains" 
        description={mockDescription} 
      />
    );
    
    const description = screen.getByText(mockDescription);
    expect(description).toBeInTheDocument();
    
    const title = screen.queryByRole('heading');
    expect(title).not.toBeInTheDocument();
  });

  it('renders with default icon when using unknown icon type', () => {
    render(
      <FeatureItem 
        icon="default" 
        title={mockTitle} 
        description={mockDescription} 
      />
    );
    
    const title = screen.getByText(mockTitle);
    expect(title).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'test-custom-class';
    
    render(
      <FeatureItem 
        icon="mountains" 
        title={mockTitle} 
        description={mockDescription} 
        className={customClass}
      />
    );
    
    const container = screen.getByText(mockTitle).closest('div')?.parentElement;
    expect(container).toHaveClass(customClass);
  });
});