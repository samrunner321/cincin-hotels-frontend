/**
 * Typdefinitionen für Mitgliedschaftsfunktionen
 */

/**
 * Enum für Mitgliedschaftsstufen
 */
export enum MembershipTier {
  BASIC = 'basic',
  PREMIUM = 'premium',
  VIP = 'vip',
}

/**
 * Interface für einen Mitgliedschaftsvorteil
 */
export interface MembershipBenefit {
  /** Eindeutige ID des Vorteils */
  id: string | number;
  /** Titel des Vorteils */
  title: string;
  /** Beschreibung des Vorteils */
  description: string;
  /** Icon/Symbol */
  icon?: string;
  /** In welchen Mitgliedsstufen ist dieser Vorteil enthalten? */
  availableInTiers: MembershipTier[];
  /** Ist dies ein Highlight/besonderer Vorteil? */
  isHighlighted?: boolean;
  /** Reihenfolge */
  displayOrder?: number;
}

/**
 * Interface für eine Mitgliedschaftsstufe
 */
export interface MembershipTierDetails {
  /** Stufenbezeichner */
  tier: MembershipTier;
  /** Anzeigename */
  name: string;
  /** Beschreibung */
  description: string;
  /** Monatlicher Preis */
  monthlyPrice?: number;
  /** Jährlicher Preis */
  yearlyPrice?: number;
  /** Währung */
  currency: string;
  /** Vorteile dieser Stufe */
  benefits: MembershipBenefit[];
  /** Hat diese Stufe eine Einmalgebühr? */
  hasJoiningFee?: boolean;
  /** Höhe der Einmalgebühr */
  joiningFee?: number;
  /** Ist diese Stufe aktiv? */
  isActive: boolean;
  /** Ist dies eine empfohlene Stufe? */
  isRecommended?: boolean;
  /** Minimale Vertragslaufzeit in Monaten */
  minimumContractMonths?: number;
}

/**
 * Interface für Mitgliedsdaten
 */
export interface Member {
  /** Eindeutige ID des Mitglieds */
  id: string | number;
  /** Vorname */
  firstName: string;
  /** Nachname */
  lastName: string;
  /** Vollständiger Name */
  fullName?: string;
  /** E-Mail */
  email: string;
  /** Telefonnummer */
  phone?: string;
  /** Adresse */
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  /** Mitgliedsstufe */
  tier: MembershipTier;
  /** Mitgliedsnummer */
  membershipNumber?: string;
  /** Beitrittsdatum */
  joinDate: string;
  /** Ablaufdatum der Mitgliedschaft */
  expiryDate?: string;
  /** Status der Mitgliedschaft */
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  /** Zahlungsstatus */
  paymentStatus?: 'paid' | 'overdue' | 'free';
  /** Präferenzen */
  preferences?: {
    /** Bevorzugte Sprache */
    language?: string;
    /** Newsletter abonniert? */
    newsletterOptIn?: boolean;
    /** Marketingkommunikation erlaubt? */
    marketingOptIn?: boolean;
    /** Bevorzugte Kontaktmethode */
    preferredContactMethod?: 'email' | 'phone' | 'post';
    /** Reisevorlieben */
    travelPreferences?: string[];
  };
  /** Gesammelte Punkte/Meilen */
  points?: number;
  /** Metadaten */
  metadata?: Record<string, any>;
}

/**
 * Interface für Punktetransaktionen
 */
export interface PointTransaction {
  /** Eindeutige ID der Transaktion */
  id: string | number;
  /** Mitglieds-ID */
  memberId: string | number;
  /** Datum der Transaktion */
  date: string;
  /** Anzahl der Punkte (positiv=Gutschrift, negativ=Einlösung) */
  points: number;
  /** Grund/Beschreibung */
  description: string;
  /** Referenz (z.B. Buchungs-ID) */
  reference?: string;
  /** Transaktionstyp */
  type: 'earn' | 'redeem' | 'expire' | 'adjust';
  /** Ablaufdatum der Punkte */
  expiryDate?: string;
  /** Status */
  status: 'pending' | 'completed' | 'cancelled' | 'expired';
}

/**
 * Interface für Mitgliedschaftsvorteile-Komponente Props
 */
export interface MembershipBenefitsProps {
  /** Vorteilseinträge */
  benefits: MembershipBenefit[];
  /** Ausgewählte Mitgliedsstufe */
  selectedTier?: MembershipTier;
  /** Alle Stufen vergleichen? */
  compareAllTiers?: boolean;
  /** Callback für die Stufenauswahl */
  onTierSelect?: (tier: MembershipTier) => void;
  /** Zusätzliche CSS-Klassen */
  className?: string;
}

/**
 * Interface für Mitgliedschaftsformular Props
 */
export interface MembershipFormProps {
  /** Initiale Formulardaten */
  initialValues?: Partial<MembershipFormData>;
  /** Vorausgewählte Mitgliedsstufe */
  preselectedTier?: MembershipTier;
  /** Verfügbare Mitgliedsstufen */
  availableTiers?: MembershipTierDetails[];
  /** Callback für Formulareinreichung */
  onSubmit?: (data: MembershipFormData) => Promise<void>;
  /** Ist das Formular im Ladezustand? */
  isLoading?: boolean;
  /** Ist nur zur Aktualisierung? */
  isUpdateOnly?: boolean;
  /** Fehlermeldung */
  error?: string;
  /** Erfolgsmeldung */
  successMessage?: string;
  /** Zusätzliche CSS-Klassen */
  className?: string;
}

/**
 * Interface für Mitgliedschaftsformulardaten (erweiterte Version)
 */
export interface MembershipFormData {
  /** Vorname */
  firstName: string;
  /** Nachname */
  lastName: string;
  /** E-Mail */
  email: string;
  /** Telefonnummer */
  phone?: string;
  /** Straße */
  street?: string;
  /** Stadt */
  city?: string;
  /** Bundesland/Region */
  state?: string;
  /** Land */
  country?: string;
  /** PLZ */
  postalCode?: string;
  /** Mitgliedsstufe */
  membershipTier: MembershipTier;
  /** Bevorzugte Zahlungsintervall */
  billingCycle?: 'monthly' | 'yearly';
  /** Zahlungsmethode */
  paymentMethod?: 'creditcard' | 'paypal' | 'banktransfer' | 'directdebit';
  /** Zahlungsdetails */
  paymentDetails?: {
    cardNumber?: string;
    cardExpiry?: string;
    cardCVC?: string;
    cardHolder?: string;
    [key: string]: any;
  };
  /** Empfehlungs-Code */
  referralCode?: string;
  /** Newsletter abonnieren? */
  newsletter: boolean;
  /** Marketing-Kommunikation erlauben? */
  marketingOptIn?: boolean;
  /** Nutzungsbedingungen akzeptiert? */
  acceptedTerms: boolean;
  /** Datenschutzbestimmungen akzeptiert? */
  acceptedPrivacyPolicy?: boolean;
  /** Reiseinteressen */
  interests?: string[];
  /** Notizen/Sonderwünsche */
  notes?: string;
}

/**
 * Interface für MembershipHero-Komponente Props
 */
export interface MembershipHeroProps {
  /** Titel */
  title?: string;
  /** Untertitel */
  subtitle?: string;
  /** Hervorgehobene Vorteile */
  featuredBenefits?: MembershipBenefit[];
  /** Hero-Bild */
  backgroundImage?: string;
  /** Callback für CTA-Button */
  onCtaClick?: () => void;
  /** Text für den CTA-Button */
  ctaText?: string;
  /** Zusätzliche CSS-Klassen */
  className?: string;
}