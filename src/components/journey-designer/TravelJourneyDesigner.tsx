'use client';

/**
 * TravelJourneyDesigner Komponente
 * 
 * Ein interaktiver Reiseplanungs-Assistent, der Benutzern hilft,
 * ihre perfekte Reiseroute basierend auf ihren Präferenzen zu erstellen.
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
// Mock implementation of useUIState
const useUIState = () => ({
  state: {
    theme: {
      current: 'light',
      animationsEnabled: true,
      reducedMotion: false
    },
    modal: {
      currentModal: null,
      modalData: null
    }
  },
  showModal: () => {},
  hideModal: () => {},
});
import { useFeatureInteraction } from '../../hooks/useFeatureInteraction';
import { useTravelPlanner } from '../../hooks/useTravelPlanner';
import { cn } from '../../lib/utils';
import type { 
  TravelJourneyDesignerProps,
  Journey,
  JourneyStep,
  JourneyOption,
  TravelPreferences,
  OptionCardProps
} from '../../types/advanced-ui';

// Standard-Schritte für den Reiseplaner
const DEFAULT_STEPS: JourneyStep[] = [
  {
    id: 'travelerType',
    title: 'Welche Art von Reisender sind Sie?',
    options: [
      { id: 'solo', label: 'Alleinreisender', icon: '🧳' },
      { id: 'couple', label: 'Paar', icon: '💑' },
      { id: 'family', label: 'Familie', icon: '👨‍👩‍👧‍👦' },
      { id: 'friends', label: 'Freundesgruppe', icon: '👯‍♀️' }
    ]
  },
  {
    id: 'destination',
    title: 'Wählen Sie Ihr Traumziel',
    options: [
      { id: 'mountains', label: 'Berge', icon: '🏔️' },
      { id: 'beach', label: 'Strand', icon: '🏝️' },
      { id: 'city', label: 'Stadt', icon: '🏙️' },
      { id: 'countryside', label: 'Landschaft', icon: '🌄' }
    ]
  },
  {
    id: 'experiences',
    title: 'Wählen Sie Ihre bevorzugten Erlebnisse',
    multiSelect: true,
    options: [
      { id: 'culinary', label: 'Kulinarik', icon: '🍽️' },
      { id: 'wellness', label: 'Wellness & Spa', icon: '💆‍♀️' },
      { id: 'adventure', label: 'Abenteuer', icon: '🧗‍♂️' },
      { id: 'cultural', label: 'Kultur', icon: '🏛️' },
      { id: 'nightlife', label: 'Nachtleben', icon: '🍸' },
      { id: 'nature', label: 'Natur', icon: '🌿' }
    ]
  },
  {
    id: 'accommodationType',
    title: 'Welche Art von Unterkunft bevorzugen Sie?',
    options: [
      { id: 'luxury', label: 'Luxus', icon: '✨' },
      { id: 'boutique', label: 'Boutique', icon: '🏡' },
      { id: 'design', label: 'Design', icon: '🎨' },
      { id: 'historic', label: 'Historisch', icon: '🏰' }
    ]
  },
  {
    id: 'seasonality',
    title: 'Wann möchten Sie reisen?',
    options: [
      { id: 'winter', label: 'Winter', icon: '❄️' },
      { id: 'spring', label: 'Frühling', icon: '🌷' },
      { id: 'summer', label: 'Sommer', icon: '☀️' },
      { id: 'autumn', label: 'Herbst', icon: '🍂' }
    ]
  }
];

// Standard-Reiserouten
const DEFAULT_JOURNEYS: Journey[] = [
  {
    id: 1,
    title: "Alpine Wellness Retreat",
    description: "Erholen Sie sich in den Schweizer Alpen mit Spa-Behandlungen, Thermalbädern und atemberaubenden Bergpanoramen.",
    matches: {
      travelerType: ['couple', 'solo'],
      destination: 'mountains',
      experiences: ['wellness', 'nature'],
      accommodationType: ['luxury', 'design'],
      seasonality: ['winter', 'summer']
    },
    hotels: [
      { id: 1, name: "Chetzeron", location: "Crans-Montana", image: "/images/hotels/hotel-1.jpg" },
      { id: 2, name: "LeCrans Hotel & Spa", location: "Crans-Montana", image: "/images/hotels/hotel-2.jpg" }
    ],
    imageBg: "/images/hotels/hotel-2.jpg"
  },
  {
    id: 2,
    title: "Mediterranean Family Adventure",
    description: "Schaffen Sie unvergessliche Erinnerungen mit Ihrer Familie an der atemberaubenden Mittelmeerküste.",
    matches: {
      travelerType: ['family'],
      destination: 'beach',
      experiences: ['adventure', 'nature', 'culinary'],
      accommodationType: ['luxury', 'boutique'],
      seasonality: ['summer', 'spring']
    },
    hotels: [
      { id: 3, name: "Hotel Guarda Golf", location: "Crans-Montana", image: "/images/hotels/hotel-3.jpg" },
      { id: 4, name: "Crans Ambassador", location: "Crans-Montana", image: "/images/hotels/hotel-4.jpg" }
    ],
    imageBg: "/images/hotels/hotel-3.jpg"
  },
  {
    id: 3,
    title: "Urban Cultural Exploration",
    description: "Tauchen Sie ein in die pulsierende Kultur, Geschichte und Kulinarik der faszinierendsten Städte Europas.",
    matches: {
      travelerType: ['couple', 'friends', 'solo'],
      destination: 'city',
      experiences: ['cultural', 'culinary', 'nightlife'],
      accommodationType: ['boutique', 'design', 'historic'],
      seasonality: ['spring', 'autumn']
    },
    hotels: [
      { id: 5, name: "Art de Vivre Hotel", location: "Paris", image: "/images/hotels/hotel-5.jpg" },
      { id: 6, name: "Michelberger Hotel", location: "Berlin", image: "/images/hotels/hotel-6.jpg" }
    ],
    imageBg: "/images/hotels/hotel-5.jpg"
  },
  {
    id: 4,
    title: "Countryside Gastronomy Tour",
    description: "Genießen Sie die authentischen Aromen und kulinarischen Traditionen der malerischsten ländlichen Regionen Europas.",
    matches: {
      travelerType: ['couple', 'friends'],
      destination: 'countryside',
      experiences: ['culinary', 'nature', 'cultural'],
      accommodationType: ['boutique', 'historic'],
      seasonality: ['summer', 'autumn']
    },
    hotels: [
      { id: 7, name: "Villa Honegg", location: "Schweizer Landschaft", image: "/images/hotels/hotel-7.jpg" },
      { id: 8, name: "Forestis Dolomites", location: "Südtirol", image: "/images/hotels/hotel-1.jpg" }
    ],
    imageBg: "/images/hotels/hotel-7.jpg"
  },
  {
    id: 5,
    title: "Winter Alpine Adventure",
    description: "Erleben Sie aufregende Wintersportaktivitäten und gemütliche Abende in den majestätischen Alpen.",
    matches: {
      travelerType: ['friends', 'couple'],
      destination: 'mountains',
      experiences: ['adventure', 'wellness'],
      accommodationType: ['luxury', 'design'],
      seasonality: ['winter']
    },
    hotels: [
      { id: 9, name: "Chetzeron", location: "Crans-Montana", image: "/images/hotels/hotel-1.jpg" },
      { id: 10, name: "Vigilius Mountain Resort", location: "Südtirol", image: "/images/hotels/hotel-2.jpg" }
    ],
    imageBg: "/images/hotels/hotel-6.jpg"
  }
];

/**
 * OptionCard Komponente für die Anzeige der Auswahloptionen
 */
