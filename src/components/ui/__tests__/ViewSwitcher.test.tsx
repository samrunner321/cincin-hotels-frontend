import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewSwitcher from '../ViewSwitcher';

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

describe('ViewSwitcher', () => {
  it('renders with default view (grid)', () => {
    const mockOnChange = jest.fn();
    
    render(<ViewSwitcher onChange={mockOnChange} />);
    
    const gridButton = screen.getByLabelText('Grid View');
    expect(gridButton).toHaveAttribute('aria-pressed', 'true');
    
    const listButton = screen.getByLabelText('List View');
    expect(listButton).toHaveAttribute('aria-pressed', 'false');
    
    const mapButton = screen.getByLabelText('Map View');
    expect(mapButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders with custom default view', () => {
    const mockOnChange = jest.fn();
    
    render(<ViewSwitcher onChange={mockOnChange} defaultView="list" />);
    
    const gridButton = screen.getByLabelText('Grid View');
    expect(gridButton).toHaveAttribute('aria-pressed', 'false');
    
    const listButton = screen.getByLabelText('List View');
    expect(listButton).toHaveAttribute('aria-pressed', 'true');
    
    const mapButton = screen.getByLabelText('Map View');
    expect(mapButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('changes view when button is clicked', () => {
    const mockOnChange = jest.fn();
    
    render(<ViewSwitcher onChange={mockOnChange} />);
    
    const listButton = screen.getByLabelText('List View');
    fireEvent.click(listButton);
    
    expect(mockOnChange).toHaveBeenCalledWith('list');
    expect(listButton).toHaveAttribute('aria-pressed', 'true');
    
    const gridButton = screen.getByLabelText('Grid View');
    expect(gridButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('applies custom className', () => {
    const customClass = 'test-custom-class';
    const mockOnChange = jest.fn();
    
    render(<ViewSwitcher onChange={mockOnChange} className={customClass} />);
    
    const container = screen.getByLabelText('Grid View').closest('div')?.parentElement;
    expect(container).toHaveClass(customClass);
  });
});