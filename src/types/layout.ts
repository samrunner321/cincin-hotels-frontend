import { ReactNode } from 'react';
import { MotionProps } from 'framer-motion';

/**
 * Layout component props
 */
export interface LayoutProps {
  children: ReactNode;
}

/**
 * Navbar component props
 */
export interface NavbarProps {
  transparent?: boolean;
  className?: string;
}

/**
 * Mobile menu props
 */
export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Navigation section props for MobileMenu
 */
export interface NavSectionProps {
  title: string;
  links: NavLink[];
  variants?: MotionProps['variants'];
  onClick?: () => void;
}

/**
 * Navigation link interface
 */
export interface NavLink {
  text: string;
  href: string;
  isButton?: boolean;
}

/**
 * Footer component props
 */
export interface FooterProps {
  className?: string;
}

/**
 * Footer column props
 */
export interface FooterColumnProps {
  title: string;
  links: NavLink[];
}

/**
 * Social media icon props
 */
export interface SocialIconProps {
  className?: string;
}

/**
 * Hotel modal props
 */
export interface HotelModalProps {
  hotel: HotelModalData | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Hotel data needed for the modal
 */
export interface HotelModalData {
  name: string;
  location?: string;
  description?: string;
  slug: string;
  categories?: string[];
  extraInfo?: string;
  [key: string]: any; // For additional hotel properties that might be used
}

/**
 * Animation variants for navbar and menu transitions
 */
export interface NavAnimationVariants {
  logoVariants: MotionProps['variants'];
  navItemVariants: MotionProps['variants'];
}

/**
 * Menu animation variants
 */
export interface MenuAnimationVariants {
  menuVariants: MotionProps['variants'];
  itemVariants: MotionProps['variants'];
}