const OptionCard: React.FC<OptionCardProps> = ({ 
  option, 
  isSelected, 
  onClick, 
  size = 'md'
}) => {
  // Feature-Interaktion für Card
  const { getFeatureProps, isHovered } = useFeatureInteraction({
    featureId: `option-${option.id}`,
    tooltip: {
      enabled: Boolean(option.description),
      text: option.description,
      position: 'top'
    },
    highlight: {
      enabled: true,
      effect: isSelected ? 'glow' : 'pulse',
      duration: 800
    },
    onInteraction: (type) => {
      if (type === 'click') {
        onClick();
      }
    }
  });

  // Größen-Klassen für verschiedene Card-Größen
  const sizeClasses = {
    sm: 'p-2 text-xs',
    md: 'p-4 text-sm',
    lg: 'p-6 text-base'
  };

  // Use the feature props safely with TypeScript
  const featureProps = getFeatureProps();

  return (
    <motion.button
      ref={featureProps.ref as React.Ref<HTMLButtonElement>}
      onMouseEnter={featureProps.onMouseEnter}
      onMouseLeave={featureProps.onMouseLeave}
      onClick={featureProps.onClick}
      onFocus={featureProps.onFocus}
      onBlur={featureProps.onBlur}
      aria-expanded={featureProps['aria-expanded']}
      data-feature-id={featureProps['data-feature-id']}
      data-state={featureProps['data-state']}
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border-2 transition-all',
        sizeClasses[size],
        isSelected
          ? 'border-brand-olive-400 bg-brand-olive-50 shadow-md'
          : 'border-gray-200 hover:border-gray-300 bg-white',
        isHovered && !isSelected && 'border-gray-300 shadow-sm'
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="text-2xl mb-1">{option.icon}</span>
      <span className="font-brooklyn text-center">{option.label}</span>
    </motion.button>
  );
};

