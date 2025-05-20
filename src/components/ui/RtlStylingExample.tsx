'use client';

import React from 'react';
import { useEnhancedTranslations } from '../i18n/EnhancedTranslationsProvider';
import styles from './RtlStyling.module.css';

export default function RtlStylingExample() {
  const { translate, direction, isRtl } = useEnhancedTranslations();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">RTL-Styling-Beispiele mit CSS-Modulen</h2>

      {/* Logische Eigenschaften */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Logische Eigenschaften</h3>
        <div className={`${styles.container} bg-gray-100 p-4 rounded`}>
          <p>Dieser Container verwendet logische Eigenschaften für Margin und Padding.</p>
          <p>Direction: {direction}</p>
        </div>
      </section>

      {/* Text-Ausrichtung */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Text-Ausrichtung</h3>
        <div className={`${styles.alignedText} bg-blue-50 p-4 rounded`}>
          <p>Dieser Text ist ausgerichtet und hat eine Grenzlinie auf der Startseite.</p>
        </div>
      </section>

      {/* Flex-Layout */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Flex-Layout</h3>
        <div className={`${styles.flexContainer} flex bg-green-50 p-4 rounded`}>
          <div className="bg-green-200 p-3 rounded">Element 1</div>
          <div className="bg-green-300 p-3 rounded mx-2">Element 2</div>
          <div className="bg-green-400 p-3 rounded">Element 3</div>
        </div>
      </section>

      {/* Icon-Rotation */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Icon-Rotation</h3>
        <div className="p-4 bg-yellow-50 rounded flex items-center">
          <svg 
            className={`${styles.arrowIcon} w-6 h-6 mr-2`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <span>Dieser Pfeil dreht sich basierend auf der Textrichtung.</span>
        </div>
      </section>

      {/* Grid-Layout */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Grid-Layout</h3>
        <div className={`${styles.gridContainer} bg-purple-50 p-4 rounded gap-4`}>
          <div className="bg-purple-200 p-3 rounded">Element 1</div>
          <div className="bg-purple-300 p-3 rounded">Element 2</div>
          <div className="bg-purple-400 p-3 rounded">Element 3</div>
        </div>
      </section>

      {/* Abgerundete Ecken */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Abgerundete Ecken</h3>
        <div className={`${styles.cornerElement} bg-red-200 p-4 border-2 border-red-400`}>
          Dieses Element hat abgerundete Ecken, die sich basierend auf der Textrichtung ändern.
        </div>
      </section>

      {/* Positionierung */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Positionierung</h3>
        <div className="bg-gray-200 p-4 h-20 rounded relative">
          <div className={`${styles.positionedElement} absolute bg-pink-500 text-white p-2 rounded`}>
            Positioniertes Element
          </div>
        </div>
      </section>

      {/* Box-Shadow */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Box-Shadow</h3>
        <div className={`${styles.shadowElement} bg-teal-100 p-4 rounded`}>
          Dieses Element hat einen gerichteten Schatten.
        </div>
      </section>

      {/* Animation */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Animation</h3>
        <div className={`${styles.animatedElement} bg-indigo-100 p-4 rounded`}>
          Dieses Element wird basierend auf der Textrichtung animiert.
        </div>
      </section>
    </div>
  );
}