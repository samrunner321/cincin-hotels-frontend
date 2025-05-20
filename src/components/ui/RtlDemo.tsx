'use client';

import React from 'react';
import { useEnhancedTranslations } from '../i18n/EnhancedTranslationsProvider';
import useRtl from '../../hooks/useRtl';
import { rtlFlipClasses, getRtlStyles } from '../../utils/rtl-utils';

interface RtlDemoProps {
  title?: string;
}

export default function RtlDemo({ title = 'RTL-Unterstützung Demo' }: RtlDemoProps) {
  const { translate, language, direction, isRtl } = useEnhancedTranslations();
  const { 
    getFlexDirection, 
    getTextAlign, 
    getSideProperty, 
    getOrderedArray,
    flip,
    getIconRotation
  } = useRtl();

  // Beispiel-Items für Demonstration der Reihenfolge
  const items = ['Erstes Element', 'Zweites Element', 'Drittes Element'];
  const orderedItems = getOrderedArray(items);

  // Beispiel für Tailwind-Klassen mit RTL-Unterstützung
  const containerClasses = rtlFlipClasses('flex flex-row pl-4 pr-8 text-left', isRtl);

  // Beispiel für React-Styles mit RTL-Unterstützung
  const customStyles = getRtlStyles(isRtl, {
    paddingLeft: '1rem',
    marginRight: '2rem',
    textAlign: 'left'
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      
      <div className="space-y-6">
        {/* Grundlegende Informationen */}
        <div className="p-4 bg-gray-100 rounded">
          <p><strong>Aktuelle Sprache:</strong> {language}</p>
          <p><strong>Textrichtung:</strong> {direction}</p>
          <p><strong>RTL-Modus aktiv:</strong> {isRtl ? 'Ja' : 'Nein'}</p>
        </div>

        {/* Demonstration der Flex-Direction */}
        <div 
          className="p-4 bg-blue-100 rounded"
          style={{ display: 'flex', flexDirection: getFlexDirection('row') }}
        >
          <div className="bg-blue-500 text-white p-2 rounded">Element 1</div>
          <div className="bg-blue-600 text-white p-2 rounded mx-2">Element 2</div>
          <div className="bg-blue-700 text-white p-2 rounded">Element 3</div>
        </div>

        {/* Demonstration der Textausrichtung */}
        <div className="p-4 bg-green-100 rounded">
          <p style={{ textAlign: getTextAlign('left') }}>
            Dieser Text ist standardmäßig links ausgerichtet (wird in RTL rechts ausgerichtet).
          </p>
          <p style={{ textAlign: getTextAlign('right') }} className="mt-2">
            Dieser Text ist standardmäßig rechts ausgerichtet (wird in RTL links ausgerichtet).
          </p>
          <p style={{ textAlign: getTextAlign('center') }} className="mt-2">
            Dieser Text ist zentriert (bleibt in RTL zentriert).
          </p>
        </div>

        {/* Demonstration der logischen Eigenschaften */}
        <div className="p-4 bg-yellow-100 rounded">
          <div style={{
            ...getSideProperty('margin', 'start', '20px'),
            ...getSideProperty('padding', 'end', '30px'),
            backgroundColor: 'yellow',
            padding: '10px'
          }}>
            Dieses Element hat einen logischen Margin-Start und Padding-End.
          </div>
        </div>

        {/* Demonstration der Array-Reihenfolge */}
        <div className="p-4 bg-purple-100 rounded">
          <h3 className="font-bold mb-2">Array-Reihenfolge:</h3>
          <ul className="list-disc list-inside">
            {orderedItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Demonstration der Richtungskonvertierung */}
        <div className="p-4 bg-red-100 rounded">
          <p>In LTR wäre 'links' zu 'rechts' geflippt: {flip('left')}</p>
          <p className="mt-2">
            In LTR wäre ein 90° Winkel geflippt zu: {getIconRotation(90)}°
          </p>
        </div>

        {/* Demonstration der Tailwind-Klassen */}
        <div className={containerClasses}>
          <div className="bg-teal-500 text-white p-2 rounded">
            Diese Box verwendet RTL-angepasste Tailwind-Klassen.
          </div>
        </div>

        {/* Demonstration der React-Styles */}
        <div style={customStyles} className="bg-pink-200 rounded p-2">
          Diese Box verwendet RTL-angepasste React-Styles.
        </div>
      </div>
    </div>
  );
}