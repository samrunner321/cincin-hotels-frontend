import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders spinner with default props', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
    
    const container = screen.getByTestId('loading-spinner-container');
    expect(container).toHaveAttribute('aria-label', 'Loading');
  });

  it('renders spinner with custom label', () => {
    const label = 'Loading hotels...';
    render(<LoadingSpinner label={label} />);
    
    const container = screen.getByTestId('loading-spinner-container');
    expect(container).toHaveAttribute('aria-label', label);
    
    const labelText = screen.getByText(label);
    expect(labelText).toBeInTheDocument();
  });

  it('renders spinner with progress bar', () => {
    render(<LoadingSpinner progress={75} />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
  });

  it('renders spinner with different size', () => {
    render(<LoadingSpinner size="large" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('w-16');
    expect(spinner).toHaveClass('h-16');
  });
});