import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HotelFilters from '../../src/components/hotels/HotelFilters';
import { UIStateProvider } from '../../src/components/UIStateContext';

// Mock the UIStateContext to avoid dependency issues
jest.mock('../../src/components/UIStateContext', () => ({
  UIStateProvider: ({ children }) => <div>{children}</div>,
  useUIState: () => ({
    state: {
      theme: {
        reducedMotion: false,
        animationsEnabled: true,
      },
    },
  }),
}));

describe('HotelFilters Component', () => {
  const mockActiveFilters = {
    categories: ['luxury', 'beach'],
    locations: ['alps'],
    experiences: [],
  };
  
  const mockOnSearch = jest.fn().mockResolvedValue(undefined);
  const mockOnFilterChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders search box and filter buttons', () => {
    render(
      <HotelFilters 
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
        activeFilters={mockActiveFilters}
      />
    );
    
    // Check search box is rendered
    expect(screen.getByPlaceholderText(/Search hotels/i)).toBeInTheDocument();
    
    // Check filter buttons are rendered
    expect(screen.getByText(/Location/i)).toBeInTheDocument();
    expect(screen.getByText(/Category/i)).toBeInTheDocument();
    expect(screen.getByText(/Experience/i)).toBeInTheDocument();
    expect(screen.getByText(/All Filters/i)).toBeInTheDocument();
  });
  
  it('shows counter badges for active filters', () => {
    render(
      <HotelFilters 
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
        activeFilters={mockActiveFilters}
      />
    );
    
    // Check for badge counts 
    const categoryButton = screen.getByText(/Category/i);
    expect(categoryButton).toHaveTextContent('2'); // 2 active categories
    
    const locationButton = screen.getByText(/Location/i);
    expect(locationButton).toHaveTextContent('1'); // 1 active location
    
    // Check all filters button shows total count
    const allFiltersButton = screen.getByText(/All Filters/i);
    expect(allFiltersButton).toHaveTextContent('3'); // 3 total active filters
  });
  
  it('calls onSearch when submitting search form', async () => {
    render(
      <HotelFilters 
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
      />
    );
    
    // Type in search box
    const searchInput = screen.getByPlaceholderText(/Search hotels/i);
    await userEvent.type(searchInput, 'test query');
    
    // Submit the form
    const form = searchInput.closest('form');
    fireEvent.submit(form);
    
    // Check that onSearch was called with the correct value
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test query');
    });
  });
  
  it('clears search when clear button is clicked', async () => {
    render(
      <HotelFilters 
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
        initialSearchQuery="initial query"
      />
    );
    
    // Check initial value is set
    const searchInput = screen.getByPlaceholderText(/Search hotels/i);
    expect(searchInput).toHaveValue('initial query');
    
    // Find and click clear button
    const clearButton = screen.getByLabelText(/Clear search/i);
    await userEvent.click(clearButton);
    
    // Check input was cleared
    expect(searchInput).toHaveValue('');
    
    // Check onSearch was called with empty string
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });
  
  it('shows filter dropdown when filter button is clicked', async () => {
    render(
      <HotelFilters 
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
      />
    );
    
    // Initially dropdown should not be visible
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    
    // Click all filters button
    const allFiltersButton = screen.getByText(/All Filters/i);
    await userEvent.click(allFiltersButton);
    
    // Dropdown should now be visible
    const dropdown = screen.getByRole('dialog');
    expect(dropdown).toBeInTheDocument();
    
    // Check dropdown content
    expect(screen.getByText(/Filter Options/i)).toBeInTheDocument();
    
    // Close button should be there
    const closeButton = screen.getByText(/Close/i);
    expect(closeButton).toBeInTheDocument();
    
    // Click close button
    await userEvent.click(closeButton);
    
    // Dropdown should be hidden
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
  
  it('applies additional className when provided', () => {
    const { container } = render(
      <HotelFilters 
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
        className="test-class"
      />
    );
    
    // Check that the class is applied
    const sectionElement = container.querySelector('section');
    expect(sectionElement).toHaveClass('test-class');
  });
});