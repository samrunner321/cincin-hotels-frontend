import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BaseTabs from '../BaseTabs';
import { renderWithRtl, renderWithLtr } from '../../../../utils/__tests__/rtl-test-utils';

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

describe('BaseTabs - RTL Support', () => {
  // Mock tabs data for testing
  const mockTabs = [
    {
      id: 'tab1',
      label: 'Tab 1',
      content: <div>Content for Tab 1</div>,
      icon: <span data-testid="tab1-icon">🏠</span>
    },
    {
      id: 'tab2',
      label: 'Tab 2',
      content: <div>Content for Tab 2</div>,
      icon: <span data-testid="tab2-icon">📧</span>,
      badge: <span data-testid="tab2-badge">5</span>
    },
    {
      id: 'tab3',
      label: 'Tab 3',
      content: <div>Content for Tab 3</div>,
      disabled: true,
    },
  ];

  test('should render correctly in RTL mode', () => {
    renderWithRtl(
      <BaseTabs tabs={mockTabs} />
    );
    
    // Get tabs container with RTL direction
    const tabsContainer = screen.getByRole('tablist').closest('div[dir="rtl"]');
    expect(tabsContainer).toHaveAttribute('dir', 'rtl');
    
    // Tab list should have RTL orientation
    const tablist = screen.getByRole('tablist');
    expect(tablist).toHaveAttribute('aria-orientation', 'horizontal');
    
    // Check tab alignment - in RTL, tabs should be right-aligned
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveStyle('text-align: right');
    
    // Icons should be on the right in RTL
    const icon = screen.getByTestId('tab1-icon');
    const iconParent = icon.parentElement;
    expect(iconParent).toHaveClass('rtl-icon-container');
    
    // Badges should be on the left in RTL
    const badge = screen.getByTestId('tab2-badge');
    const badgeParent = badge.parentElement;
    expect(badgeParent).toHaveClass('rtl-badge');
  });
  
  test('should render correctly in LTR mode', () => {
    renderWithLtr(
      <BaseTabs tabs={mockTabs} />
    );
    
    // Get tabs container with LTR direction
    const tabsContainer = screen.getByRole('tablist').closest('div[dir="ltr"]');
    expect(tabsContainer).toHaveAttribute('dir', 'ltr');
    
    // Tab list should have LTR orientation
    const tablist = screen.getByRole('tablist');
    expect(tablist).toHaveAttribute('aria-orientation', 'horizontal');
    
    // Check tab alignment - in LTR, tabs should be left-aligned
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveStyle('text-align: left');
  });
  
  test('should handle RTL keyboard navigation correctly', () => {
    renderWithRtl(
      <BaseTabs tabs={mockTabs} />
    );
    
    // Get all tabs
    const tabs = screen.getAllByRole('tab');
    
    // Focus on first tab
    tabs[0].focus();
    
    // In RTL, right arrow key should move to previous tab (equivalent to left arrow in LTR)
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
    // Should stay on first tab since we're already at the start in RTL
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    
    // In RTL, left arrow key should move to next tab (equivalent to right arrow in LTR)
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
    // Should move to second tab
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    
    // Left arrow again, but should skip disabled tab
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
    // Should not select the disabled tab
    expect(tabs[2]).not.toHaveAttribute('aria-selected', 'true');
    // Should stay on second tab since third is disabled
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
  });
  
  test('should handle RTL spacing correctly', () => {
    renderWithRtl(
      <BaseTabs tabs={mockTabs} />
    );
    
    // Tab list should have RTL spacing
    const tablist = screen.getByRole('tablist');
    expect(tablist).toHaveClass('rtl-space-x-reverse');
    expect(tablist).not.toHaveClass('space-x-4');  
  });
  
  test('should render horizontal tabs at bottom correctly in RTL', () => {
    renderWithRtl(
      <BaseTabs tabs={mockTabs} orientation="horizontal" tabPosition="bottom" />
    );
    
    // Tabs should be at the bottom, with content above
    const tablist = screen.getByRole('tablist');
    const tabsContent = screen.getByText('Content for Tab 1').closest('[role="tabpanel"]');
    
    // In RTL, the overall flex direction should be column (unchanged)
    const container = tablist.parentElement;
    expect(container).toHaveStyle('flex-direction: column-reverse');
    
    // But within tab panels, content should be right-aligned
    expect(tabsContent).toHaveStyle('text-align: right');
  });
  
  test('should render vertical tabs correctly in RTL', () => {
    renderWithRtl(
      <BaseTabs tabs={mockTabs} orientation="vertical" />
    );
    
    // Tab list should have vertical orientation
    const tablist = screen.getByRole('tablist');
    expect(tablist).toHaveAttribute('aria-orientation', 'vertical');
    
    // In vertical orientation with RTL, the container should have row-reverse
    const container = tablist.parentElement;
    expect(container).toHaveStyle('flex-direction: row-reverse');
    
    // Tabs should be right-aligned
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveStyle('text-align: right');
  });
  
  test('should handle RTL tab clicking correctly', () => {
    const handleTabChange = jest.fn();
    renderWithRtl(
      <BaseTabs tabs={mockTabs} onTabChange={handleTabChange} />
    );
    
    // Click on second tab
    const secondTab = screen.getByRole('tab', { name: 'Tab 2' });
    fireEvent.click(secondTab);
    
    // Handler should be called with correct tab ID
    expect(handleTabChange).toHaveBeenCalledWith('tab2');
    
    // Second tab should now be active
    expect(secondTab).toHaveAttribute('aria-selected', 'true');
    
    // Second tab content should be visible
    expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
  });
  
  test('should handle disabled tabs correctly in RTL', () => {
    renderWithRtl(
      <BaseTabs tabs={mockTabs} />
    );
    
    // Disabled tab should be styled correctly
    const disabledTab = screen.getByRole('tab', { name: 'Tab 3' });
    expect(disabledTab).toBeDisabled();
    
    // Click on disabled tab should not change selection
    fireEvent.click(disabledTab);
    expect(disabledTab).not.toHaveAttribute('aria-selected', 'true');
  });
});