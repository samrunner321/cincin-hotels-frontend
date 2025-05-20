/**
 * Advanced UI Extensions for CinCin Hotels
 * This file contains TypeScript interfaces for advanced UI components in Sub-Batch 6.5
 */

import { ReactNode } from 'react';
import { 
  BaseLayoutProps, 
  BaseAnimationProps, 
  InteractionType,
  HotelMapItem,
  HotelCoordinates
} from './advanced-ui';

/**
 * TravelJourneyDesigner Component Interfaces
 */

export interface JourneyOption {
  /** Unique identifier for the option */
  id: string;
  /** Display text for the option */
  label: string;
  /** Emoji or icon identifier for the option */
  icon: string;
  /** Optional description for tooltips */
  description?: string;
}

export interface JourneyStep {
  /** Unique identifier for the step, matches preference key */
  id: string;
  /** Title text for the step */
  title: string;
  /** Available options for this step */
  options: JourneyOption[];
  /** Whether multiple options can be selected */
  multiSelect?: boolean;
}

export interface TravelPreferences {
  /** Type of traveler (solo, couple, family, etc.) */
  travelerType: string | null;
  /** Preferred destination type */
  destination: string | null;
  /** Array of preferred experiences */
  experiences: string[];
  /** Accommodation type preference */
  accommodationType: string | null;
  /** Preferred travel season */
  seasonality: string | null;
  /** Any additional custom preferences */
  [key: string]: string | string[] | null;
}

export interface JourneyHotel {
  /** Hotel identifier */
  id: number;
  /** Hotel name */
  name: string;
  /** Hotel location text */
  location: string;
  /** Image URL or asset ID */
  image: string;
  /** Additional hotel details */
  [key: string]: any;
}

export interface Journey {
  /** Journey identifier */
  id: number;
  /** Journey title */
  title: string;
  /** Journey description */
  description: string;
  /** Criteria for matching with user preferences */
  matches: {
    travelerType: string[];
    destination: string;
    experiences: string[];
    accommodationType: string[];
    seasonality: string[];
  };
  /** Recommended hotels for this journey */
  hotels: JourneyHotel[];
  /** Background image for journey card */
  imageBg: string;
}

export interface TravelJourneyDesignerProps extends BaseLayoutProps, BaseAnimationProps {
  /** Custom steps definition */
  steps?: JourneyStep[];
  /** Available journeys for matching */
  journeys?: Journey[];
  /** Initial state for the designer modal */
  initialOpen?: boolean;
  /** Whether the component is fixed-position floating */
  isFloating?: boolean;
  /** Custom button text */
  buttonText?: string;
  /** Callback when journey is selected */
  onJourneySelect?: (journey: Journey) => void;
  /** Callback when designer is opened or closed */
  onOpenChange?: (isOpen: boolean) => void;
  /** Initial preferences (for resuming a session) */
  initialPreferences?: Partial<TravelPreferences>;
}

