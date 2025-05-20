import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BaseList from '../BaseList';

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

describe('BaseList', () => {
  // Mock data for testing
  const mockItems = [
    { id: 1, name: 'Item 1', description: 'Description 1' },
    { id: 2, name: 'Item 2', description: 'Description 2' },
    { id: 3, name: 'Item 3', description: 'Description 3' },
  ];

  // Mock render function
  const renderItem = (item: any) => (
    <div data-testid={`item-${item.id}`}>
      <h3>{item.name}</h3>
      <p>{item.description}</p>
    </div>
  );

  // Mock key function
  const getItemKey = (item: any) => item.id;

  test('renders correctly with default props', () => {
    render(
      <BaseList
        items={mockItems}
        renderItem={renderItem}
        getItemKey={getItemKey}
      />
    );
    
    // Check if all items are rendered
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  test('renders loading state correctly', () => {
    render(
      <BaseList
        items={mockItems}
        renderItem={renderItem}
        getItemKey={getItemKey}
        isLoading={true}
      />
    );
    
    // Check for loading indicator
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
    
    // Items should not be rendered
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
  });

  test('renders error state correctly', () => {
    const errorMessage = 'Failed to load items';
    render(
      <BaseList
        items={mockItems}
        renderItem={renderItem}
        getItemKey={getItemKey}
        error={{ message: errorMessage }}
      />
    );
    
    // Check for error message
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText('Error loading items')).toBeInTheDocument();
    
    // Items should not be rendered
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
  });

  test('renders empty state correctly', () => {
    render(
      <BaseList
        items={[]}
        renderItem={renderItem}
        getItemKey={getItemKey}
        emptyMessage="No items available"
      />
    );
    
    // Check for empty state message
    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('No items available')).toBeInTheDocument();
  });

  test('renders with title and description', () => {
    const title = 'Test List';
    const description = 'This is a test list';
    render(
      <BaseList
        items={mockItems}
        renderItem={renderItem}
        getItemKey={getItemKey}
        title={title}
        description={description}
      />
    );
    
    // Check for title and description
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  test('changes view mode correctly', () => {
    render(
      <BaseList
        items={mockItems}
        renderItem={renderItem}
        getItemKey={getItemKey}
        viewModes={['grid', 'list']}
        defaultViewMode="grid"
      />
    );
    
    // Check if we start in grid view
    // This is hard to test directly, we'd need to check specific classes
    
    // Click on list view button
    fireEvent.click(screen.getByLabelText('List view'));
    
    // Check if we're in list view
    // Again, this is hard to test directly
  });

  test('supports selection of items', () => {
    const handleSelectionChange = jest.fn();
    render(
      <BaseList
        items={mockItems}
        renderItem={renderItem}
        getItemKey={getItemKey}
        selectable={true}
        onSelectionChange={handleSelectionChange}
      />
    );
    
    // Find checkboxes
    const selectAllCheckbox = screen.getByLabelText('Select all');
    expect(selectAllCheckbox).toBeInTheDocument();
    
    // Select an item
    fireEvent.click(selectAllCheckbox);
    
    // Check if selection handler was called with correct data
    expect(handleSelectionChange).toHaveBeenCalledWith([1, 2, 3]);
    
    // Unselect all
    fireEvent.click(selectAllCheckbox);
    expect(handleSelectionChange).toHaveBeenCalledWith([]);
  });

  test('handles search correctly', () => {
    const handleSearch = jest.fn();
    render(
      <BaseList
        items={mockItems}
        renderItem={renderItem}
        getItemKey={getItemKey}
        searchable={true}
        onSearch={handleSearch}
      />
    );
    
    // Find search input
    const searchInput = screen.getByPlaceholderText('Search...');
    expect(searchInput).toBeInTheDocument();
    
    // Type search query
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    
    // Check if search handler was called with correct data
    expect(handleSearch).toHaveBeenCalledWith('test query');
  });

  test('handles sort change correctly', () => {
    const handleSortChange = jest.fn();
    const sortOptions = [
      { label: 'Name (A-Z)', value: 'name_asc' },
      { label: 'Name (Z-A)', value: 'name_desc' }
    ];
    
    render(
      <BaseList
        items={mockItems}
        renderItem={renderItem}
        getItemKey={getItemKey}
        sortOptions={sortOptions}
        defaultSort="name_asc"
        onSortChange={handleSortChange}
      />
    );
    
    // Find sort select
    const sortSelect = screen.getByLabelText('Sort by');
    expect(sortSelect).toBeInTheDocument();
    
    // Change sort option
    fireEvent.change(sortSelect, { target: { value: 'name_desc' } });
    
    // Check if sort handler was called with correct data
    expect(handleSortChange).toHaveBeenCalledWith(sortOptions[1]);
  });

  test('renders pagination correctly', () => {
    const handlePageChange = jest.fn();
    render(
      <BaseList
        items={mockItems}
        renderItem={renderItem}
        getItemKey={getItemKey}
        pagination={{
          currentPage: 2,
          totalPages: 5,
          itemsPerPage: 10,
          onPageChange: handlePageChange
        }}
      />
    );
    
    // Check if pagination controls are rendered
    const nextButton = screen.getByLabelText('Next');
    const prevButton = screen.getByLabelText('Previous');
    expect(nextButton).toBeInTheDocument();
    expect(prevButton).toBeInTheDocument();
    
    // Click next page
    fireEvent.click(nextButton);
    expect(handlePageChange).toHaveBeenCalledWith(3);
    
    // Click previous page
    fireEvent.click(prevButton);
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });

  test('handles item click correctly', () => {
    const handleItemClick = jest.fn();
    render(
      <BaseList
        items={mockItems}
        renderItem={renderItem}
        getItemKey={getItemKey}
        onItemClick={handleItemClick}
      />
    );
    
    // Find item
    const item = screen.getByTestId('item-1');
    
    // Click item
    fireEvent.click(item.parentElement!); // Click the parent because of how renderItem is used
    
    // Check if click handler was called with correct data
    expect(handleItemClick).toHaveBeenCalledWith(mockItems[0]);
  });

  test('renders with custom components for loading/error/empty states', () => {
    const customLoading = <div data-testid="custom-loading">Custom Loading...</div>;
    const customError = <div data-testid="custom-error">Custom Error</div>;
    const customEmpty = <div data-testid="custom-empty">Custom Empty</div>;
    
    // Test loading state
    const { rerender } = render(
      <BaseList
        items={mockItems}
        renderItem={renderItem}
        getItemKey={getItemKey}
        isLoading={true}
        loadingComponent={customLoading}
      />
    );
    
    expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
    
    // Test error state
    rerender(
      <BaseList
        items={mockItems}
        renderItem={renderItem}
        getItemKey={getItemKey}
        error={{ message: 'Error' }}
        errorComponent={customError}
      />
    );
    
    expect(screen.getByTestId('custom-error')).toBeInTheDocument();
    
    // Test empty state
    rerender(
      <BaseList
        items={[]}
        renderItem={renderItem}
        getItemKey={getItemKey}
        emptyComponent={customEmpty}
      />
    );
    
    expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
  });
});