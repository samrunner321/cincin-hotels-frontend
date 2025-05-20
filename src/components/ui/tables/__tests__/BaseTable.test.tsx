import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BaseTable from '../BaseTable';

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

describe('BaseTable', () => {
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
      filterOptions: {
        type: 'select',
        options: [
          { value: 'Category A', label: 'Category A' },
          { value: 'Category B', label: 'Category B' },
        ],
      },
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

  test('renders correctly with basic props', () => {
    render(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
      />
    );
    
    // Check if column headers are rendered
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    
    // Check if data rows are rendered
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('$200')).toBeInTheDocument();
    expect(screen.getByText('$300')).toBeInTheDocument();
  });

  test('renders loading state correctly', () => {
    render(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
        isLoading={true}
      />
    );
    
    // Check for loading indicator
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
    
    // Data should not be rendered
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
  });

  test('renders error state correctly', () => {
    const errorMessage = 'Failed to load data';
    render(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
        error={{ message: errorMessage }}
      />
    );
    
    // Check for error message
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText('Error loading data')).toBeInTheDocument();
    
    // Data should not be rendered
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
  });

  test('renders empty state correctly', () => {
    render(
      <BaseTable
        data={[]}
        columns={mockColumns}
        getRowKey={getRowKey}
        emptyMessage="No items to display"
      />
    );
    
    // Check for empty message
    expect(screen.getByText('No items to display')).toBeInTheDocument();
  });

  test('renders with title and description', () => {
    const title = 'Items Table';
    const description = 'A list of all items';
    render(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
        title={title}
        description={description}
      />
    );
    
    // Check for title and description
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  test('handles sorting when clicking on sortable column header', () => {
    const onSortChange = jest.fn();
    render(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
        onSortChange={onSortChange}
      />
    );
    
    // Click on name column header
    fireEvent.click(screen.getByText('Name'));
    
    // Check if sort change handler was called
    expect(onSortChange).toHaveBeenCalledWith({
      column: 'name',
      direction: 'asc'
    });
    
    // Mock sort being applied
    render(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
        onSortChange={onSortChange}
        sort={{ column: 'name', direction: 'asc' }}
      />
    );
    
    // Click again to change sort direction
    fireEvent.click(screen.getByText('Name'));
    
    // Check if sort change handler was called with desc direction
    expect(onSortChange).toHaveBeenCalledWith({
      column: 'name',
      direction: 'desc'
    });
  });

  test('handles row selection with single selection type', () => {
    const onSelectionChange = jest.fn();
    render(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
        selectionType="single"
        onSelectionChange={onSelectionChange}
      />
    );
    
    // Find radio inputs
    const radioInputs = screen.getAllByRole('radio');
    expect(radioInputs).toHaveLength(3); // One for each row
    
    // Select a row
    fireEvent.click(radioInputs[0]);
    
    // Check if selection change handler was called with correct data
    expect(onSelectionChange).toHaveBeenCalledWith([1]);
    
    // Select another row (should deselect the first one)
    fireEvent.click(radioInputs[1]);
    
    // Check if selection change handler was called with correct data
    expect(onSelectionChange).toHaveBeenCalledWith([2]);
  });

  test('handles row selection with multiple selection type', () => {
    const onSelectionChange = jest.fn();
    render(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
        selectionType="multiple"
        onSelectionChange={onSelectionChange}
      />
    );
    
    // Find checkboxes (including select all)
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(4); // One for each row + select all
    
    // Select multiple rows
    fireEvent.click(checkboxes[1]); // First row
    expect(onSelectionChange).toHaveBeenCalledWith([1]);
    
    // Mock selection applied
    render(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
        selectionType="multiple"
        onSelectionChange={onSelectionChange}
        selectedKeys={[1]}
      />
    );
    
    // Select another row
    const updatedCheckboxes = screen.getAllByRole('checkbox');
    fireEvent.click(updatedCheckboxes[2]); // Second row
    
    // Check if selection change handler was called with correct data
    expect(onSelectionChange).toHaveBeenCalledWith([1, 2]);
    
    // Mock selection applied
    render(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
        selectionType="multiple"
        onSelectionChange={onSelectionChange}
        selectedKeys={[1, 2]}
      />
    );
    
    // Select all rows
    const finalCheckboxes = screen.getAllByRole('checkbox');
    fireEvent.click(finalCheckboxes[0]); // Select all checkbox
    
    // Check if selection change handler was called with all row keys
    expect(onSelectionChange).toHaveBeenCalledWith([1, 2, 3]);
  });

  test('handles filters correctly', () => {
    const onFilterChange = jest.fn();
    render(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
        onFilterChange={onFilterChange}
        showFilters={true}
      />
    );
    
    // Open filter panel
    fireEvent.click(screen.getByText('Filters'));
    
    // Find category filter
    const categoryFilter = screen.getByLabelText('Category');
    
    // Select a category
    fireEvent.change(categoryFilter, { target: { value: 'Category A' } });
    
    // Check if filter change handler was called with correct data
    expect(onFilterChange).toHaveBeenCalledWith([
      { column: 'category', value: 'Category A', operator: 'equals' }
    ]);
    
    // Mock filter applied
    render(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
        onFilterChange={onFilterChange}
        filters={[{ column: 'category', value: 'Category A', operator: 'equals' }]}
        showFilters={true}
      />
    );
    
    // Clear filters
    fireEvent.click(screen.getByText('Clear filters'));
    
    // Check if filter change handler was called with empty array
    expect(onFilterChange).toHaveBeenCalledWith([]);
  });

  test('handles pagination correctly', () => {
    const onPageChange = jest.fn();
    render(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
        pagination={{
          currentPage: 2,
          totalPages: 5,
          itemsPerPage: 10,
          totalItems: 45,
          onPageChange
        }}
      />
    );
    
    // Check if pagination is displayed
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
    expect(screen.getByText('Showing 11 to 20 of 45 entries')).toBeInTheDocument();
    
    // Navigate to next page
    fireEvent.click(screen.getByLabelText('Next page'));
    expect(onPageChange).toHaveBeenCalledWith(3);
    
    // Navigate to previous page
    fireEvent.click(screen.getByLabelText('Previous page'));
    expect(onPageChange).toHaveBeenCalledWith(1);
    
    // Navigate to first page
    fireEvent.click(screen.getByLabelText('First page'));
    expect(onPageChange).toHaveBeenCalledWith(1);
    
    // Navigate to last page
    fireEvent.click(screen.getByLabelText('Last page'));
    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  test('handles row click correctly', () => {
    const onRowClick = jest.fn();
    render(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
        onRowClick={onRowClick}
      />
    );
    
    // Find first row by item name and click it
    const firstRow = screen.getByText('Item 1').closest('tr');
    fireEvent.click(firstRow!);
    
    // Check if row click handler was called with correct data
    expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  test('renders with different layout types', () => {
    // Test fixed layout
    const { rerender } = render(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
        layout="fixed"
      />
    );
    
    // Check for table with fixed layout
    expect(screen.getByRole('table')).toHaveClass('table-fixed');
    
    // Test grid layout
    rerender(
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
    
    // In grid layout, there's no table element
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  test('renders with different style options', () => {
    // Test striped rows
    const { rerender } = render(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
        striped={true}
      />
    );
    
    // Test hoverable
    rerender(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
        hoverable={true}
      />
    );
    
    // Test density
    rerender(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
        density="compact"
      />
    );
    
    // Test minimal style
    rerender(
      <BaseTable
        data={mockData}
        columns={mockColumns}
        getRowKey={getRowKey}
        minimal={true}
      />
    );
  });
});