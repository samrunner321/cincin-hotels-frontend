'use client';

import { useUIState as useUIStateOriginal } from '../components/UIStateContext';

/**
 * useUIState ist ein Hook für den Zugriff auf die UI-Zustandsinformationen
 * Dieser Hook re-exportiert den ursprünglichen useUIState-Hook aus UIStateContext
 * für bessere Auffindbarkeit und Organisation im Hooks-Verzeichnis
 */
export function useUIState() {
  return useUIStateOriginal();
}

export default useUIState;