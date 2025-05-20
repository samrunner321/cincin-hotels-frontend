# Feature Interaction System

This document describes the feature interaction system implemented in the CinCin Hotels project for creating rich, interactive UI components.

## useFeatureInteraction Hook

The `useFeatureInteraction` hook provides a standardized way to add interactive behaviors to components, including:

- State management (idle, active, highlighted, disabled)
- Hover, click, and focus interactions
- Tooltip display with positioning
- Highlight effects with timing control
- Accessibility features
- Tour and reveal functionality

### Basic Usage

```tsx
import { useFeatureInteraction } from '@/hooks/useFeatureInteraction';

function MyInteractiveComponent() {
  const {
    isActive,
    isHighlighted,
    isHovered,
    isTooltipVisible,
    getFeatureProps,
    getTooltipProps,
    activate,
    highlight,
  } = useFeatureInteraction({
    featureId: 'my-feature',
    tooltip: {
      enabled: true,
      position: 'top',
      text: 'This is my interactive feature'
    }
  });

  return (
    <div>
      <button {...getFeatureProps()} 
        className={`${isActive ? 'bg-olive-500' : 'bg-olive-200'}`}>
        Interactive Button
      </button>
      
      {isTooltipVisible && (
        <div {...getTooltipProps()}>
          This is my tooltip
        </div>
      )}
    </div>
  );
}
```

### Options

The hook accepts a configuration object with the following options:

```typescript
{
  // Required
  featureId: string;  // Unique identifier for the feature

  // Optional
  interactionTypes?: InteractionType[];  // Which interactions to enable ['hover', 'click', 'focus', 'tour', 'reveal']
  initialState?: InteractionState;  // Initial state: 'idle', 'active', 'highlighted', 'disabled'
  position?: FeaturePosition;  // Default position for tooltip: 'top', 'right', 'bottom', 'left', 'center'
  
  tooltip?: {
    enabled?: boolean;  // Whether tooltips are enabled
    position?: FeaturePosition;  // Override default position
    text?: string;  // Tooltip content
    showArrow?: boolean;  // Show tooltip directional arrow
    autoHideDelay?: number;  // Auto-hide after ms
  };
  
  highlight?: {
    enabled?: boolean;  // Whether highlight effects are enabled
    color?: string;  // Highlight color (CSS color)
    opacity?: number;  // Highlight opacity (0-1)
    effect?: 'pulse' | 'glow' | 'outline' | 'none';  // Effect style
    duration?: number;  // Duration in ms
  };
  
  enabled?: boolean;  // Whether the feature is interactive at all
  autoActivateDelay?: number;  // Automatically activate after ms
  
  // Callbacks
  onInteraction?: (type: InteractionType, featureId: string) => void;
  onStateChange?: (state: InteractionState, featureId: string) => void;
}
```

### Return Values

The hook returns an object with the following properties and methods:

```typescript
{
  // State
  state: InteractionState;  // Current state
  isActive: boolean;  // Is in 'active' state
  isHighlighted: boolean;  // Is in 'highlighted' state
  isHovered: boolean;  // Is being hovered
  isTooltipVisible: boolean;  // Is tooltip showing
  
  // Element references
  featureRef: React.RefObject<HTMLElement>;  // Ref for feature element
  tooltipRef: React.RefObject<HTMLElement>;  // Ref for tooltip element
  
  // Methods
  activate: () => void;  // Set to active state
  deactivate: () => void;  // Set to idle state
  toggle: () => void;  // Toggle between active and idle
  highlight: (duration?: number) => void;  // Apply highlight effect
  showTooltip: () => void;  // Show tooltip
  hideTooltip: () => void;  // Hide tooltip
  reset: () => void;  // Reset to initial state
  
  // Prop getters
  getFeatureProps: () => {...};  // Props for feature element
  getTooltipProps: () => {...};  // Props for tooltip element
}
```

## InteractiveFeature Component

For simpler use cases, the `InteractiveFeature` component provides a wrapper that adds interaction capabilities to any element or component.

### Basic Usage

```tsx
import InteractiveFeature from '@/components/ui/InteractiveFeature';

function MyPage() {
  return (
    <InteractiveFeature
      featureId="my-card"
      tooltipText="Click to see details"
      tooltipEnabled={true}
      tooltipPosition="top"
      highlightEnabled={true}
      highlightEffect="pulse"
      onInteraction={(type) => console.log(`Interaction: ${type}`)}
    >
      <div className="p-4 bg-white rounded shadow">
        <h3>My Interactive Card</h3>
        <p>This content has interactive features</p>
      </div>
    </InteractiveFeature>
  );
}
```

## Example Usage Scenarios

### Tooltips on Buttons or Icons

```tsx
<InteractiveFeature
  featureId="help-icon"
  tooltipText="Need assistance? Click here for help"
  tooltipEnabled={true}
>
  <button className="p-2 rounded-full bg-olive-100">
    <QuestionMarkIcon />
  </button>
</InteractiveFeature>
```

### Interactive Cards

```tsx
<InteractiveFeature
  featureId="hotel-card"
  highlightEffect="glow"
  onInteraction={(type) => {
    if (type === 'click') {
      // Handle card click
    }
  }}
>
  <HotelCard hotel={hotelData} />
</InteractiveFeature>
```

### Feature Tour

```tsx
function startTour() {
  // Highlight features in sequence
  setTimeout(() => searchFeature.highlight(1500), 0);
  setTimeout(() => filterFeature.highlight(1500), 2000);
  setTimeout(() => bookingFeature.highlight(1500), 4000);
}
```

## Testing

The `useFeatureInteraction` hook includes comprehensive tests. Run them with:

```bash
npm test -- src/hooks/__tests__/useFeatureInteraction.test.ts
```