import tokens from './tokens';

/**
 * Theme Configuration
 * 
 * This file provides utility functions and configurations for using design tokens
 * in a themeable way throughout the application.
 */

/**
 * Default theme configuration
 */
export const defaultTheme = {
  // Primary colors
  primary: tokens.colors.brand.olive,
  secondary: tokens.colors.brand.beige,
  
  // Text colors
  text: {
    primary: tokens.colors.gray[900],
    secondary: tokens.colors.gray[600],
    disabled: tokens.colors.gray[400],
    inverse: tokens.colors.white,
  },
  
  // Background colors
  background: {
    primary: tokens.colors.white,
    secondary: tokens.colors.gray[50],
    tertiary: tokens.colors.gray[100],
    disabled: tokens.colors.gray[200],
  },
  
  // Border colors
  border: {
    light: tokens.colors.gray[200],
    default: tokens.colors.gray[300],
    dark: tokens.colors.gray[400],
  },
  
  // State colors
  state: tokens.colors.state,
  
  // Typography
  typography: tokens.typography,
  
  // Spacing
  spacing: tokens.spacing,
  
  // Border radius
  borderRadius: tokens.borderRadius,
  
  // Shadows
  shadows: tokens.shadows,
  
  // Z-index
  zIndex: tokens.zIndex,
  
  // Animation
  animation: tokens.animation,
  
  // Breakpoints
  breakpoints: tokens.breakpoints,
  
  // Component-specific tokens
  components: {
    button: {
      borderRadius: tokens.borderRadius.md,
      fontWeight: tokens.typography.fontWeight.medium,
      paddingX: {
        sm: tokens.spacing[2],
        md: tokens.spacing[3],
        lg: tokens.spacing[4],
      },
      paddingY: {
        sm: tokens.spacing[1],
        md: tokens.spacing[2],
        lg: tokens.spacing[3],
      },
      fontSize: {
        sm: tokens.typography.fontSize.sm,
        md: tokens.typography.fontSize.base,
        lg: tokens.typography.fontSize.lg,
      },
    },
    input: {
      borderRadius: tokens.borderRadius.md,
      borderColor: tokens.colors.gray[300],
      backgroundColor: tokens.colors.white,
      fontSize: tokens.typography.fontSize.base,
      paddingX: tokens.spacing[3],
      paddingY: tokens.spacing[2],
      borderWidth: '1px',
      shadow: tokens.shadows.sm,
      focusRingColor: tokens.colors.brand.olive[300],
      focusRingWidth: '2px',
    },
    card: {
      borderRadius: tokens.borderRadius.lg,
      backgroundColor: tokens.colors.white,
      borderColor: tokens.colors.gray[200],
      shadow: tokens.shadows.md,
      paddingX: tokens.spacing[6],
      paddingY: tokens.spacing[4],
    },
    modal: {
      borderRadius: tokens.borderRadius.lg,
      backgroundColor: tokens.colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadow: tokens.shadows.xl,
      padding: tokens.spacing[6],
      zIndex: tokens.zIndex.modal,
      backdropColor: 'rgba(0, 0, 0, 0.5)',
    },
    navigation: {
      backgroundColor: tokens.colors.white,
      textColor: tokens.colors.gray[700],
      activeTextColor: tokens.colors.brand.olive[700],
      hoverBackgroundColor: tokens.colors.gray[100],
      borderColor: tokens.colors.gray[200],
      zIndex: '50',
    },
    table: {
      borderColor: tokens.colors.gray[200],
      headerBackgroundColor: tokens.colors.gray[50],
      rowHoverColor: tokens.colors.gray[50],
      selectedRowColor: tokens.colors.brand.olive[50],
      borderRadius: tokens.borderRadius.md,
      fontSize: tokens.typography.fontSize.sm,
    },
    tabs: {
      backgroundColor: tokens.colors.white,
      textColor: tokens.colors.gray[600],
      activeTextColor: tokens.colors.brand.olive[700],
      hoverColor: tokens.colors.gray[100],
      borderColor: tokens.colors.gray[200],
      activeBorderColor: tokens.colors.brand.olive[500],
      borderRadius: tokens.borderRadius.md,
    },
    pagination: {
      textColor: tokens.colors.gray[700],
      activeBackgroundColor: tokens.colors.brand.olive[50],
      hoverBackgroundColor: tokens.colors.gray[100],
      borderColor: tokens.colors.gray[300],
      borderRadius: tokens.borderRadius.md,
      fontSize: tokens.typography.fontSize.sm,
    },
  },
};

/**
 * Dark theme configuration
 */
