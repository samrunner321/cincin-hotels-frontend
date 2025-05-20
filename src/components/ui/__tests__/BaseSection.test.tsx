import React from 'react';
import { render, screen } from '@testing-library/react';
import BaseSection from '../BaseSection';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('BaseSection Component', () => {
  it('renders with basic props and children', () => {
    render(
      <BaseSection>
        <div data-testid="section-content">Section Content</div>
      </BaseSection>
    );

    expect(screen.getByTestId('base-section')).toBeInTheDocument();
    expect(screen.getByTestId('section-content')).toBeInTheDocument();
    expect(screen.getByText('Section Content')).toBeInTheDocument();
  });

  it('renders with title, subtitle, and description', () => {
    const title = 'Section Title';
    const subtitle = 'Section Subtitle';
    const description = 'This is a section description.';
    
    render(
      <BaseSection 
        title={title}
        subtitle={subtitle}
        description={description}
      >
        <div>Content</div>
      </BaseSection>
    );

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(subtitle)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('renders with custom header content', () => {
    render(
      <BaseSection 
        headerContent={<div data-testid="custom-header">Custom Header</div>}
      >
        <div>Content</div>
      </BaseSection>
    );

    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    expect(screen.getByText('Custom Header')).toBeInTheDocument();
  });

  it('renders with footer content', () => {
    render(
      <BaseSection 
        footerContent={<div data-testid="footer">Footer Content</div>}
      >
        <div>Content</div>
      </BaseSection>
    );

    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('applies correct classes based on props', () => {
    const { rerender } = render(
      <BaseSection 
        width="narrow"
        padding="large"
        spacing="small"
        alignment="center"
      >
        <div>Content</div>
      </BaseSection>
    );
    
    const section = screen.getByTestId('base-section');
    expect(section.className).toContain('widthNarrow');
    expect(section.className).toContain('paddingLarge');
    expect(section.className).toContain('spacingSmall');
    expect(section.className).toContain('alignmentCenter');
    
    // Test different options
    rerender(
      <BaseSection 
        width="full"
        padding="none"
        spacing="large"
        alignment="right"
      >
        <div>Content</div>
      </BaseSection>
    );
    
    expect(section.className).toContain('widthFull');
    expect(section.className).toContain('paddingNone');
    expect(section.className).toContain('spacingLarge');
    expect(section.className).toContain('alignmentRight');
  });

  it('renders with background color', () => {
    render(
      <BaseSection backgroundColor="#f3f4f6">
        <div>Content</div>
      </BaseSection>
    );
    
    const section = screen.getByTestId('base-section');
    expect(section).toHaveStyle('backgroundColor: #f3f4f6');
  });

  it('renders with background image', () => {
    render(
      <BaseSection backgroundImage="/images/background.jpg">
        <div>Content</div>
      </BaseSection>
    );
    
    const section = screen.getByTestId('base-section');
    expect(section).toHaveStyle('backgroundImage: url(/images/background.jpg)');
    expect(section.className).toContain('hasBackgroundImage');
  });

  it('renders with overlay when overlay prop is true', () => {
    render(
      <BaseSection 
        backgroundImage="/images/background.jpg"
        overlay={true}
        overlayColor="rgba(0, 0, 0, 0.7)"
        overlayOpacity={0.7}
      >
        <div>Content</div>
      </BaseSection>
    );
    
    const section = screen.getByTestId('base-section');
    expect(section.className).toContain('hasOverlay');
    
    const overlay = section.querySelector('div');
    expect(overlay).toHaveStyle('backgroundColor: rgba(0, 0, 0, 0.7)');
    expect(overlay).toHaveStyle('opacity: 0.7');
  });

  it('adds custom className', () => {
    render(
      <BaseSection className="custom-class">
        <div>Content</div>
      </BaseSection>
    );
    
    const section = screen.getByTestId('base-section');
    expect(section.className).toContain('custom-class');
  });

  it('applies ID when provided', () => {
    render(
      <BaseSection id="test-section">
        <div>Content</div>
      </BaseSection>
    );
    
    const section = screen.getByTestId('base-section');
    expect(section.id).toBe('test-section');
  });
});