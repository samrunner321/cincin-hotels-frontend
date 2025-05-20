/**
 * useAnimationSequence Hook
 * 
 * Ein spezialisierter Hook für komplexe Animationssequenzen mit Framer Motion.
 * Ermöglicht die Definition und Steuerung von mehrstufigen Animationen
 * mit kontrollierbarem Timing und Übergängen.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAnimation, AnimationControls } from 'framer-motion';
import { useUIState } from '../components/UIStateContext';
import type { UseAnimationSequenceProps, UseAnimationSequenceReturn } from '../types/advanced-ui';

/**
 * useAnimationSequence Hook
 * 
 * @param props Hook-Konfiguration
 * @returns Zustände und Funktionen zur Steuerung der Animationssequenz
 * 
 * @example
 * const {
 *   state,
 *   play,
 *   pause,
 *   reset,
 *   goToStep,
 *   currentStep,
 *   controls,
 *   isReducedMotion
 * } = useAnimationSequence({
 *   steps: [
 *     {
 *       target: 'header',
 *       variants: { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } },
 *       transition: { duration: 0.5 }
 *     },
 *     {
 *       target: 'content',
 *       variants: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
 *       transition: { duration: 0.3, delay: 0.2 }
 *     }
 *   ],
 *   autoPlay: true
 * });
 */
export function useAnimationSequence(props: UseAnimationSequenceProps): UseAnimationSequenceReturn {
  const {
    steps = [],
    autoPlay = false,
    loop = false,
    direction = 'forward',
    durationMultiplier = 1,
    respectReducedMotion = true
  } = props;

  // UI-State-Kontext für Animation-Präferenzen des Benutzers
  const { state: uiState } = useUIState();
  const isReducedMotion = respectReducedMotion && uiState.theme.reducedMotion;

  // Animationszustände
  const [state, setState] = useState<'idle' | 'playing' | 'paused' | 'completed'>('idle');
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // Animationssteuerung für jedes Ziel erstellen
  const controlsRef = useRef<Record<string, AnimationControls>>({});

  // Initialisiere Steuerung für jedes Ziel
  useEffect(() => {
    const targets = steps.map(step => step.target);
    const uniqueTargetsSet = new Set(targets);
    const uniqueTargets = Array.from(uniqueTargetsSet);
    
    uniqueTargets.forEach(target => {
      if (!controlsRef.current[target]) {
        controlsRef.current[target] = useAnimation();
      }
    });
  }, [steps]);

  // Timer für sequenzielle Animationen
  const timerRef = useRef<number | null>(null);

  // Berechne Gesamtdauer für einen Animationsschritt
  const getStepDuration = useCallback((stepIndex: number): number => {
    if (stepIndex >= steps.length) return 0;
    
    const step = steps[stepIndex];
    const baseDuration = step.transition?.duration || 0.3;
    const delay = step.transition?.delay || 0;
    
    return (baseDuration + delay) * durationMultiplier * 1000; // in ms umrechnen
  }, [steps, durationMultiplier]);

  // Führe einen einzelnen Animationsschritt aus
  const animateStep = useCallback((stepIndex: number) => {
    if (stepIndex >= steps.length) {
      setState('completed');
      if (loop && steps.length > 0) {
        // Bei Loop zurück zum Anfang oder Ende (je nach Richtung)
        setCurrentStep(direction === 'forward' ? 0 : steps.length - 1);
        // Kurze Pause vor dem Neustart
        timerRef.current = window.setTimeout(() => {
          play();
        }, 500);
      }
      return;
    }

    const step = steps[stepIndex];
    const controls = controlsRef.current[step.target];
    
    if (controls) {
      const variant = direction === 'forward' ? 'visible' : 'hidden';
      
      // Animation ausführen
      controls.start(variant, {
        ...step.transition,
        duration: step.transition?.duration ? step.transition.duration * durationMultiplier : undefined,
      });
      
      // Nächsten Schritt planen
      const duration = getStepDuration(stepIndex);
      
      timerRef.current = window.setTimeout(() => {
        const nextStep = direction === 'forward' ? stepIndex + 1 : stepIndex - 1;
        setCurrentStep(nextStep);
        
        if (nextStep >= 0 && nextStep < steps.length) {
          animateStep(nextStep);
        } else {
          setState('completed');
          if (loop && steps.length > 0) {
            // Bei Loop zurück zum Anfang oder Ende (je nach Richtung)
            setCurrentStep(direction === 'forward' ? 0 : steps.length - 1);
            // Kurze Pause vor dem Neustart
            timerRef.current = window.setTimeout(() => {
              play();
            }, 500);
          }
        }
      }, duration);
    }
  }, [steps, direction, loop, durationMultiplier, getStepDuration]);

  // Animationssequenz starten
  const play = useCallback(() => {
    // Aufräumen, falls noch ein Timer läuft
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Bei reduzierter Bewegung alle Elemente direkt auf ihren Zielzustand setzen
    if (isReducedMotion) {
      steps.forEach(step => {
        const controls = controlsRef.current[step.target];
        if (controls) {
          controls.set(direction === 'forward' ? 'visible' : 'hidden');
        }
      });
      setState('completed');
      return;
    }

    setState('playing');
    animateStep(currentStep);
  }, [animateStep, currentStep, direction, isReducedMotion, steps]);

  // Animationssequenz pausieren
  const pause = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Alle laufenden Animationen pausieren
    Object.values(controlsRef.current).forEach(controls => {
      controls.stop();
    });
    
    setState('paused');
  }, []);

  // Animationssequenz zurücksetzen
  const reset = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Alle Ziele auf den Anfangszustand zurücksetzen
    steps.forEach(step => {
      const controls = controlsRef.current[step.target];
      if (controls) {
        controls.set(direction === 'forward' ? 'hidden' : 'visible');
      }
    });
    
    setCurrentStep(direction === 'forward' ? 0 : steps.length - 1);
    setState('idle');
  }, [steps, direction]);

  // Zu einem bestimmten Schritt springen
  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= steps.length) return;
    
    // Aufräumen, falls noch ein Timer läuft
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Vorherige Schritte auf visible setzen, nachfolgende auf hidden
    steps.forEach((step, index) => {
      const controls = controlsRef.current[step.target];
      if (controls) {
        if (direction === 'forward') {
          if (index < stepIndex) {
            controls.set('visible');
          } else if (index > stepIndex) {
            controls.set('hidden');
          }
        } else {
          if (index > stepIndex) {
            controls.set('visible');
          } else if (index < stepIndex) {
            controls.set('hidden');
          }
        }
      }
    });
    
    setCurrentStep(stepIndex);
    setState('paused');
  }, [steps, direction]);

  // Aufräumen bei Unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Automatischer Start, wenn autoPlay gesetzt ist
  useEffect(() => {
    if (autoPlay && state === 'idle' && steps.length > 0) {
      play();
    }
  }, [autoPlay, play, state, steps.length]);

  // Hook-Rückgabewerte
  return {
    state,
    play,
    pause,
    reset,
    goToStep,
    currentStep,
    controls: controlsRef.current,
    isReducedMotion
  };
}

export default useAnimationSequence;