import { renderHook, act } from '@testing-library/react';
import { useFilterReducer } from '../../src/hooks/useFilterReducer';

describe('useFilterReducer Hook', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useFilterReducer());
    
    // Check initial state
    expect(result.current.activeFilters).toEqual({});
    expect(result.current.availableFilters).toEqual({});
    expect(result.current.isDirty).toBe(false);
    expect(result.current.isApplying).toBe(false);
  });
  
  it('initializes with provided values', () => {
    const initialFilters = {
      category: ['beach', 'luxury'],
      location: ['alps'],
    };
    
    const { result } = renderHook(() => useFilterReducer(initialFilters));
    
    // Check initial state includes provided filters
    expect(result.current.activeFilters).toEqual(initialFilters);
    expect(result.current.isDirty).toBe(false);
  });
  
  it('sets a filter value', () => {
    const { result } = renderHook(() => useFilterReducer());
    
    // Set a filter
    act(() => {
      result.current.setFilter('category', ['beach']);
    });
    
    // Check state was updated
    expect(result.current.activeFilters.category).toEqual(['beach']);
    expect(result.current.isDirty).toBe(true);
  });
  
  it('removes a filter', () => {
    const initialFilters = {
      category: ['beach', 'luxury'],
      location: ['alps'],
    };
    
    const { result } = renderHook(() => useFilterReducer(initialFilters));
    
    // Remove a filter
    act(() => {
      result.current.removeFilter('category');
    });
    
    // Check filter was removed
    expect(result.current.activeFilters.category).toBeUndefined();
    expect(result.current.activeFilters.location).toEqual(['alps']);
    expect(result.current.isDirty).toBe(true);
  });
  
  it('toggles a filter value', () => {
    const initialFilters = {
      category: ['beach'],
    };
    
    const { result } = renderHook(() => useFilterReducer(initialFilters));
    
    // Toggle a new value (adds it)
    act(() => {
      result.current.toggleFilter('category', 'luxury');
    });
    
    // Check value was added
    expect(result.current.activeFilters.category).toContain('luxury');
    expect(result.current.activeFilters.category).toContain('beach');
    
    // Toggle an existing value (removes it)
    act(() => {
      result.current.toggleFilter('category', 'beach');
    });
    
    // Check value was removed
    expect(result.current.activeFilters.category).not.toContain('beach');
    expect(result.current.activeFilters.category).toContain('luxury');
    
    // Toggle the last value (should remove the filter entirely)
    act(() => {
      result.current.toggleFilter('category', 'luxury');
    });
    
    // Check filter was removed
    expect(result.current.activeFilters.category).toBeUndefined();
  });
  
  it('resets all filters', () => {
    const initialFilters = {
      category: ['beach', 'luxury'],
      location: ['alps'],
    };
    
    const { result } = renderHook(() => useFilterReducer(initialFilters));
    
    // Reset filters
    act(() => {
      result.current.resetFilters();
    });
    
    // Check all filters were removed
    expect(result.current.activeFilters).toEqual({});
    expect(result.current.isDirty).toBe(false);
  });
  
  it('sets available filters', () => {
    const { result } = renderHook(() => useFilterReducer());
    
    const availableFilters = {
      category: [
        { id: 'beach', label: 'Beach', selected: false },
        { id: 'luxury', label: 'Luxury', selected: false },
      ],
      location: [
        { id: 'alps', label: 'Alps', selected: false },
      ],
    };
    
    // Set available filters
    act(() => {
      result.current.setAvailableFilters(availableFilters);
    });
    
    // Check available filters were set
    expect(result.current.availableFilters).toEqual(availableFilters);
  });
  
  it('marks filters as applied', () => {
    const { result } = renderHook(() => useFilterReducer());
    
    // Set a filter to make isDirty true
    act(() => {
      result.current.setFilter('category', ['beach']);
    });
    
    // Check isDirty is true
    expect(result.current.isDirty).toBe(true);
    
    // Apply filters
    act(() => {
      result.current.applyFilters();
    });
    
    // Check isDirty is reset to false and isApplying is false
    expect(result.current.isDirty).toBe(false);
    expect(result.current.isApplying).toBe(false);
  });
  
  it('sets applying status', () => {
    const { result } = renderHook(() => useFilterReducer());
    
    // Set applying status to true
    act(() => {
      result.current.setApplying(true);
    });
    
    // Check isApplying is true
    expect(result.current.isApplying).toBe(true);
    
    // Set applying status to false
    act(() => {
      result.current.setApplying(false);
    });
    
    // Check isApplying is false
    expect(result.current.isApplying).toBe(false);
  });
});