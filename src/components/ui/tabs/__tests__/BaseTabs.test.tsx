import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BaseTabs from '../BaseTabs';

// Mock framer-motion to prevent animation issues in tests
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe('BaseTabs', () => {
  // Mock tabs data for testing
  const mockTabs = [
    {
      id: 'tab1',
      label: 'Tab 1',
      content: <div>Content for Tab 1</div>,
    },
    {
      id: 'tab2',
      label: 'Tab 2',
      content: <div>Content for Tab 2</div>,
    },
    {
      id: 'tab3',
      label: 'Tab 3',
      content: <div>Content for Tab 3</div>,
      disabled: true,
    },
  ];

  test('renders correctly with default props', () => {
    render(<BaseTabs tabs={mockTabs} />);
    
    // Check if all tab buttons are rendered
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
    
    // Check if first tab is active by default
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
    
    // Check if disabled tab is disabled
    expect(screen.getByRole('tab', { name: 'Tab 3' })).toBeDisabled();
    
    // Check if first tab content is rendered
    expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
    
    // Second tab content should not be visible
    expect(screen.queryByText('Content for Tab 2')).not.toBeVisible();
  });

  test('renders with custom defaultActiveTab', () => {
    render(<BaseTabs tabs={mockTabs} defaultActiveTab="tab2" />);
    
    // Check if second tab is active
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true');
    
    // Check if second tab content is rendered
    expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
    
    // First tab content should not be visible
    expect(screen.queryByText('Content for Tab 1')).not.toBeVisible();
  });

  test('changes active tab when clicked', () => {
    render(<BaseTabs tabs={mockTabs} />);
    
    // First tab should be active initially
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
    
    // Click on second tab
    fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));
    
    // Second tab should now be active
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'false');
    
    // Second tab content should be visible
    expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
  });

  test('calls onTabChange when tab is clicked', () => {
    const handleTabChange = jest.fn();
    render(<BaseTabs tabs={mockTabs} onTabChange={handleTabChange} />);
    
    // Click on second tab
    fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));
    
    // Check if handler was called with correct tab id
    expect(handleTabChange).toHaveBeenCalledWith('tab2');
  });

  test('does not change tab when disabled tab is clicked', () => {
    render(<BaseTabs tabs={mockTabs} />);
    
    // First tab should be active initially
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
    
    // Click on disabled tab
    fireEvent.click(screen.getByRole('tab', { name: 'Tab 3' }));
    
    // First tab should still be active
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
    
    // First tab content should still be visible
    expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
  });

  test('works in controlled mode', () => {
    const handleTabChange = jest.fn();
    const { rerender } = render(
      <BaseTabs tabs={mockTabs} activeTab="tab1" onTabChange={handleTabChange} />
    );
    
    // First tab should be active initially
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
    
    // Click on second tab
    fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));
    
    // Handler should be called
    expect(handleTabChange).toHaveBeenCalledWith('tab2');
    
    // But tab shouldn't change in controlled mode without prop change
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
    
    // Update activeTab prop
    rerender(<BaseTabs tabs={mockTabs} activeTab="tab2" onTabChange={handleTabChange} />);
    
    // Now second tab should be active
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true');
    
    // Second tab content should be visible
    expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
  });

  test('supports keyboard navigation', () => {
    render(<BaseTabs tabs={mockTabs} />);
    
    // Focus the first tab
    const firstTab = screen.getByRole('tab', { name: 'Tab 1' });
    firstTab.focus();
    
    // Press right arrow to move to next tab
    fireEvent.keyDown(firstTab, { key: 'ArrowRight' });
    
    // Second tab should now be active
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true');
    
    // Press right arrow again, should skip disabled tab
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Tab 2' }), { key: 'ArrowRight' });
    
    // Should stay on second tab because third is disabled
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true');
    
    // Press left arrow to move back to first tab
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Tab 2' }), { key: 'ArrowLeft' });
    
    // First tab should now be active again
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
  });

  test('renders with different variants', () => {
    const { rerender } = render(<BaseTabs tabs={mockTabs} variant="default" />);
    
    // Test outline variant
    rerender(<BaseTabs tabs={mockTabs} variant="outline" />);
    
    // Test pills variant
    rerender(<BaseTabs tabs={mockTabs} variant="pills" />);
    
    // Test underline variant
    rerender(<BaseTabs tabs={mockTabs} variant="underline" />);
    
    // Test buttons variant
    rerender(<BaseTabs tabs={mockTabs} variant="buttons" />);
  });

  test('renders with vertical orientation', () => {
    render(<BaseTabs tabs={mockTabs} orientation="vertical" />);
    
    // Check if container has vertical orientation
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
  });

  test('renders tabs at bottom in horizontal orientation', () => {
    render(<BaseTabs tabs={mockTabs} orientation="horizontal" tabPosition="bottom" />);
    
    // Check if tabs are rendered in horizontal orientation
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'horizontal');
    
    // We can't easily test the DOM structure for tab position, but the component should render
  });

  test('supports different sizes', () => {
    const { rerender } = render(<BaseTabs tabs={mockTabs} size="sm" />);
    
    // Test medium size
    rerender(<BaseTabs tabs={mockTabs} size="md" />);
    
    // Test large size
    rerender(<BaseTabs tabs={mockTabs} size="lg" />);
  });

  test('supports lazy loading tabs', () => {
    render(<BaseTabs tabs={mockTabs} lazy={true} />);
    
    // Only the active tab content should be in the DOM
    expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
    expect(screen.queryByText('Content for Tab 2')).not.toBeInTheDocument();
    
    // Click on second tab
    fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));
    
    // Now second tab content should be in the DOM and first tab content should be removed
    expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
    expect(screen.queryByText('Content for Tab 1')).not.toBeInTheDocument();
  });

  test('renders non-lazy tabs with all content hidden', () => {
    render(<BaseTabs tabs={mockTabs} lazy={false} />);
    
    // All tab content should be in the DOM but only active one visible
    expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
    
    // Content for tab 2 should be in DOM but not visible
    const tab2Content = screen.getByText('Content for Tab 2');
    expect(tab2Content).toBeInTheDocument();
    expect(tab2Content.parentElement).toHaveClass('hidden');
  });

  test('renders with custom classes', () => {
    render(
      <BaseTabs 
        tabs={mockTabs} 
        className="custom-container-class"
        tabsHeaderClassName="custom-header-class"
        tabsContentClassName="custom-content-class"
        tabClassName="custom-tab-class"
        activeTabClassName="custom-active-tab-class"
      />
    );
    
    // Container should have custom class
    expect(document.querySelector('.custom-container-class')).toBeInTheDocument();
    
    // Header should have custom class
    expect(document.querySelector('.custom-header-class')).toBeInTheDocument();
    
    // Content should have custom class
    expect(document.querySelector('.custom-content-class')).toBeInTheDocument();
    
    // Tab should have custom class
    expect(document.querySelector('.custom-tab-class')).toBeInTheDocument();
    
    // Active tab should have custom active class
    expect(document.querySelector('.custom-active-tab-class')).toBeInTheDocument();
  });

  test('renders tabs with icons and badges', () => {
    const tabsWithIconsAndBadges = [
      {
        id: 'tab1',
        label: 'Tab 1',
        content: <div>Content for Tab 1</div>,
        icon: <span data-testid="icon-1">🏠</span>,
        badge: <span data-testid="badge-1">5</span>
      },
      {
        id: 'tab2',
        label: 'Tab 2',
        content: <div>Content for Tab 2</div>,
        icon: <span data-testid="icon-2">📧</span>,
      }
    ];
    
    render(<BaseTabs tabs={tabsWithIconsAndBadges} />);
    
    // Check if icons are rendered
    expect(screen.getByTestId('icon-1')).toBeInTheDocument();
    expect(screen.getByTestId('icon-2')).toBeInTheDocument();
    
    // Check if badge is rendered
    expect(screen.getByTestId('badge-1')).toBeInTheDocument();
  });
});