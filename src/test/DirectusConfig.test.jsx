/**
 * Tests für die DirectusConfig-Komponente
 * Diese Tests verwenden React Testing Library und Jest.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DirectusConfig from '../components/common/DirectusConfig';
import { createDirectus } from '@directus/sdk';
import * as authUtils from '../lib/auth-utils';

// Mocks
jest.mock('@directus/sdk', () => ({
  createDirectus: jest.fn(() => ({
    with: jest.fn(() => ({
      with: jest.fn(() => ({
        request: jest.fn()
      }))
    }))
  })),
  rest: {
    get: jest.fn()
  },
  staticToken: jest.fn()
}));

jest.mock('../../lib/auth-utils', () => ({
  getDirectusPublicToken: jest.fn(() => 'mock-token')
}));

describe('DirectusConfig Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  test('Komponente rendert ohne sichtbares UI', () => {
    render(<DirectusConfig />);
    
    // Die Komponente sollte sich in einem versteckten Div befinden
    const hiddenDiv = document.querySelector('div.hidden');
    expect(hiddenDiv).toBeInTheDocument();
  });

  test('API-Verbindung wird beim Laden überprüft', async () => {
    // Mock für eine erfolgreiche API-Verbindung
    const mockRequestFn = jest.fn().mockResolvedValue({ version: '1.0.0' });
    
    createDirectus.mockImplementation(() => ({
      with: jest.fn(() => ({
        with: jest.fn(() => ({
          request: mockRequestFn
        }))
      }))
    }));
    
    render(<DirectusConfig />);
    
    // Prüfen, ob auth-utils verwendet wird
    expect(authUtils.getDirectusPublicToken).toHaveBeenCalled();
    
    // Warten auf den API-Aufruf und Erfolgslog
    await waitFor(() => {
      expect(mockRequestFn).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Directus connection successful'),
        expect.anything()
      );
    });
  });

  test('Fehlerbehandlung funktioniert korrekt', async () => {
    // Mock für einen API-Fehler
    const mockError = new Error('Connection failed');
    const mockRequestFn = jest.fn().mockRejectedValue(mockError);
    
    createDirectus.mockImplementation(() => ({
      with: jest.fn(() => ({
        with: jest.fn(() => ({
          request: mockRequestFn
        }))
      }))
    }));
    
    render(<DirectusConfig />);
    
    // Warten auf den API-Fehler
    await waitFor(() => {
      expect(mockRequestFn).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Directus connection failed'),
        expect.anything()
      );
    });
  });

  test('onStatusChange-Callback wird aufgerufen', async () => {
    // Mock für einen erfolgreichen API-Aufruf
    const mockRequestFn = jest.fn().mockResolvedValue({ version: '1.0.0' });
    
    createDirectus.mockImplementation(() => ({
      with: jest.fn(() => ({
        with: jest.fn(() => ({
          request: mockRequestFn
        }))
      }))
    }));
    
    // Mock für den onStatusChange-Callback
    const mockCallback = jest.fn();
    
    render(<DirectusConfig onStatusChange={mockCallback} />);
    
    // Prüfen, ob der Callback aufgerufen wird
    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledWith('connected');
    });
  });
});