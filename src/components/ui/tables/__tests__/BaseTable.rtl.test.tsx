import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BaseTable from '../BaseTable';
import { renderWithRtl, renderWithLtr } from '../../../../utils/__tests__/rtl-test-utils';

// Mock framer-motion to prevent animation issues in tests
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      tr: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe('BaseTable - RTL Support', () => {
  // Mock data for testing
  const mockData = [
    { id: 1, name: 'Item 1', category: 'Category A', price: 100 },
    { id: 2, name: 'Item 2', category: 'Category B', price: 200 },
    { id: 3, name: 'Item 3', category: 'Category A', price: 300 },
  ];

  // Mock columns for testing
  const mockColumns = [
    {
      key: 'name',
      header: 'Name',
      renderCell: (row: any) => <span>{row.name}</span>,
      sortable: true,
    },
    {
      key: 'category',
      header: 'Category',
      renderCell: (row: any) => <span>{row.category}</span>,
      sortable: true,
    },
    {
      key: 'price',
      header: 'Price',
      renderCell: (row: any) => <span>${row.price}</span>,
      sortable: true,
    },
  ];

  // Mock row key function
  const getRowKey = (row: any) => row.id;

  test('should render correctly in RTL mode', () => {
    renderWithRtl(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
      />
    );
    
    // Get table container with RTL direction
    const tableContainer = screen.getByRole('table').closest('div[dir="rtl"]');
    expect(tableContainer).toHaveAttribute('dir', 'rtl');
    
    // Check text alignment - headers and cells should be right-aligned in RTL
    const headers = screen.getAllByRole('columnheader');
    headers.forEach(header => {
      expect(header).toHaveStyle('text-align: right');
    });
    
    // Check cell alignment
    const cells = screen.getAllByRole('cell');
    cells.forEach(cell => {
      expect(cell).toHaveStyle('text-align: right');
    });
  });
  
  test('should render correctly in LTR mode', () => {
    renderWithLtr(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
      />
    );
    
    // Get table container with LTR direction
    const tableContainer = screen.getByRole('table').closest('div[dir="ltr"]');
    expect(tableContainer).toHaveAttribute('dir', 'ltr');
    
    // Check text alignment - headers and cells should be left-aligned in LTR
    const headers = screen.getAllByRole('columnheader');
    headers.forEach(header => {
      expect(header).toHaveStyle('text-align: left');
    });
    
    // Check cell alignment
    const cells = screen.getAllByRole('cell');
    cells.forEach(cell => {
      expect(cell).toHaveStyle('text-align: left');
    });
  });
  
  test('should flip pagination arrows in RTL mode', () => {
    renderWithRtl(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
        pagination={{
          currentPage: 2,
          totalPages: 5,
          itemsPerPage: 10,
          totalItems: 45,
          onPageChange: jest.fn(),
        }}
      />
    );
    
    // In RTL, the navigation arrows should be flipped
    // Previous arrow should point to the right in RTL
    const prevButton = screen.getByLabelText('Previous page');
    expect(prevButton.querySelector('svg')).toHaveClass('rtl-rotate-180');
    
    // Next arrow should point to the left in RTL
    const nextButton = screen.getByLabelText('Next page');
    expect(nextButton.querySelector('svg')).toHaveClass('rtl-rotate-180');
  });
  
  test('should handle sorting direction correctly in RTL mode', () => {
    const onSortChange = jest.fn();
    renderWithRtl(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
        onSortChange={onSortChange}
        sort={{ column: 'name', direction: 'asc' }}
      />
    );
    
    // Sort icons should be flipped in RTL
    const nameHeader = screen.getByText('Name').closest('th');
    const sortIcon = nameHeader?.querySelector('[data-testid="sort-icon"]');
    expect(sortIcon).toHaveClass('rtl-flip');
    
    // Click on header to change sort direction
    fireEvent.click(nameHeader!);
    expect(onSortChange).toHaveBeenCalledWith({
      column: 'name',
      direction: 'desc'
    });
  });
  
  test('should position filters correctly in RTL mode', () => {
    renderWithRtl(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
        showFilters={true}
      />
    );
    
    // Open filter panel
    fireEvent.click(screen.getByText('Filters'));
    
    // Filter panels and dropdowns should have RTL layout
    const filterPanel = screen.getByRole('dialog');
    expect(filterPanel).toHaveAttribute('dir', 'rtl');
    
    // Check filter layout
    const filterButtons = filterPanel.querySelectorAll('button');
    expect(filterButtons[0]).toHaveStyle('margin-right: 0');
    expect(filterButtons[0]).toHaveStyle('margin-left: auto');
  });
  
  test('should handle RTL keyboard navigation correctly', () => {
    renderWithRtl(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
        selectionType="multiple"
      />
    );
    
    // Get all checkboxes for row selection
    const checkboxes = screen.getAllByRole('checkbox');
    
    // Focus on first checkbox
    checkboxes[0].focus();
    
    // In RTL, moving right should go to previous column, moving left to next column
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
    // Should navigate to the last cell of the first row
    expect(document.activeElement!.getAttribute('aria-label')).toContain('last');
    
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
    // Should navigate back 
    expect(document.activeElement!.getAttribute('aria-label')).toContain('first');
  });
  
  test('should render grid layout correctly in RTL mode', () => {
    renderWithRtl(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
        layout="grid"
        gridTemplate={{
          columns: 'repeat(3, 1fr)'
        }}
      />
    );
    
    // In grid layout, the ordering of elements should be reversed in RTL
    const gridContainer = screen.getByTestId('grid-container');
    expect(gridContainer).toHaveStyle('direction: rtl');
    
    // Grid items should have correct RTL layout
    const gridItems = screen.getAllByTestId('grid-item');
    gridItems.forEach(item => {
      expect(item).toHaveStyle('text-align: right');
    });
  });
});