import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />
  }
}));

describe('Footer Component', () => {
  it('renders footer content with correct structure', () => {
    render(<Footer />);
    
    // Logo should be present
    expect(screen.getByAltText('CinCin Hotels')).toBeInTheDocument();
    
    // Column titles should be present
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Business')).toBeInTheDocument();
    expect(screen.getByText('Legal')).toBeInTheDocument();
    
    // Links should be present
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Hotel Membership')).toBeInTheDocument();
    expect(screen.getByText('Terms & Conditions')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    
    // Social links should be present
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByLabelText('YouTube')).toBeInTheDocument();
    
    // Copyright text should be present
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} CinCin Hotels`)).toBeInTheDocument();
    
    // Sustainability text should be present
    expect(screen.getByText('CinCin Hotels is committed to responsible tourism and environmental sustainability.')).toBeInTheDocument();
  });
});