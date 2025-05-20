import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BaseNavigation from '../BaseNavigation';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock framer-motion to prevent animation issues in tests
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe('BaseNavigation', () => {
  const defaultItems = [
    { text: 'Home', href: '/' },
    { text: 'About', href: '/about' },
    { text: 'Services', href: '/services', children: [
      { text: 'Design', href: '/services/design' },
      { text: 'Development', href: '/services/development' },
    ]},
    { text: 'Contact', href: '/contact', isButton: true },
  ];

  test('renders correctly with default props', () => {
    render(<BaseNavigation items={defaultItems} />);
    
    // Check if logo is rendered
    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    
    // Check if navigation items are rendered
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('renders custom logo', () => {
    const customLogo = <div data-testid="custom-logo">Custom Logo</div>;
    render(<BaseNavigation items={defaultItems} logo={customLogo} />);
    
    expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
  });

  test('toggles mobile menu on click', () => {
    render(<BaseNavigation items={defaultItems} />);
    
    // Open mobile menu
    fireEvent.click(screen.getByLabelText('Open Menu'));
    expect(screen.getByText('Menu')).toBeInTheDocument();
    
    // Close mobile menu
    fireEvent.click(screen.getByLabelText('Close Menu'));
    expect(screen.queryByText('Menu')).not.toBeInTheDocument();
  });

  test('toggles dropdown menu on click', () => {
    render(<BaseNavigation items={defaultItems} />);
    
    // Open Services dropdown
    fireEvent.click(screen.getByText('Services'));
    
    // Check if dropdown items are rendered
    expect(screen.getByText('Design')).toBeInTheDocument();
    expect(screen.getByText('Development')).toBeInTheDocument();
    
    // Close dropdown
    fireEvent.click(screen.getByText('Services'));
    expect(screen.queryByText('Design')).not.toBeInTheDocument();
  });

  test('renders with vertical layout', () => {
    render(<BaseNavigation items={defaultItems} layout="vertical" />);
    
    // This would need specific markup checking that differs 
    // between horizontal and vertical layouts
    // In a real test, we might check specific classes or structure
  });

  test('renders with custom background color', () => {
    render(<BaseNavigation items={defaultItems} bgColor="dark" />);
    
    // This would need to check if the header element has the 'bg-gray-900' class
    // In a real test, we'd need to access the element's classes
    const header = screen.getByRole('banner');
    expect(header.className).toContain('bg-gray-900');
  });

  test('renders with custom position', () => {
    render(<BaseNavigation items={defaultItems} position="sticky" />);
    
    const header = screen.getByRole('banner');
    expect(header.className).toContain('sticky');
    expect(header.className).toContain('top-0');
  });

  test('renders button navigation item', () => {
    render(<BaseNavigation items={defaultItems} />);
    
    const buttonLink = screen.getByText('Contact');
    expect(buttonLink.className).toContain('bg-brand-olive-600');
    expect(buttonLink.className).toContain('text-white');
  });

  test('handles collapseOnClick prop', () => {
    render(<BaseNavigation items={defaultItems} collapseOnClick={true} />);
    
    // Open mobile menu
    fireEvent.click(screen.getByLabelText('Open Menu'));
    expect(screen.getByText('Menu')).toBeInTheDocument();
    
    // Click a nav item
    fireEvent.click(screen.getAllByText('Home')[1]); // Get the one in mobile menu
    
    // Menu should close
    expect(screen.queryByText('Menu')).not.toBeInTheDocument();
  });
});