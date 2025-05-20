/**
 * Advanced UI Component Types for CinCin Hotels
 * This file contains TypeScript interfaces for advanced UI components in Sub-Batch 6.4 and 6.5
 */

import { ReactNode } from 'react';
import { DisplaySize } from './ui';

/**
 * Common shared type definitions
 */

export type AnimationVariant = 'fade' | 'slide' | 'scale' | 'none';
export type Direction = 'horizontal' | 'vertical';
export type ImageFit = 'cover' | 'contain' | 'fill' | 'none';
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type InteractionState = 'idle' | 'active' | 'highlighted' | 'disabled';
export type InteractionType = 'hover' | 'click' | 'focus' | 'tour' | 'reveal';
export type FeaturePosition = 'top' | 'right' | 'bottom' | 'left' | 'center';

/**
 * Base interfaces for high-complexity components
 */

export interface BaseAnimationProps {
  /** Animation variant to use */
  animationVariant?: AnimationVariant;
  /** Delay before animation starts (in ms) */
  animationDelay?: number;
  /** Duration of animation (in ms) */
  animationDuration?: number;
  /** Whether animations are enabled */
  animationsEnabled?: boolean;
  /** Enable/disable reduced motion for accessibility */
  reducedMotion?: boolean;
}

export interface BaseAssetProps {
  /** Asset ID for Directus images */
  fileId?: string;
  /** URL for standard images */
  src?: string;
  /** Alternative text for accessibility */
  alt: string;
  /** How the image should fit its container */
  objectFit?: ImageFit;
  /** Whether image should be loaded with priority */
  priority?: boolean;
  /** Lazy loading settings */
  loading?: 'eager' | 'lazy';
  /** Show loading indicator */
  showLoadingIndicator?: boolean;
  /** Callback when asset is loaded */
  onLoad?: () => void;
  /** Callback when asset fails to load */
  onError?: () => void;
}

export interface BaseLayoutProps {
  /** Additional CSS classes */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
  /** ID for the element */
  id?: string;
  /** Whether the component is visible */
  visible?: boolean;
  /** Component should render based on RTL language setting */
  rtlAware?: boolean;
}

/**
 * DetailHeroBanner Component Interfaces
 */

export interface DetailHeroBannerProps extends BaseLayoutProps, BaseAnimationProps {
  /** Hotel name to display */
  hotelName?: string;
  /** Location text */
  location?: string;
  /** Description text */
  description?: string;
  /** Background image URL or asset ID */
  backgroundImage?: string;
  /** Hotel slug for URL generation */
  slug?: string;
  /** Is this for the rooms page */
  isRoomsPage?: boolean;
}

/**
 * HotelMapView Component Interfaces
 */

export interface HotelCoordinates {
  lat: number;
  lng: number;
}

export interface HotelMapItem {
  /** Hotel unique identifier */
  id: string | number;
  /** Hotel name */
  name: string;
  /** Hotel location text */
  location: string;
  /** Hotel URL slug */
  slug: string;
  /** Hotel image URL or asset ID */
  image?: string;
  /** Coordinates for map placement */
  coordinates?: HotelCoordinates;
  /** Other hotel properties */
  [key: string]: any;
}

export interface HotelMapViewProps extends BaseLayoutProps, BaseAnimationProps {
  /** Hotels to display on the map */
  hotels: HotelMapItem[];
  /** Callback when a hotel is clicked */
  onHotelClick: (hotel: HotelMapItem) => void;
  /** Initial center coordinates */
  initialCenter?: HotelCoordinates;
  /** Initial zoom level */
  initialZoom?: number;
  /** Enable map controls */
  enableControls?: boolean;
  /** Custom map style */
  mapStyle?: string;
}

export interface MapMarkerProps extends BaseLayoutProps, BaseAnimationProps {
  /** The hotel this marker represents */
  hotel: HotelMapItem;
  /** Whether this marker is currently hovered */
  isHovered: boolean;
  /** Callback when marker is clicked */
  onClick: (hotel: HotelMapItem) => void;
  /** Callback when marker is hovered */
  onHover: (hotel: HotelMapItem | null) => void;
}

