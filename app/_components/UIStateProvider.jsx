'use client';

import React from 'react';
import { UIStateProvider as Provider } from '../../src/components/UIStateContext';

/**
 * UIStateProvider Wrapper
 * 
 * Bietet den UI-Status für die gesamte Anwendung
 */
export default function UIStateProvider({ children }) {
  return (
    <Provider>
      {children}
    </Provider>
  );
}