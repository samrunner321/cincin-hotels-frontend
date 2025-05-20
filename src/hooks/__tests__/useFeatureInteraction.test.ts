import { renderHook, act } from '@testing-library/react';
import { useFeatureInteraction } from '../useFeatureInteraction';

// Mock timers
jest.useFakeTimers();

describe('useFeatureInteraction', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useFeatureInteraction({
      featureId: 'test-feature'
    }));
    
    expect(result.current.state).toBe('idle');
    expect(result.current.isActive).toBe(false);
    expect(result.current.isHighlighted).toBe(false);
    expect(result.current.isHovered).toBe(false);
    expect(result.current.isTooltipVisible).toBe(false);
  });
  
  it('should change state on activate/deactivate', () => {
    const onStateChange = jest.fn();
    const { result } = renderHook(() => useFeatureInteraction({
      featureId: 'test-feature',
      onStateChange
    }));
    
    // Activate
    act(() => {
      result.current.activate();
    });
    
    expect(result.current.state).toBe('active');
    expect(result.current.isActive).toBe(true);
    expect(onStateChange).toHaveBeenCalledWith('active', 'test-feature');
    
    // Deactivate
    act(() => {
      result.current.deactivate();
    });
    
    expect(result.current.state).toBe('idle');
    expect(result.current.isActive).toBe(false);
    expect(onStateChange).toHaveBeenCalledWith('idle', 'test-feature');
  });
  
  it('should toggle state', () => {
    const { result } = renderHook(() => useFeatureInteraction({
      featureId: 'test-feature'
    }));
    
    // Toggle to activate
    act(() => {
      result.current.toggle();
    });
    
    expect(result.current.state).toBe('active');
    expect(result.current.isActive).toBe(true);
    
    // Toggle to deactivate
    act(() => {
      result.current.toggle();
    });
    
    expect(result.current.state).toBe('idle');
    expect(result.current.isActive).toBe(false);
  });
  
  it('should highlight and auto-revert after duration', () => {
    const { result } = renderHook(() => useFeatureInteraction({
      featureId: 'test-feature',
      highlight: {
        enabled: true,
        duration: 1000
      }
    }));
    
    // Highlight
    act(() => {
      result.current.highlight();
    });
    
    expect(result.current.state).toBe('highlighted');
    expect(result.current.isHighlighted).toBe(true);
    
    // Advance timer
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(result.current.state).toBe('idle');
    expect(result.current.isHighlighted).toBe(false);
  });
  
  it('should show and hide tooltip', () => {
    const { result } = renderHook(() => useFeatureInteraction({
      featureId: 'test-feature',
      tooltip: {
        enabled: true,
        text: 'Test tooltip'
      }
    }));
    
    // Show tooltip
    act(() => {
      result.current.showTooltip();
    });
    
    expect(result.current.isTooltipVisible).toBe(true);
    
    // Hide tooltip
    act(() => {
      result.current.hideTooltip();
    });
    
    expect(result.current.isTooltipVisible).toBe(false);
  });
  
  it('should auto-hide tooltip after delay', () => {
    const { result } = renderHook(() => useFeatureInteraction({
      featureId: 'test-feature',
      tooltip: {
        enabled: true,
        text: 'Test tooltip',
        autoHideDelay: 2000
      }
    }));
    
    // Show tooltip
    act(() => {
      result.current.showTooltip();
    });
    
    expect(result.current.isTooltipVisible).toBe(true);
    
    // Advance timer partially
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(result.current.isTooltipVisible).toBe(true);
    
    // Advance timer fully
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(result.current.isTooltipVisible).toBe(false);
  });
  
  it('should auto-activate after delay', () => {
    const { result } = renderHook(() => useFeatureInteraction({
      featureId: 'test-feature',
      autoActivateDelay: 1500
    }));
    
    expect(result.current.isActive).toBe(false);
    
    // Advance timer
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    
    expect(result.current.isActive).toBe(true);
  });
  
  it('should call onInteraction when interacting', () => {
    const onInteraction = jest.fn();
    const { result } = renderHook(() => useFeatureInteraction({
      featureId: 'test-feature',
      onInteraction
    }));
    
    // Activate (triggers click interaction)
    act(() => {
      result.current.activate();
    });
    
    expect(onInteraction).toHaveBeenCalledWith('click', 'test-feature');
  });
  
  it('should respect disabled state', () => {
    const onStateChange = jest.fn();
    const onInteraction = jest.fn();
    
    const { result } = renderHook(() => useFeatureInteraction({
      featureId: 'test-feature',
      initialState: 'disabled',
      onStateChange,
      onInteraction
    }));
    
    // Try to activate
    act(() => {
      result.current.activate();
    });
    
    // State should not change
    expect(result.current.state).toBe('disabled');
    expect(onStateChange).not.toHaveBeenCalled();
    expect(onInteraction).not.toHaveBeenCalled();
  });
  
  it('should return proper props for feature element', () => {
    const { result } = renderHook(() => useFeatureInteraction({
      featureId: 'test-feature'
    }));
    
    const props = result.current.getFeatureProps();
    
    expect(props).toEqual(expect.objectContaining({
      'aria-expanded': false,
      'data-feature-id': 'test-feature',
      'data-state': 'idle',
      onMouseEnter: expect.any(Function),
      onMouseLeave: expect.any(Function),
      onClick: expect.any(Function),
      onFocus: expect.any(Function),
      onBlur: expect.any(Function),
    }));
  });
  
  it('should return proper props for tooltip element', () => {
    const { result } = renderHook(() => useFeatureInteraction({
      featureId: 'test-feature',
      position: 'top'
    }));
    
    const props = result.current.getTooltipProps();
    
    expect(props).toEqual(expect.objectContaining({
      'aria-hidden': true,
      'data-position': 'top',
      'role': 'tooltip'
    }));
  });
  
  it('should handle reset properly', () => {
    const { result } = renderHook(() => useFeatureInteraction({
      featureId: 'test-feature',
      initialState: 'idle'
    }));
    
    // Activate
    act(() => {
      result.current.activate();
    });
    
    expect(result.current.state).toBe('active');
    
    // Reset
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.state).toBe('idle');
    expect(result.current.isHovered).toBe(false);
    expect(result.current.isTooltipVisible).toBe(false);
  });
});