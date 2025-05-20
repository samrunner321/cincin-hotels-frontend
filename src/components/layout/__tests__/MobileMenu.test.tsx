import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileMenu from '../MobileMenu';

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
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the useBodyScrollLock hook
jest.mock('../../../utils/layout-helpers', () => ({
  useBodyScrollLock: jest.fn(),
}));

describe('MobileMenu Component', () => {
  const mockClose = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders nothing when isOpen is false', () => {
    render(<MobileMenu isOpen={false} onClose={mockClose} />);
    
    // The menu should not be in the document
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  
  it('renders mobile menu content when isOpen is true', () => {
    render(<MobileMenu isOpen={true} onClose={mockClose} />);
    
    // The menu should be in the document
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // Logo should be present
    expect(screen.getByAltText('CinCin Hotels')).toBeInTheDocument();
    
    // Section headings should be present
    expect(screen.getByText('Hotels')).toBeInTheDocument();
    expect(screen.getByText('Destinations')).toBeInTheDocument();
    expect(screen.getByText('Journal')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    
    // Links should be present
    expect(screen.getByText('All Hotels')).toBeInTheDocument();
    expect(screen.getByText('Top Destinations')).toBeInTheDocument();
    expect(screen.getByText('All Articles')).toBeInTheDocument();
    expect(screen.getByText('About CinCin Hotels')).toBeInTheDocument();
    
    // Social buttons should be present
    expect(screen.getByLabelText('Visit our Instagram')).toBeInTheDocument();
    expect(screen.getByLabelText('Visit our Twitter')).toBeInTheDocument();
    expect(screen.getByLabelText('Visit our LinkedIn')).toBeInTheDocument();
    
    // Language switcher should be present
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('DE')).toBeInTheDocument();
  });
  
  it('calls onClose when close button is clicked', () => {
    render(<MobileMenu isOpen={true} onClose={mockClose} />);
    
    // Click the close button
    fireEvent.click(screen.getByLabelText('Close Menu'));
    
    // onClose should have been called
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
  
  it('calls onClose when a navigation link is clicked', () => {
    render(<MobileMenu isOpen={true} onClose={mockClose} />);
    
    // Click a navigation link
    fireEvent.click(screen.getByText('All Hotels'));
    
    // onClose should have been called
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});