import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Filters from '../filters/Filters';

// Mock the FilterModal component
jest.mock('../filters/FilterModal', () => {
  return ({ isOpen, onClose, onFilterChange }: any) => (
    isOpen ? (
      <div data-testid="filter-modal">
        <button onClick={() => onFilterChange?.({ categories: [1, 2], locations: [3] })}>
          Apply Filters
        </button>
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null
  );
});

describe('Filters', () => {
  const mockOnSearch = jest.fn();
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input correctly', () => {
    render(<Filters onSearch={mockOnSearch} onFilterChange={mockOnFilterChange} />);
    
    const searchInput = screen.getByPlaceholderText('Search destination...');
    expect(searchInput).toBeInTheDocument();
    
    const searchButton = screen.getByLabelText('Submit search');
    expect(searchButton).toBeInTheDocument();
  });

  it('shows filters button with active filter count', () => {
    render(
      <Filters 
        onSearch={mockOnSearch} 
        onFilterChange={mockOnFilterChange}
        activeFilters={{ categories: [1, 2], locations: [3] }}
      />
    );
    
    const filtersButton = screen.getByText('Filters (3)');
    expect(filtersButton).toBeInTheDocument();
  });

  it('performs search when form is submitted', async () => {
    render(<Filters onSearch={mockOnSearch} onFilterChange={mockOnFilterChange} />);
    
    const searchInput = screen.getByPlaceholderText('Search destination...');
    fireEvent.change(searchInput, { target: { value: 'beach hotels' } });
    
    const searchForm = searchInput.closest('form');
    fireEvent.submit(searchForm!);
    
    // Wait for the async search to complete
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('beach hotels');
    });
  });

  it('opens filter modal when filter button is clicked', () => {
    render(<Filters onSearch={mockOnSearch} onFilterChange={mockOnFilterChange} />);
    
    const filtersButton = screen.getByText('Filters');
    fireEvent.click(filtersButton);
    
    const filterModal = screen.getByTestId('filter-modal');
    expect(filterModal).toBeInTheDocument();
  });

  it('passes filter changes to the parent component', async () => {
    render(<Filters onSearch={mockOnSearch} onFilterChange={mockOnFilterChange} />);
    
    // Open the modal
    const filtersButton = screen.getByText('Filters');
    fireEvent.click(filtersButton);
    
    // Apply filters in the mock modal
    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);
    
    // Check that the filter change was passed to the parent
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      categories: [1, 2],
      locations: [3]
    });
  });

  it('clears the search when clear button is clicked', () => {
    render(<Filters onSearch={mockOnSearch} onFilterChange={mockOnFilterChange} initialSearchQuery="test query" />);
    
    const searchInput = screen.getByPlaceholderText('Search destination...') as HTMLInputElement;
    expect(searchInput.value).toBe('test query');
    
    const clearButton = screen.getByLabelText('Clear search');
    fireEvent.click(clearButton);
    
    expect(searchInput.value).toBe('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });
});