export interface OptionCardProps extends BaseLayoutProps, BaseAnimationProps {
  /** The option configuration */
  option: JourneyOption;
  /** Whether this option is currently selected */
  isSelected: boolean;
  /** Callback when option is selected */
  onClick: () => void;
  /** Display size */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * TravelAdvisor Component Interfaces
 */

export interface ChatMessage {
  /** Message sender (user or assistant) */
  role: 'user' | 'assistant';
  /** Message content */
  content: string;
  /** Message timestamp */
  timestamp: Date;
  /** Optional message ID */
  id?: string;
  /** Whether the message has been read */
  read?: boolean;
  /** Message attachments if any */
  attachments?: Array<{
    type: 'image' | 'link' | 'location';
    content: string;
  }>;
}

export interface TravelAdvisorProps extends BaseLayoutProps, BaseAnimationProps {
  /** Initial greeting message */
  initialMessage?: string;
  /** Initial state for the chat modal */
  initialOpen?: boolean;
  /** Whether the component is fixed-position floating */
  isFloating?: boolean;
  /** Custom assistant name */
  assistantName?: string;
  /** Assistant avatar image URL */
  avatarSrc?: string;
  /** Initial suggestions */
  initialSuggestions?: string[];
  /** Custom response generator function */
  responseGenerator?: (input: string) => Promise<string>;
  /** Callback when new message is added */
  onNewMessage?: (message: ChatMessage) => void;
  /** Callback when chat is opened or closed */
  onOpenChange?: (isOpen: boolean) => void;
}

export interface SuggestionButtonProps extends BaseLayoutProps, BaseAnimationProps {
  /** Suggestion text */
  suggestion: string;
  /** Callback when suggestion is clicked */
  onClick: (suggestion: string) => void;
  /** Is this a high priority suggestion */
  isPriority?: boolean;
}

export interface ChatBubbleProps extends BaseLayoutProps, BaseAnimationProps {
  /** The message to display */
  message: ChatMessage;
  /** Custom time formatter */
  timeFormatter?: (date: Date) => string;
}

/**
 * Enhanced HotelMapView Component Interfaces
 * (Extending existing interfaces from advanced-ui.ts)
 */

export interface HotelMapItemExtended extends HotelMapItem {
  /** Position on demo map (percentages) */
  position?: {
    x: string | number;
    y: string | number;
  };
  /** Whether this hotel is actively selected */
  isActive?: boolean;
  /** Hotel rating (1-5) */
  rating?: number;
  /** Custom marker color */
  markerColor?: string;
  /** Custom marker size */
  markerSize?: 'sm' | 'md' | 'lg';
}

export interface HotelMapControlsProps extends BaseLayoutProps {
  /** Callback when zoom in is clicked */
  onZoomIn?: () => void;
  /** Callback when zoom out is clicked */
  onZoomOut?: () => void;
  /** Callback when reset view is clicked */
  onReset?: () => void;
  /** Whether controls are disabled */
  disabled?: boolean;
}

export interface HotelMapMarkerProps extends BaseLayoutProps, BaseAnimationProps {
  /** The hotel this marker represents */
  hotel: HotelMapItemExtended;
  /** Whether this marker is currently hovered */
  isHovered: boolean;
  /** Whether this marker is currently selected */
  isSelected?: boolean;
  /** Callback when marker is clicked */
  onClick: (hotel: HotelMapItemExtended) => void;
  /** Callback when marker is hovered */
  onHover: (hotel: HotelMapItemExtended | null) => void;
  /** Custom marker element */
  markerElement?: ReactNode;
  /** Custom tooltip element */
  tooltipContent?: ReactNode;
}

/**
 * InteractiveFeature Component Extensions
 */

export type HighlightEffect = 'pulse' | 'glow' | 'outline' | 'subtle' | 'bounce' | 'none';

export interface InteractiveFeatureExtendedProps extends BaseLayoutProps, BaseAnimationProps {
  /** Unique identifier for the feature */
  featureId: string;
  /** Tooltip content (can be string or ReactNode) */
  tooltipContent?: string | ReactNode;
  /** Position of the tooltip */
  tooltipPosition?: 'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Whether tooltip is enabled */
  tooltipEnabled?: boolean;
  /** Whether highlight effect is enabled */
  highlightEnabled?: boolean;
  /** Highlight effect type */
  highlightEffect?: HighlightEffect;
  /** Highlight on hover */
  highlightOnHover?: boolean;
  /** Whether feature is currently active */
  isActive?: boolean;
  /** Whether feature is disabled */
  isDisabled?: boolean;
  /** Callback when feature is interacted with */
  onInteraction?: (type: InteractionType, event?: React.SyntheticEvent) => void;
  /** Feature elements */
  children: React.ReactNode;
  /** z-index for tooltip */
  tooltipZIndex?: number;
  /** Delay before showing tooltip (ms) */
  tooltipDelay?: number;
  /** Whether to persist tooltip on click */
  tooltipPersistOnClick?: boolean;
}

/**
 * AnimatedHotelEntry Component Interfaces
 */

export interface AnimatedHotelEntryProps extends BaseLayoutProps, BaseAnimationProps {
  /** Hotel item to display */
  hotel?: HotelMapItem;
  /** Animation delay in sequence */
  delay?: number;
  /** Animation stagger amount for children */
  staggerChildren?: number;
  /** Animation trigger on scroll */
  animateOnScroll?: boolean;
  /** Whether to only animate once */
  animateOnce?: boolean;
  /** Scroll margin for triggering animation */
  scrollMargin?: string;
  /** React children */
  children: ReactNode;
}

/**
 * useTravelPlanner Hook Types
 */

export interface UseTravelPlannerProps {
  /** Array of available journeys */
  availableJourneys?: Journey[];
  /** Initial user preferences */
  initialPreferences?: Partial<TravelPreferences>;
  /** Match threshold (0-1) for journey scoring */
  matchThreshold?: number;
  /** Whether to enable preference persistence */
  enablePersistence?: boolean;
  /** Storage key for persisting preferences */
  storageKey?: string;
}

export interface UseTravelPlannerReturn {
  /** Current user preferences */
  preferences: TravelPreferences;
  /** Update a specific preference */
  updatePreference: <K extends keyof TravelPreferences>(
    key: K, 
    value: TravelPreferences[K]
  ) => void;
  /** Reset all preferences */
  resetPreferences: () => void;
  /** Currently matched journey */
  matchedJourney: Journey | null;
  /** All matching journeys with scores */
  allMatches: Array<{journey: Journey, score: number}>;
  /** Loading state */
  isLoading: boolean;
  /** Find matching journeys based on current preferences */
  findMatches: () => void;
}

/**
 * Utility types and interfaces for animation hooks
 */

export type EasingFunction = 
  | [number, number, number, number] 
  | 'linear' 
  | 'easeIn' 
  | 'easeOut' 
  | 'easeInOut' 
  | 'circIn' 
  | 'circOut' 
  | 'circInOut' 
  | 'backIn' 
  | 'backOut' 
  | 'backInOut';

export interface UseAnimationSequenceProps {
  /** Animation steps */
  steps: Array<{
    target: string;
    variants: Record<string, any>;
    transition?: {
      duration?: number;
      delay?: number;
      ease?: EasingFunction;
    };
  }>;
  /** Whether to auto-play sequence */
  autoPlay?: boolean;
  /** Whether to loop the sequence */
  loop?: boolean;
  /** Direction of sequence */
  direction?: 'forward' | 'reverse';
  /** Master duration multiplier */
  durationMultiplier?: number;
  /** Whether to respect reduced motion preference */
  respectReducedMotion?: boolean;
}

export interface UseAnimationSequenceReturn {
  /** Current state of the animation */
  state: 'idle' | 'playing' | 'paused' | 'completed';
  /** Play the animation sequence */
  play: () => void;
  /** Pause the animation sequence */
  pause: () => void;
  /** Reset the animation sequence */
  reset: () => void;
  /** Go to a specific step */
  goToStep: (stepIndex: number) => void;
  /** Current step index */
  currentStep: number;
  /** Animation controls for each target */
  controls: Record<string, any>;
  /** Whether reduced motion is active */
  isReducedMotion: boolean;
}