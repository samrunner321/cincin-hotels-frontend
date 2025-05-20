import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BasePagination from '../BasePagination';

describe('BasePagination', () => {
  test('renders correctly with default props', () => {
    render(
      <BasePagination 
        totalItems={100} 
        itemsPerPage={10}
      />
    );
    
    // Should show correct item range
    expect(screen.getByText('Showing')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('to')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('of')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    
    // Should render page buttons
    const pageButtons = screen.getAllByRole('button');
    expect(pageButtons.length).toBe(7); // First, Prev, 1, 2, 3, 4, 5, Next, Last
    
    // First page button should be disabled
    expect(screen.getByLabelText('Go to first page')).toBeDisabled();
    expect(screen.getByLabelText('Go to previous page')).toBeDisabled();
    
    // Next and last buttons should be enabled
    expect(screen.getByLabelText('Go to next page')).not.toBeDisabled();
    expect(screen.getByLabelText('Go to last page')).not.toBeDisabled();
  });

  test('handles page changes correctly in uncontrolled mode', () => {
    const handlePageChange = jest.fn();
    render(
      <BasePagination 
        totalItems={100} 
        itemsPerPage={10}
        onPageChange={handlePageChange}
      />
    );
    
    // Click on page 2
    fireEvent.click(screen.getByLabelText('Page 2'));
    
    // Handler should be called with page 2
    expect(handlePageChange).toHaveBeenCalledWith(2);
    
    // We can't easily test internal state changes, but the component should update UI
  });

  test('handles page changes correctly in controlled mode', () => {
    const handlePageChange = jest.fn();
    const { rerender } = render(
      <BasePagination 
        totalItems={100} 
        itemsPerPage={10}
        currentPage={1}
        onPageChange={handlePageChange}
      />
    );
    
    // Click on page 2
    fireEvent.click(screen.getByLabelText('Page 2'));
    
    // Handler should be called with page 2
    expect(handlePageChange).toHaveBeenCalledWith(2);
    
    // UI should not update in controlled mode without prop change
    expect(screen.getByLabelText('Page 1')).toHaveAttribute('aria-current', 'page');
    
    // Update currentPage prop
    rerender(
      <BasePagination 
        totalItems={100} 
        itemsPerPage={10}
        currentPage={2}
        onPageChange={handlePageChange}
      />
    );
    
    // Now page 2 should be active
    expect(screen.getByLabelText('Page 2')).toHaveAttribute('aria-current', 'page');
  });

  test('next and previous buttons work correctly', () => {
    const handlePageChange = jest.fn();
    render(
      <BasePagination 
        totalItems={100} 
        itemsPerPage={10}
        onPageChange={handlePageChange}
      />
    );
    
    // Click next button
    fireEvent.click(screen.getByLabelText('Go to next page'));
    
    // Handler should be called with page 2
    expect(handlePageChange).toHaveBeenCalledWith(2);
    
    // Mock being on page 2
    handlePageChange.mockClear();
    render(
      <BasePagination 
        totalItems={100} 
        itemsPerPage={10}
        currentPage={2}
        onPageChange={handlePageChange}
      />
    );
    
    // Click previous button
    fireEvent.click(screen.getByLabelText('Go to previous page'));
    
    // Handler should be called with page 1
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });

  test('first and last buttons work correctly', () => {
    const handlePageChange = jest.fn();
    
    // Render with current page in the middle
    render(
      <BasePagination 
        totalItems={100} 
        itemsPerPage={10}
        currentPage={5}
        onPageChange={handlePageChange}
      />
    );
    
    // Click first page button
    fireEvent.click(screen.getByLabelText('Go to first page'));
    
    // Handler should be called with page 1
    expect(handlePageChange).toHaveBeenCalledWith(1);
    
    // Click last page button
    handlePageChange.mockClear();
    fireEvent.click(screen.getByLabelText('Go to last page'));
    
    // Handler should be called with page 10
    expect(handlePageChange).toHaveBeenCalledWith(10);
  });

  test('handles items per page changes correctly', () => {
    const handleItemsPerPageChange = jest.fn();
    const handlePageChange = jest.fn();
    
    render(
      <BasePagination 
        totalItems={100} 
        itemsPerPage={10}
        currentPage={5}
        showItemsPerPageSelector={true}
        onItemsPerPageChange={handleItemsPerPageChange}
        onPageChange={handlePageChange}
      />
    );
    
    // Find select element
    const select = screen.getByLabelText('Show');
    
    // Change to 20 items per page
    fireEvent.change(select, { target: { value: '20' } });
    
    // Handler should be called with new value
    expect(handleItemsPerPageChange).toHaveBeenCalledWith(20);
    
    // Page should also change to keep approximately the same position
    expect(handlePageChange).toHaveBeenCalled();
  });

  test('renders different variants correctly', () => {
    // Test simple variant
    const { rerender } = render(
      <BasePagination 
        totalItems={100} 
        itemsPerPage={10}
        variant="simple"
      />
    );
    
    // Simple variant should show page text
    expect(screen.getByText('Page')).toBeInTheDocument();
    expect(screen.getByText('of')).toBeInTheDocument();
    
    // Simple variant should not show page numbers
    expect(screen.queryByLabelText('Page 2')).not.toBeInTheDocument();
    
    // Test compact variant
    rerender(
      <BasePagination 
        totalItems={100} 
        itemsPerPage={10}
        variant="compact"
      />
    );
    
    // Test buttons variant
    rerender(
      <BasePagination 
        totalItems={100} 
        itemsPerPage={10}
        variant="buttons"
      />
    );
  });

  test('supports different sizes', () => {
    // Test small size
    const { rerender } = render(
      <BasePagination 
        totalItems={100} 
        itemsPerPage={10}
        size="sm"
      />
    );
    
    // Test medium size
    rerender(
      <BasePagination 
        totalItems={100} 
        itemsPerPage={10}
        size="md"
      />
    );
    
    // Test large size
    rerender(
      <BasePagination 
        totalItems={100} 
        itemsPerPage={10}
        size="lg"
      />
    );
  });

  test('handles disabled state correctly', () => {
    render(
      <BasePagination 
        totalItems={100} 
        itemsPerPage={10}
        disabled={true}
      />
    );
    
    // All buttons should be disabled
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  test('handles loading state correctly', () => {
    render(
      <BasePagination 
        totalItems={100} 
        itemsPerPage={10}
        isLoading={true}
      />
    );
    
    // All buttons should be disabled
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  test('renders with custom labels', () => {
    render(
      <BasePagination 
        totalItems={100} 
        itemsPerPage={10}
        previousLabel="Back"
        nextLabel="Forward"
        firstPageLabel="Start"
        lastPageLabel="End"
      />
    );
    
    // Custom labels should be used
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Forward')).toBeInTheDocument();
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('End')).toBeInTheDocument();
  });

  test('calculates visible pages correctly with many pages', () => {
    // Render with many pages but show only 5
    render(
      <BasePagination 
        totalItems={200} 
        itemsPerPage={10}
        currentPage={10}
        maxVisiblePages={5}
      />
    );
    
    // Should show pages around current page
    expect(screen.getByLabelText('Page 8')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 9')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 10')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 11')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 12')).toBeInTheDocument();
    
    // Should not show pages far from current page
    expect(screen.queryByLabelText('Page 1')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Page 20')).not.toBeInTheDocument();
  });

  test('handles page selector', () => {
    render(
      <BasePagination 
        totalItems={100} 
        itemsPerPage={10}
        showPageSizeSelector={true}
      />
    );
    
    // Should show page size selector
    expect(screen.getByLabelText('Items per page:')).toBeInTheDocument();
  });
});