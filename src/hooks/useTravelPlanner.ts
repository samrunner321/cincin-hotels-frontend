/**
 * useTravelPlanner Hook
 * 
 * Ein benutzerdefinierter Hook für die Reiseplanung, der Benutzerpräferenzen verwaltet,
 * passende Reiserouten findet und diese nach Relevanz bewertet.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { 
  Journey, 
  TravelPreferences, 
  UseTravelPlannerProps, 
  UseTravelPlannerReturn 
} from '../types/advanced-ui';
import { useUIState } from '../components/UIStateContext';

/**
 * Default-Werte für Benutzereinstellungen
 */
const DEFAULT_PREFERENCES: TravelPreferences = {
  travelerType: null,
  destination: null,
  experiences: [],
  accommodationType: null,
  seasonality: null
};

/**
 * useTravelPlanner Hook
 * 
 * @param props Hook-Konfiguration
 * @returns State und Funktionen zur Verwaltung der Reiseplanung
 * 
 * @example
 * const {
 *   preferences,
 *   updatePreference,
 *   resetPreferences,
 *   matchedJourney,
 *   allMatches,
 *   isLoading,
 *   findMatches
 * } = useTravelPlanner({
 *   availableJourneys: journeys,
 *   initialPreferences: { travelerType: 'couple' },
 *   enablePersistence: true
 * });
 */
export function useTravelPlanner(props: UseTravelPlannerProps = {}): UseTravelPlannerReturn {
  const {
    availableJourneys = [],
    initialPreferences = {},
    matchThreshold = 0.3,
    enablePersistence = false,
    storageKey = 'cincin-travel-preferences'
  } = props;

  // UI-State-Kontext für Theme-Einstellungen und Benutzervorlieben
  const { state: uiState } = useUIState();

  // Initialisierung der Zustände
  const [preferences, setPreferences] = useState<TravelPreferences>(() => {
    // Versuchen, gespeicherte Einstellungen zu laden, wenn Persistenz aktiviert ist
    if (enablePersistence && typeof window !== 'undefined') {
      try {
        const savedPrefs = localStorage.getItem(storageKey);
        if (savedPrefs) {
          return { ...DEFAULT_PREFERENCES, ...JSON.parse(savedPrefs) };
        }
      } catch (error) {
        console.error('Fehler beim Laden gespeicherter Reiseeinstellungen:', error);
      }
    }
    
    // Initialisierung mit Default-Werten und übergebenen initialen Einstellungen
    return { ...DEFAULT_PREFERENCES, ...initialPreferences };
  });

  const [matchedJourney, setMatchedJourney] = useState<Journey | null>(null);
  const [allMatches, setAllMatches] = useState<Array<{ journey: Journey; score: number }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Speichern der Einstellungen, wenn sie sich ändern und Persistenz aktiviert ist
  useEffect(() => {
    if (enablePersistence && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(preferences));
      } catch (error) {
        console.error('Fehler beim Speichern der Reiseeinstellungen:', error);
      }
    }
  }, [preferences, enablePersistence, storageKey]);

  /**
   * Berechnet die Übereinstimmung zwischen Benutzereinstellungen und einer Reiseroute
   * 
   * @param journey Die zu bewertende Reiseroute
   * @returns Bewertung zwischen 0 und 1, höhere Werte bedeuten bessere Übereinstimmung
   */
  const calculateMatchScore = useCallback((journey: Journey): number => {
    let score = 0;
    let possiblePoints = 0;

    // Reisetyp bewerten (z.B. solo, Paar, Familie)
    if (preferences.travelerType) {
      possiblePoints += 2;
      if (journey.matches.travelerType.includes(preferences.travelerType)) {
        score += 2;
      }
    }

    // Reiseziel bewerten
    if (preferences.destination) {
      possiblePoints += 2;
      if (journey.matches.destination === preferences.destination) {
        score += 2;
      }
    }

    // Gewünschte Erlebnisse bewerten (z.B. Abenteuer, Kultur, Kulinarik)
    if (preferences.experiences.length > 0) {
      // Jede Erfahrung ist ein möglicher Punkt
      possiblePoints += preferences.experiences.length;
      
      // Zählen, wie viele Erfahrungen übereinstimmen
      const matchingExperiences = preferences.experiences.filter(exp => 
        journey.matches.experiences.includes(exp)
      ).length;
      
      score += matchingExperiences;
    }

    // Unterkunftstyp bewerten
    if (preferences.accommodationType) {
      possiblePoints += 1;
      if (journey.matches.accommodationType.includes(preferences.accommodationType)) {
        score += 1;
      }
    }

    // Saisonalität bewerten
    if (preferences.seasonality) {
      possiblePoints += 1;
      if (journey.matches.seasonality.includes(preferences.seasonality)) {
        score += 1;
      }
    }

    // Normalisierte Bewertung zwischen 0 und 1 zurückgeben
    // Wenn keine möglichen Punkte, dann 0 zurückgeben
    return possiblePoints > 0 ? score / possiblePoints : 0;
  }, [preferences]);

  /**
   * Findet passende Reiserouten basierend auf den aktuellen Benutzereinstellungen
   */
  const findMatches = useCallback(() => {
    setIsLoading(true);

    // Simulierte Verzögerung für UX (optional)
    setTimeout(() => {
      try {
        // Bewertung und Sortierung aller verfügbaren Reiserouten
        const scoredJourneys = availableJourneys.map(journey => ({
          journey,
          score: calculateMatchScore(journey)
        }))
        .filter(item => item.score >= matchThreshold) // Nur Ergebnisse über dem Schwellenwert
        .sort((a, b) => b.score - a.score); // Nach Bewertung sortieren (höchste zuerst)

        setAllMatches(scoredJourneys);
        
        // Beste Übereinstimmung setzen (oder null, wenn keine gefunden)
        setMatchedJourney(scoredJourneys.length > 0 ? scoredJourneys[0].journey : null);
      } catch (error) {
        console.error('Fehler beim Finden passender Reiserouten:', error);
        setAllMatches([]);
        setMatchedJourney(null);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms Verzögerung für bessere UX
  }, [availableJourneys, calculateMatchScore, matchThreshold]);

  /**
   * Aktualisiert eine bestimmte Einstellung
   */
  const updatePreference = useCallback(<K extends keyof TravelPreferences>(
    key: K, 
    value: TravelPreferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  /**
   * Setzt alle Einstellungen auf die Standardwerte zurück
   */
  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    setMatchedJourney(null);
    setAllMatches([]);
  }, []);

  // Automatische Aktualisierung der Übereinstimmungen, wenn sich Einstellungen ändern
  // und genügend Einstellungen für eine sinnvolle Suche vorliegen
  useEffect(() => {
    const hasMinimumPreferences = 
      preferences.travelerType !== null || 
      preferences.destination !== null || 
      preferences.experiences.length > 0;
    
    if (hasMinimumPreferences && availableJourneys.length > 0) {
      findMatches();
    }
  }, [preferences, availableJourneys, findMatches]);

  // Rückgabewerte des Hooks
  return {
    preferences,
    updatePreference,
    resetPreferences,
    matchedJourney,
    allMatches,
    isLoading,
    findMatches
  };
}

export default useTravelPlanner;