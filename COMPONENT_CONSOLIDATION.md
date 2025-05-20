# Component Consolidation Strategy

## Overview

This document outlines the strategy for consolidating and migrating UI components to TypeScript in the CinCin Hotels application. The goal is to establish a maintainable, type-safe component system with shared foundations and consistent patterns.

## Base Components

Base components form the foundation of our component library. They provide common functionality that can be extended and customized by more specialized components.

### BaseHero Component

The `BaseHero` component serves as a foundation for all hero sections throughout the application. It is designed to be flexible and configurable, supporting various layouts, responsive design, animations, and accessibility features.

**Location**: `src/components/ui/BaseHero.tsx`

#### Key Features

- **Flexible Layout Options**: Supports fullscreen, split, banner, and contained layouts
- **Responsive Design**: Adapts to different screen sizes with appropriate image handling
- **Accessibility**: Includes proper ARIA attributes and keyboard navigation
- **Animation Support**: Built-in animation options using Framer Motion
- **Image Handling**: Support for both local and Directus CMS images
- **TypeScript Interface**: Comprehensive type definitions for all props

#### Usage Example

```tsx
import BaseHero from '@/components/ui/BaseHero';

// Basic usage
<BaseHero 
  title="Welcome to CinCin Hotels" 
  subtitle="Discover our curated collection of unique accommodations"
  backgroundImage="/images/hero-bg.jpg"
/>

// Advanced usage with custom configuration
<BaseHero 
  title="Explore Our Destinations"
  subtitle="From mountain retreats to beachside escapes"
  backgroundImage={{ id: "529a4174-1301-40de-8652-43fa38790e82" }}
  overlayColor="black"
  overlayOpacity={0.6}
  textAlignment="center"
  layout="split"
  ctaButtons={[
    {
      text: "View Destinations",
      href: "/destinations",
      variant: "primary"
    },
    {
      text: "Learn More",
      href: "/about",
      variant: "outline"
    }
  ]}
  showScrollIndicator={true}
  scrollToId="destinations-section"
/>
```

### Other Base Components (Planned)

1. **BaseCard**: Foundation for all card components (hotel cards, destination cards, etc.)
2. **BaseSection**: Standard section layout with consistent spacing and container handling
3. **BaseModal**: Common modal functionality with accessibility features
4. **BaseGrid**: Flexible grid layout component for lists and collections

## Migration Strategy

### 1. Identify Component Categories

Components are categorized into three groups:

- **Category A**: Already fully migrated to TypeScript
- **Category B**: Partially migrated to TypeScript
- **Category C**: Not yet migrated to TypeScript

### 2. Create Base Components First

Base components should be developed first to establish patterns and interfaces that specialized components can build upon.

### 3. Migration Process

1. Analyze the existing JSX component to understand its functionality and dependencies
2. Define TypeScript interfaces for the component props
3. Implement the TypeScript version using appropriate base components
4. Add accessibility enhancements and error handling
5. Create a backward compatibility layer that imports from the new TypeScript version

### 4. Backward Compatibility

For each migrated component, create a backward compatibility layer in the original location:

```tsx
'use client';

/**
 * DEPRECATION NOTICE:
 * This file is deprecated and will be removed in the future.
 * Please use the TypeScript version at src/components/path/ComponentName.tsx instead.
 */

import ComponentName from '../../src/components/path/ComponentName';
export default ComponentName;
```

## Design Principles

### 1. Composition Over Inheritance

Utilize React's composition pattern for flexible component design. Component variants should be created through props rather than inheritance.

### 2. Progressive Enhancement

Implement core functionality first, then add enhancements:

1. Core functionality and structure
2. Responsive design
3. Accessibility features
4. Animations and interactions
5. Performance optimizations

### 3. Type Safety

Define precise TypeScript interfaces for all components:

- Avoid `any` types
- Use discriminated unions for variant handling
- Document props with JSDoc comments
- Use shared type definitions when appropriate

### 4. Accessibility

All components should meet WCAG 2.1 AA standards:

- Proper ARIA attributes
- Keyboard navigation
- Focus management
- Color contrast compliance
- Screen reader support

## Component Structure

### Directory Organization

```
src/
  components/
    ui/               # Base UI components
      BaseHero.tsx
      BaseCard.tsx
      ...
    common/           # Shared utility components
      ResponsiveDirectusImage.tsx
      ...
    [domain]/         # Domain-specific components
      [ComponentName].tsx
      ...
```

### Component File Structure

```tsx
'use client';

import React from 'react';
// Other imports...

// Type definitions
export interface ComponentProps {
  // Props with JSDoc comments
}

/**
 * Component description
 */
export default function Component({
  // Props with defaults
}: ComponentProps): JSX.Element {
  // Implementation
}
```

## Examples

### Migrated Component Example: PopularDestinations

The `PopularDestinations` component has been migrated to TypeScript with enhanced functionality:

- Added support for Directus CMS images
- Improved accessibility with ARIA attributes
- Added flexible grid layout options
- Enhanced error handling
- Comprehensive TypeScript interfaces

```tsx
// Example usage of migrated component
<PopularDestinations
  title="Explore Our Popular Destinations"
  subtitle="Discover handpicked locations with exceptional accommodations"
  featuredDestinations={destinations}
  hotels={popularHotels}
  destinationsPerRow={2}
  hotelsPerRow={4}
  imagePriority={true}
  viewAllText="View All Destinations"
  viewAllLink="/destinations"
  onDestinationClick={handleDestinationSelect}
/>
```

## Testing Strategy

All migrated components should have comprehensive tests:

1. **Unit Tests**: Test component rendering with various prop combinations
2. **Integration Tests**: Test component interactions with other components
3. **Accessibility Tests**: Verify WCAG compliance
4. **Visual Regression Tests**: Ensure visual consistency across browsers

## Next Steps

1. Continue migrating remaining Category C components
2. Create additional base components (BaseCard, BaseSection, etc.)
3. Enhance existing migrated components with shared patterns
4. Implement comprehensive test suite