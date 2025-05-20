import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryButton from '../buttons/CategoryButton';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, ...rest }: any) => {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  };
});

describe('CategoryButton', () => {
  const mockIcon = <span data-testid="mock-icon">🏝️</span>;
  const mockName = 'Beach';
  const mockUrl = '/categories/beach';
  
  it('renders with required props', () => {
    render(
      <CategoryButton 
        icon={mockIcon} 
        name={mockName} 
        url={mockUrl} 
      />
    );
    
    const button = screen.getByRole('link');
    expect(button).toHaveAttribute('href', mockUrl);
    
    const icon = screen.getByTestId('mock-icon');
    expect(icon).toBeInTheDocument();
    
    const name = screen.getByText(mockName);
    expect(name).toBeInTheDocument();
  });

  it('indicates active state with aria-current', () => {
    render(
      <CategoryButton 
        icon={mockIcon} 
        name={mockName} 
        url={mockUrl}
        isActive={true}
      />
    );
    
    const button = screen.getByRole('link');
    expect(button).toHaveAttribute('aria-current', 'page');
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    
    render(
      <CategoryButton 
        icon={mockIcon} 
        name={mockName} 
        url={mockUrl}
        onClick={mockOnClick}
      />
    );
    
    const button = screen.getByRole('link');
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const customClass = 'test-custom-class';
    
    render(
      <CategoryButton 
        icon={mockIcon} 
        name={mockName} 
        url={mockUrl}
        className={customClass}
      />
    );
    
    const button = screen.getByRole('link');
    expect(button).toHaveClass(customClass);
  });
});