/**
 * TravelJourneyDesigner Hauptkomponente
 */
export const TravelJourneyDesigner: React.FC<TravelJourneyDesignerProps> = ({
  steps = DEFAULT_STEPS,
  journeys = DEFAULT_JOURNEYS,
  initialOpen = false,
  isFloating = true,
  buttonText = "Design Your Journey",
  onJourneySelect,
  onOpenChange,
  initialPreferences = {},
  className = '',
  style,
  id,
  animationVariant = 'scale',
  animationDelay = 0,
  animationDuration = 500,
  animationsEnabled,
  reducedMotion
}) => {
  // UI-State für Animationspräferenzen
  const { state: uiState } = useUIState();
  const shouldAnimate = 
    (animationsEnabled ?? !uiState.theme.reducedMotion) && 
    (reducedMotion ?? uiState.theme.animationsEnabled);

  // Lokaler State
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen);
  const [activeStep, setActiveStep] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Travel Planner Hook
  const {
    preferences,
    updatePreference,
    resetPreferences,
    matchedJourney,
    allMatches,
    isLoading,
    findMatches
  } = useTravelPlanner({
    availableJourneys: journeys,
    initialPreferences,
    enablePersistence: true,
    storageKey: 'cincin-travel-preferences'
  });

  // Fortschritt berechnen
  const progress = (activeStep / steps.length) * 100;

  // Öffnen/Schließen-Status ändern
  const handleOpenChange = (newIsOpen: boolean) => {
    setIsOpen(newIsOpen);
    if (onOpenChange) {
      onOpenChange(newIsOpen);
    }
  };

  // Handling der Optionsauswahl
  const handleSelect = (option: JourneyOption) => {
    const currentStep = steps[activeStep];
    
    if (currentStep.multiSelect) {
      // Toggle-Auswahl für Multi-Select
      const experiences = [...preferences.experiences];
      const index = experiences.indexOf(option.id);
      
      if (index > -1) {
        experiences.splice(index, 1);
      } else {
        experiences.push(option.id);
      }
      
      updatePreference('experiences', experiences);
    } else {
      // Einzelauswahl für andere Schritte
      const key = currentStep.id as keyof TravelPreferences;
      updatePreference(key, option.id);
      
      // Zum nächsten Schritt, wenn nicht Multi-Select
      setTimeout(() => {
        setActiveStep(prev => prev + 1);
      }, 400);
    }
  };

  // Nächster/Zurück-Handler für Navigation
  const handleNext = () => {
    if (activeStep < steps.length) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  // Zurücksetzen aller Einstellungen
  const handleReset = () => {
    resetPreferences();
    setActiveStep(0);
  };

  // Prüfen, ob eine Option ausgewählt ist
  const isSelected = (option: JourneyOption): boolean => {
    const currentStep = steps[activeStep];
    if (currentStep?.multiSelect) {
      return preferences.experiences.includes(option.id);
    }
    const key = currentStep?.id as keyof TravelPreferences;
    return preferences[key] === option.id;
  };

  // Wenn der Benutzer alle Schritte abgeschlossen hat, passende Reiserouten finden
  useEffect(() => {
    if (activeStep >= steps.length) {
      findMatches();
    }
  }, [activeStep, findMatches, steps.length]);

  // Reiseroute auswählen
  const handleJourneySelect = (journey: Journey) => {
    if (onJourneySelect) {
      onJourneySelect(journey);
    }
    // Optional: Modal schließen nach Auswahl
    // handleOpenChange(false);
  };

  return (
    <>
      {/* Fester Button zum Öffnen des Designers, falls schwebend */}
      {isFloating && (
        <div className="fixed left-6 bottom-6 z-40">
          <motion.button
            className="bg-brand-olive-400 text-white px-4 py-3 rounded-full shadow-lg hover:bg-brand-olive-500 transition-colors flex items-center space-x-2"
            onClick={() => handleOpenChange(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-brooklyn">{buttonText}</span>
          </motion.button>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => handleOpenChange(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="journey-designer-title"
          >
            <motion.div
              ref={containerRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-xl",
                className
              )}
              style={style}
              id={id}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative h-24 bg-brand-olive-400 flex items-end">
                {/* Hintergrundmuster */}
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id="pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                      <circle cx="1" cy="1" r="1" fill="currentColor" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#pattern)" />
                  </svg>
                </div>
                
                <div className="p-6 text-white w-full">
                  <div className="flex justify-between items-center">
                    <h2 
                      id="journey-designer-title" 
                      className="text-xl md:text-2xl font-brooklyn"
                    >
                      Travel Journey Designer
                    </h2>
                    <button 
                      onClick={() => handleOpenChange(false)}
                      className="p-1 rounded-full hover:bg-white/20 transition-colors"
                      aria-label="Designer schließen"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Fortschrittsbalken */}
              <div className="w-full h-1 bg-gray-100">
                <div 
                  className="h-full bg-brand-olive-400 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Fortschritt: ${Math.round(progress)}%`}
                ></div>
              </div>

              {/* Inhalt */}
              <div className="p-6">
                {activeStep < steps.length ? (
                  // Schritte
                  <>
                    <div className="mb-8">
                      <h3 className="text-xl font-brooklyn text-gray-900 mb-2">
                        {steps[activeStep].title}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Schritt {activeStep + 1} von {steps.length}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      {steps[activeStep].options.map((option) => (
                        <OptionCard
                          key={option.id}
                          option={option}
                          isSelected={isSelected(option)}
                          onClick={() => handleSelect(option)}
                        />
                      ))}
                    </div>

                    <div className="flex justify-between">
                      {activeStep > 0 ? (
                        <button
                          onClick={handleBack}
                          className="px-4 py-2 text-gray-600 hover:text-gray-900 font-brooklyn flex items-center"
                          aria-label="Zurück zum vorherigen Schritt"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Zurück
                        </button>
                      ) : (
                        <div></div>
                      )}

                      {steps[activeStep].multiSelect && (
                        <button
                          onClick={handleNext}
                          disabled={preferences.experiences.length === 0}
                          className="px-6 py-2 bg-brand-olive-400 text-white rounded-full font-brooklyn hover:bg-brand-olive-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                          aria-label="Weiter zum nächsten Schritt"
                        >
                          Weiter
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  // Ergebnisse
                  <div className="py-4">
                    {isLoading ? (
                      // Ladeindikator
                      <div className="flex flex-col items-center justify-center py-12">
                        <svg className="animate-spin h-10 w-10 text-brand-olive-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-gray-500">Wir finden Ihre perfekte Reise...</p>
                      </div>
                    ) : matchedJourney ? (
                      // Gefundene Reiseroute
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        <div className="text-center mb-8">
                          <h3 className="text-2xl font-brooklyn text-gray-900 mb-2">
                            Ihre perfekte Reiseroute
                          </h3>
                          <p className="text-gray-500">
                            Basierend auf Ihren Vorlieben haben wir die ideale Reise für Sie zusammengestellt.
                          </p>
                        </div>

                        <div className="relative rounded-xl overflow-hidden mb-8">
                          <div className="absolute inset-0">
                            <Image
                              src={matchedJourney.imageBg}
                              alt={matchedJourney.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 768px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-black/30"></div>
                          </div>
                          <div className="relative z-10 p-6 text-white min-h-[200px] flex flex-col justify-end">
                            <h3 className="text-2xl font-brooklyn mb-2">{matchedJourney.title}</h3>
                            <p className="text-white/80 mb-4">{matchedJourney.description}</p>
                          </div>
                        </div>

                        <div className="mb-8">
                          <h4 className="text-lg font-brooklyn text-gray-900 mb-4">Empfohlene Hotels</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {matchedJourney.hotels.map((hotel) => (
                              <Link 
                                href={`/hotels/${hotel.id}`} 
                                key={hotel.id}
                                className="flex bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all group"
                              >
                                <div className="relative w-24 h-24">
                                  <Image
                                    src={hotel.image}
                                    alt={hotel.name}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-110 duration-500"
                                    sizes="96px"
                                  />
                                </div>
                                <div className="p-3 flex flex-col justify-center">
                                  <h5 className="font-brooklyn text-brand-olive-400 group-hover:text-brand-olive-500">{hotel.name}</h5>
                                  <p className="text-sm text-gray-500">{hotel.location}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <button
                            onClick={handleReset}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-brooklyn flex items-center"
                            aria-label="Von vorne beginnen"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Neu starten
                          </button>
                          <Link 
                            href="/contact" 
                            className="px-6 py-2.5 bg-brand-olive-400 text-white rounded-full font-brooklyn hover:bg-brand-olive-500 transition-colors flex items-center"
                            onClick={() => handleJourneySelect(matchedJourney)}
                          >
                            Diese Reise buchen
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </Link>
                        </div>
                      </motion.div>
                    ) : (
                      // Keine Übereinstimmung gefunden
                      <div className="flex flex-col items-center justify-center py-8">
                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-brooklyn text-gray-700 mb-2">Keine passenden Reiserouten gefunden</h3>
                        <p className="text-gray-500 mb-4 text-center">Wir konnten keine perfekte Übereinstimmung für Ihre Vorlieben finden.</p>
                        <button 
                          onClick={handleReset}
                          className="px-6 py-2.5 bg-brand-olive-400 text-white rounded-full font-brooklyn hover:bg-brand-olive-500 transition-colors"
                          aria-label="Mit neuen Präferenzen versuchen"
                        >
                          Erneut versuchen
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TravelJourneyDesigner;