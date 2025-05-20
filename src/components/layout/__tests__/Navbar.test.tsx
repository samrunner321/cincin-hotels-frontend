import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar';

// Mock the useScrollPosition hook
jest.mock('../../../utils/layout-helpers', () => ({
  useScrollPosition: jest.fn().mockReturnValue(false)
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />
  }
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props} />,
    li: (props: any) => <li {...props} />,
    button: (props: any) => <button {...props} />,
  },
}));

// Mock MobileMenu
jest.mock('../MobileMenu', () => {
  return {
    __esModule: true,
    default: ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
      isOpen ? <div data-testid="mobile-menu">
        <button onClick={onClose} data-testid="close-menu">Close Menu</button>
      </div> : null
    )
  };
});

describe('Navbar Component', () => {
  it('renders logo and navigation links', () => {
    render(<Navbar />);
    
    // Check if the logo is present
    expect(screen.getByAltText('CinCin Hotels')).toBeInTheDocument();
    
    // Check if navigation links are present
    expect(screen.getByText('Hotels')).toBeInTheDocument();
    expect(screen.getByText('Destinations')).toBeInTheDocument();
    expect(screen.getByText('Journal')).toBeInTheDocument();
  });
  
  it('toggles mobile menu when menu button is clicked', () => {
    render(<Navbar />);
    
    // Initially, mobile menu should not be visible
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
    
    // Click the hamburger menu button
    fireEvent.click(screen.getByLabelText('Open Menu'));
    
    // Now mobile menu should be visible
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
    
    // Click close button in the mobile menu
    fireEvent.click(screen.getByTestId('close-menu'));
    
    // Mobile menu should be closed again
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });
});