/**
 * MembershipForm Component Interfaces
 */

export interface MembershipFormData {
  firstName: string;
  lastName: string;
  hotelName: string;
  email: string;
  phone: string;
  website: string;
  about: string;
  agreeToTerms: boolean;
}

export interface MembershipFormProps extends BaseLayoutProps {
  /** Custom API endpoint */
  endpoint?: string;
  /** Callback on successful submission */
  onSubmitSuccess?: () => void;
  /** Callback on submission error */
  onSubmitError?: (error: string) => void;
  /** Custom form validation function */
  validate?: (data: MembershipFormData) => Record<string, string> | null;
  /** Initial form values */
  initialValues?: Partial<MembershipFormData>;
}

/**
 * LocalDining Component Interfaces
 */

export interface Restaurant {
  /** Restaurant unique identifier */
  id: number;
  /** Restaurant name */
  name: string;
  /** Restaurant type/category */
  type: 'local' | 'fine' | 'casual' | string;
  /** Cuisine type */
  cuisine: string;
  /** Restaurant description */
  description: string;
  /** Restaurant image URL or asset ID */
  image: string;
  /** Price range indicator */
  priceRange: string;
  /** Signature dish */
  signature: string;
  /** Distance from hotel */
  distance: string;
  /** Coordinates for map */
  coordinates: HotelCoordinates;
}

export interface LocalDiningProps extends BaseLayoutProps, BaseAnimationProps {
  /** Restaurant data to display */
  diningData?: Restaurant[];
  /** Alternative property name for backward compatibility */
  diningOptions?: Restaurant[];
  /** Section title */
  title?: string;
  /** Section subtitle */
  subtitle?: string;
  /** Enable filters */
  enableFilters?: boolean;
  /** Custom cuisine types */
  cuisineTypes?: Array<{ id: string; name: string }>;
}

/**
 * DestinationOverview Component Interfaces
 */

export interface Activity {
  name: string;
  description: string;
  image: string;
  season?: 'summer' | 'winter' | 'all';
}

export interface TransportOption {
  type: 'air' | 'train' | 'car' | 'other';
  description: string;
  details: string;
  icon?: string;
}

export interface DestinationData {
  name: string;
  description: string;
  highlights: string[];
  activities: {
    summer: Activity[];
    winter: Activity[];
  };
  transport: TransportOption[];
}

export interface DestinationOverviewProps extends BaseLayoutProps, BaseAnimationProps {
  /** Destination data to display */
  destinationData?: DestinationData;
  /** Alternative property name for backward compatibility */
  destination?: DestinationData;
  /** Initial active tab */
  initialTab?: 'overview' | 'activities' | 'transport';
  /** Enable tab switching */
  enableTabs?: boolean;
}

/**
 * HotelQuickView Component Interfaces
 */

export interface Room {
  type: string;
  description: string;
  price: string;
  capacity: number;
  features?: string[];
  image?: string;
}

export interface HotelQuickViewData {
  name: string;
  images: string[];
  amenities: string[];
  rooms: Room[];
  location?: string;
  description?: string;
}

export interface HotelQuickViewProps extends BaseLayoutProps, BaseAnimationProps {
  /** Hotel data to display */
  hotel: HotelQuickViewData;
  /** Callback when view is closed */
  onClose?: () => void;
  /** Initial active tab */
  initialTab?: 'gallery' | 'amenities' | 'rooms';
  /** Whether the view is modal */
  isModal?: boolean;
}

/**
 * FeaturedHotel Component Interfaces
 */

export interface FeaturedHotelData {
  name: string;
  location: string;
  description: string;
  images: string[];
  slug: string;
  features?: string[];
}