export const darkTheme = {
  // Primary colors (slightly adjusted for dark mode)
  primary: {
    ...tokens.colors.brand.olive,
    500: '#a2b052', // Brighter for dark mode
  },
  secondary: {
    ...tokens.colors.brand.beige,
    500: '#d6c687', // Brighter for dark mode
  },
  
  // Text colors
  text: {
    primary: tokens.colors.gray[100],
    secondary: tokens.colors.gray[300],
    disabled: tokens.colors.gray[500],
    inverse: tokens.colors.gray[900],
  },
  
  // Background colors
  background: {
    primary: tokens.colors.gray[900],
    secondary: tokens.colors.gray[800],
    tertiary: tokens.colors.gray[700],
    disabled: tokens.colors.gray[600],
  },
  
  // Border colors
  border: {
    light: tokens.colors.gray[700],
    default: tokens.colors.gray[600],
    dark: tokens.colors.gray[500],
  },
  
  // State colors with adjustments for dark theme
  state: {
    success: {
      light: '#132e19',
      default: '#22c55e',
      dark: '#dcfce7',
    },
    warning: {
      light: '#372213',
      default: '#eab308',
      dark: '#fef9c3',
    },
    error: {
      light: '#471818',
      default: '#ef4444',
      dark: '#fee2e2',
    },
    info: {
      light: '#172554',
      default: '#3b82f6',
      dark: '#dbeafe',
    }
  },
  
  // Typography (same as default)
  typography: tokens.typography,
  
  // Spacing (same as default)
  spacing: tokens.spacing,
  
  // Border radius (same as default)
  borderRadius: tokens.borderRadius,
  
  // Shadows (adjusted for dark mode)
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)',
    none: 'none',
  },
  
  // Z-index (same as default)
  zIndex: tokens.zIndex,
  
  // Animation (same as default)
  animation: tokens.animation,
  
  // Breakpoints (same as default)
  breakpoints: tokens.breakpoints,
  
  // Component-specific tokens for dark mode
  components: {
    button: {
      borderRadius: tokens.borderRadius.md,
      fontWeight: tokens.typography.fontWeight.medium,
      paddingX: {
        sm: tokens.spacing[2],
        md: tokens.spacing[3],
        lg: tokens.spacing[4],
      },
      paddingY: {
        sm: tokens.spacing[1],
        md: tokens.spacing[2],
        lg: tokens.spacing[3],
      },
      fontSize: {
        sm: tokens.typography.fontSize.sm,
        md: tokens.typography.fontSize.base,
        lg: tokens.typography.fontSize.lg,
      },
    },
    input: {
      borderRadius: tokens.borderRadius.md,
      borderColor: tokens.colors.gray[600],
      backgroundColor: tokens.colors.gray[800],
      fontSize: tokens.typography.fontSize.base,
      paddingX: tokens.spacing[3],
      paddingY: tokens.spacing[2],
      borderWidth: '1px',
      shadow: 'none',
      focusRingColor: tokens.colors.brand.olive[400],
      focusRingWidth: '2px',
    },
    card: {
      borderRadius: tokens.borderRadius.lg,
      backgroundColor: tokens.colors.gray[800],
      borderColor: tokens.colors.gray[700],
      shadow: tokens.shadows.md,
      paddingX: tokens.spacing[6],
      paddingY: tokens.spacing[4],
    },
    modal: {
      borderRadius: tokens.borderRadius.lg,
      backgroundColor: tokens.colors.gray[800],
      shadowColor: 'rgba(0, 0, 0, 0.5)',
      shadow: tokens.shadows.xl,
      padding: tokens.spacing[6],
      zIndex: tokens.zIndex.modal,
      backdropColor: 'rgba(0, 0, 0, 0.7)',
    },
    navigation: {
      backgroundColor: tokens.colors.gray[900],
      textColor: tokens.colors.gray[300],
      activeTextColor: tokens.colors.brand.olive[400],
      hoverBackgroundColor: tokens.colors.gray[800],
      borderColor: tokens.colors.gray[700],
      zIndex: '50',
    },
    table: {
      borderColor: tokens.colors.gray[700],
      headerBackgroundColor: tokens.colors.gray[800],
      rowHoverColor: tokens.colors.gray[800],
      selectedRowColor: tokens.colors.gray[700],
      borderRadius: tokens.borderRadius.md,
      fontSize: tokens.typography.fontSize.sm,
    },
    tabs: {
      backgroundColor: tokens.colors.gray[900],
      textColor: tokens.colors.gray[300],
      activeTextColor: tokens.colors.brand.olive[400],
      hoverColor: tokens.colors.gray[800],
      borderColor: tokens.colors.gray[700],
      activeBorderColor: tokens.colors.brand.olive[500],
      borderRadius: tokens.borderRadius.md,
    },
    pagination: {
      textColor: tokens.colors.gray[300],
      activeBackgroundColor: tokens.colors.gray[700],
      hoverBackgroundColor: tokens.colors.gray[800],
      borderColor: tokens.colors.gray[600],
      borderRadius: tokens.borderRadius.md,
      fontSize: tokens.typography.fontSize.sm,
    },
  },
};

/**
 * Theme context type
 */
export type ThemeContextType = {
  theme: typeof defaultTheme;
  colorMode: 'light' | 'dark';
  setColorMode: (mode: 'light' | 'dark') => void;
};

/**
 * Creates theme variables from tokens
 */
export function createThemeVariables(theme: typeof defaultTheme) {
  return {
    // CSS variables are created here for use in styled components or CSS-in-JS
  };
}

export default defaultTheme;