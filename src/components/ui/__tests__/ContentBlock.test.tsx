import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContentBlock from '../ContentBlock';

// Mock framer-motion since it's not easy to test animations directly
jest.mock('framer-motion', () => {
  return {
    motion: {
      div: ({ children, ...props }: any) => (
        <div data-testid="motion-div" {...props}>
          {children}
        </div>
      ),
    },
  };
});

describe('ContentBlock', () => {
  const mockTitle = 'Our Story';
  const mockContent = 'This is our company story.';
  
  it('renders with title and content', () => {
    render(
      <ContentBlock title={mockTitle}>
        <p>{mockContent}</p>
      </ContentBlock>
    );
    
    const title = screen.getByRole('heading');
    expect(title).toHaveTextContent(mockTitle);
    
    const content = screen.getByText(mockContent);
    expect(content).toBeInTheDocument();
    
    const motionDiv = screen.getByTestId('motion-div');
    expect(motionDiv).toBeInTheDocument();
  });

  it('renders without title', () => {
    render(
      <ContentBlock>
        <p>{mockContent}</p>
      </ContentBlock>
    );
    
    const content = screen.getByText(mockContent);
    expect(content).toBeInTheDocument();
    
    const title = screen.queryByRole('heading');
    expect(title).not.toBeInTheDocument();
  });

  it('applies center alignment', () => {
    render(
      <ContentBlock title={mockTitle} align="center">
        <p>{mockContent}</p>
      </ContentBlock>
    );
    
    const motionDiv = screen.getByTestId('motion-div');
    expect(motionDiv).toHaveClass('text-center');
  });

  it('applies custom background color', () => {
    const bgColor = 'bg-gray-100';
    
    render(
      <ContentBlock title={mockTitle} bgColor={bgColor}>
        <p>{mockContent}</p>
      </ContentBlock>
    );
    
    const section = screen.getByText(mockContent).closest('section');
    expect(section).toHaveClass(bgColor);
  });

  it('applies custom className', () => {
    const customClass = 'test-custom-class';
    
    render(
      <ContentBlock title={mockTitle} className={customClass}>
        <p>{mockContent}</p>
      </ContentBlock>
    );
    
    const section = screen.getByText(mockContent).closest('section');
    expect(section).toHaveClass(customClass);
  });
});