export interface FeaturedHotelProps extends BaseLayoutProps, BaseAnimationProps {
  /** Hotel data to display */
  hotel: FeaturedHotelData;
  /** Enable auto-rotation of images */
  autoRotate?: boolean;
  /** Rotation interval in ms */
  interval?: number;
  /** Show booking CTA */
  showBookingCta?: boolean;
  /** Custom CTA text */
  ctaText?: string;
  /** Custom CTA URL */
  ctaUrl?: string;
}

/**
 * DemoAssetGallery Component Interfaces
 */

export interface Asset {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  description?: string;
  type?: 'image' | 'video' | 'document';
  fileSize?: number;
}

export interface SpinnerOption {
  size: DisplaySize;
  color: 'primary' | 'secondary' | 'olive' | 'gray';
  withProgress?: boolean;
  progressValue?: number;
}

export interface DemoAssetGalleryProps extends BaseLayoutProps {
  /** Assets to display */
  assets?: Asset[];
  /** Initial tab */
  initialTab?: 'images' | 'spinners';
  /** Default spinner configuration */
  defaultSpinnerConfig?: SpinnerOption;
}

/**
 * RestaurantFeature Component Interfaces
 */

export interface RestaurantFeatureItem {
  id: number;
  name: string;
  description: string;
  image: string;
  menu?: string;
  features?: string[];
  cuisine?: string;
  priceRange?: string;
}

export interface RestaurantFeatureProps extends BaseLayoutProps, BaseAnimationProps {
  /** Restaurants to display */
  restaurants: RestaurantFeatureItem[];
  /** Section title */
  title?: string;
  /** Section subtitle */
  subtitle?: string;
  /** Allow locking selection */
  enableLock?: boolean;
  /** Initial selected restaurant ID */
  initialSelectedId?: number;
}

/**
 * Feature Interaction Component Interfaces
 */

export interface FeatureInteractionProps extends BaseLayoutProps {
  /** Unique identifier for the feature */
  featureId: string;
  /** Text to display in tooltip */
  tooltipText?: string;
  /** Position of the tooltip */
  tooltipPosition?: FeaturePosition;
  /** Whether tooltip is enabled */
  tooltipEnabled?: boolean;
  /** Whether highlight effect is enabled */
  highlightEnabled?: boolean;
  /** Highlight effect type */
  highlightEffect?: 'pulse' | 'glow' | 'outline' | 'none';
  /** Callback when feature is interacted with */
  onInteraction?: (type: InteractionType) => void;
  /** Feature elements */
  children: React.ReactNode;
}

/**
 * Animation variant interfaces for framer-motion
 */

export interface FadeAnimationVariants {
  hidden: { opacity: number };
  visible: { opacity: number };
  [key: string]: any;
}

export interface SlideAnimationVariants {
  hidden: { x: number; opacity: number };
  visible: { x: number; opacity: number };
  [key: string]: any;
}

export interface ScaleAnimationVariants {
  hidden: { scale: number; opacity: number };
  visible: { scale: number; opacity: number };
  [key: string]: any;
}

/**
 * Utility types for component internals
 */

export type TabId = string | number;

export interface TabItem {
  id: TabId;
  label: string;
  icon?: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
}

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface ImageDisplayOptions {
  showCaption?: boolean;
  showControls?: boolean;
  enableZoom?: boolean;
  enableFullscreen?: boolean;
  enableDownload?: boolean;
}

/**
 * TravelJourneyDesigner Component Interfaces (Sub-Batch 6.5)
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
 * TravelAdvisor Component Interfaces (Sub-Batch 6.5)
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
 * Enhanced HotelMapView Component Interfaces (Sub-Batch 6.5)
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
  /** Custom tooltip content */
  tooltipContent?: ReactNode;
}

/**
 * AnimatedHotelEntry Component Interfaces (Sub-Batch 6.5)
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
 * Feature Interaction Extensions (Sub-Batch 6.5)
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
 * Hook Types for Travel Planning (Sub-Batch 6.5)
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
 * Animation Hook Types (Sub-Batch 6.5)
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