'use client';

/**
 * TravelAdvisor Komponente
 * 
 * Ein Chatbot für Reiseberatung, der Benutzern interaktive Hilfe
 * bei der Suche nach Reisezielen und Hotels bietet.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useUIState } from '../UIStateContext';
import { useFeatureInteraction } from '../../hooks/useFeatureInteraction';
import { cn } from '../../lib/utils';
// Define needed types locally since we can't import from @types 
interface TravelAdvisorProps {
  initialMessage?: string;
  initialOpen?: boolean;
  isFloating?: boolean;
  assistantName?: string;
  avatarSrc?: string;
  initialSuggestions?: string[];
  responseGenerator?: (input: string) => Promise<string>;
  onNewMessage?: (message: ChatMessage) => void;
  onOpenChange?: (isOpen: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  animationVariant?: 'scale' | 'slide';
  animationDelay?: number;
  animationDuration?: number;
  animationsEnabled?: boolean;
  reducedMotion?: boolean;
}

interface SuggestionButtonProps {
  suggestion: string;
  onClick: (suggestion: string) => void;
  isPriority?: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  id?: string;
}

interface ChatBubbleProps {
  message: ChatMessage;
  timeFormatter?: (date: Date) => string;
}

/**
 * SuggestionButton Komponente
 * 
 * Button für Vorschläge im Chat
 */
const SuggestionButton: React.FC<SuggestionButtonProps> = ({ 
  suggestion, 
  onClick,
  isPriority = false
}) => {
  // Feature-Interaktion für den Button
  const { getFeatureProps, isHovered } = useFeatureInteraction({
    featureId: `suggestion-${suggestion}`,
    tooltip: {
      enabled: false
    },
    highlight: {
      enabled: true,
      effect: 'glow', // Changed from 'subtle' to valid value 'glow'
      duration: 300
    },
    onInteraction: (type) => {
      if (type === 'click') {
        onClick(suggestion);
      }
    }
  });

  // Fix type issues with ref by extracting props
  const featureProps = getFeatureProps();
  const { ref, ...restFeatureProps } = featureProps;

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      {...restFeatureProps}
      className={cn(
        "text-xs px-3 py-1.5 rounded-full transition-colors",
        isPriority 
          ? 'bg-brand-olive-100 text-brand-olive-800 hover:bg-brand-olive-200' 
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        isHovered && 'shadow-sm'
      )}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {suggestion}
    </motion.button>
  );
};

/**
 * ChatBubble Komponente
 * 
 * Einzelne Nachrichtenblase im Chat
 */
const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  message,
  timeFormatter = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isUser 
            ? 'bg-brand-olive-400 text-white rounded-tr-none' 
            : 'bg-white shadow-sm border border-gray-100 rounded-tl-none'
        )}
      >
        <p className="text-sm">{message.content}</p>
        <p className={cn(
          "text-[10px] mt-1 text-right",
          isUser ? 'text-white/70' : 'text-gray-400'
        )}>
          {timeFormatter(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

/**
 * TypingIndicator Komponente
 * 
 * Animierter Indikator für Schreibaktivität
 */
const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-white shadow-sm border border-gray-100 rounded-tl-none">
        <div className="flex space-x-1">
          <motion.div 
            className="w-2 h-2 rounded-full bg-gray-300"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          <motion.div 
            className="w-2 h-2 rounded-full bg-gray-300"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
          />
          <motion.div 
            className="w-2 h-2 rounded-full bg-gray-300"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * TravelAdvisor Hauptkomponente
 */
export const TravelAdvisor: React.FC<TravelAdvisorProps> = ({
  initialMessage = "👋 Hallo, ich bin Cinci, Ihr persönlicher Reiseberater. Ich kann Ihnen helfen, Reiseziele zu entdecken, Hotels zu empfehlen oder Ihre nächste Reise zu planen. Wie kann ich Ihnen heute helfen?",
  initialOpen = false,
  isFloating = true,
  assistantName = "Travel Advisor",
  avatarSrc = "/images/logo/logo-dark.png",
  initialSuggestions = [
    "Empfehlen Sie mir ein Bergziel",
    "Beste Hotels in den Schweizer Alpen?",
    "Familienfreundliche Strandresorts",
    "Ideen für einen romantischen Urlaub"
  ],
  responseGenerator,
  onNewMessage,
  onOpenChange,
  className = '',
  style,
  id,
  animationVariant = 'scale',
  animationDelay = 0,
  animationDuration = 300,
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
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: initialMessage,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>(initialSuggestions);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Feature-Interaktion für Chat-Toggle-Button
  const { getFeatureProps: getChatButtonProps } = useFeatureInteraction({
    featureId: 'travel-advisor-toggle',
    tooltip: {
      enabled: true,
      text: isOpen ? 'Chat schließen' : 'Reiseberater öffnen',
      position: 'left'
    },
    highlight: {
      enabled: true,
      effect: 'pulse',
      duration: 800
    },
    onInteraction: (type) => {
      if (type === 'click') {
        handleOpenChange(!isOpen);
      }
    }
  });

  // Zum Ende des Chats scrollen
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Input fokussieren wenn Chat geöffnet wird
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Öffnungsstatus ändern
  const handleOpenChange = (newIsOpen: boolean) => {
    setIsOpen(newIsOpen);
    if (onOpenChange) {
      onOpenChange(newIsOpen);
    }
  };

  // Nachricht senden
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Benutzernachricht hinzufügen
    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      id: `msg-${Date.now()}`
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Optional: Callback für neue Nachricht
    if (onNewMessage) {
      onNewMessage(userMessage);
    }

    // Antwort generieren - entweder mit übergebenem Generator oder Standard
    setTimeout(() => {
      if (responseGenerator) {
        responseGenerator(userMessage.content)
          .then(response => {
            addAssistantResponse(response);
          })
          .catch(error => {
            console.error('Fehler bei der Antwortgenerierung:', error);
            addAssistantResponse('Entschuldigung, ich konnte keine Antwort generieren. Bitte versuchen Sie es erneut.');
          })
          .finally(() => {
            setIsTyping(false);
          });
      } else {
        generateResponse(userMessage.content);
      }
    }, shouldAnimate ? 1000 : 0);
  };

  // Assistentenantwort hinzufügen
  const addAssistantResponse = (content: string) => {
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content,
      timestamp: new Date(),
      id: `msg-${Date.now()}`
    };

    setMessages(prev => [...prev, assistantMessage]);
    
    // Optional: Callback für neue Nachricht
    if (onNewMessage) {
      onNewMessage(assistantMessage);
    }
  };

  // Standard-Antwort generieren
  const generateResponse = (userInput: string) => {
    let response: string;
    const lowerInput = userInput.toLowerCase();
    
    // Einfache regelbasierte Antworten
    if (lowerInput.includes('berg') || lowerInput.includes('alpen')) {
      response = "Die Alpen sind zu jeder Jahreszeit spektakulär! Für Sommerwanderungen empfehle ich Crans-Montana in der Schweiz - es bietet atemberaubende Ausblicke, ausgezeichnete Wanderwege und luxuriöse Unterkünfte wie das Chetzeron Hotel, das auf 2.112 m mit Panoramablick liegt. Möchten Sie mehr über Bergdestinationen erfahren?";
    } 
    else if (lowerInput.includes('strand') || lowerInput.includes('meer')) {
      response = "Für Stranddestinationen bietet die Amalfiküste in Italien eine perfekte Mischung aus atemberaubenden Küsten, charmanten Dörfern und exquisiter Küche. Santorini in Griechenland ist ein weiteres Juwel mit seinen ikonischen weißgetünchten Gebäuden und kristallklarem Wasser. Kann ich Ihnen helfen, spezifische Strandunterkünfte in unserer Kollektion zu erkunden?";
    }
    else if (lowerInput.includes('familie') || lowerInput.includes('kind')) {
      response = "Für Familien empfehle ich unsere Unterkünfte in Südtirol, Italien. Sie bieten geräumige Unterkünfte, kinderfreundliche Aktivitäten und sind von Natur umgeben. Viele haben spezielle Kinderprogramme und Familienzimmer. Möchten Sie, dass ich Ihnen bestimmte familienfreundliche Hotels vorschlage?";
    }
    else if (lowerInput.includes('romantisch') || lowerInput.includes('paar') || lowerInput.includes('flitterwochen')) {
      response = "Für einen romantischen Urlaub bieten die kleinen Boutique-Hotels in Santorini private Terrassen mit atemberaubendem Blick auf die Caldera. In den Schweizer Alpen verfügt das LeCrans Hotel & Spa über intime Suiten mit Kaminen und Panoramablick auf die Berge. Möchten Sie weitere romantische Reiseziel-Ideen?";
    }
    else if (lowerInput.includes('hallo') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      response = "Hallo! Ich freue mich, Ihnen bei Ihrer Reiseplanung zu helfen. Suchen Sie nach einem bestimmten Reiseziel oder einer bestimmten Art von Erlebnis?";
    }
    else if (lowerInput.includes('danke')) {
      response = "Sehr gerne! Ich helfe Ihnen jederzeit bei Ihrer Reiseplanung. Gibt es noch etwas, das Sie über unsere Reiseziele oder Hotels wissen möchten?";
    }
    else if (lowerInput.includes('essen') || lowerInput.includes('restaurant') || lowerInput.includes('kulinarisch')) {
      response = "Für kulinarische Erlebnisse bietet Südtirol eine unglaubliche Mischung aus italienischer und alpiner Küche mit zahlreichen Michelin-Sternen-Restaurants. Paris ist immer eine klassische Wahl für Feinschmecker. Viele unserer Häuser bieten außergewöhnliche Restauranterlebnisse - möchten Sie Empfehlungen für Hotels mit herausragenden Restaurants?";
    }
    else {
      response = "Das ist eine ausgezeichnete Frage zu " + userInput.split(' ').slice(0,3).join(' ') + "... Unsere Kollektion umfasst einzigartige Unterkünfte an den schönsten Reisezielen Europas. Möchten Sie, dass ich Ihnen einige Optionen basierend auf Ihren Interessen vorschlage? Oder erzählen Sie mir vielleicht, nach welcher Art von Erlebnis Sie suchen.";
    }

    // Neue Vorschläge basierend auf dem Gesprächsverlauf erstellen
    updateSuggestions(lowerInput);

    // Assistentenantwort hinzufügen
    addAssistantResponse(response);
    setIsTyping(false);
  };

  // Vorschläge basierend auf Kontext aktualisieren
  const updateSuggestions = (userInput: string) => {
    let newSuggestions: string[] = [];
    
    if (userInput.includes('berg') || userInput.includes('alpen')) {
      newSuggestions = [
        "Erzählen Sie mir von Luxus-Berghotels",
        "Beste Reisezeit für die Alpen?",
        "Skiresorts in Ihrer Kollektion",
        "Bergaktivitäten im Sommer"
      ];
    } 
    else if (userInput.includes('strand') || userInput.includes('meer')) {
      newSuggestions = [
        "Zeigen Sie mir mediterrane Boutique-Hotels",
        "Beste italienische Küstenstädte",
        "Strandziele für den Herbst",
        "Griechische Inseln in Ihrer Kollektion"
      ];
    }
    else if (userInput.includes('familie')) {
      newSuggestions = [
        "Hotels mit Kinderaktivitäten",
        "Verfügbarkeit von Familienzimmern",
        "Kinderfreundliche Restaurants",
        "Familienausflüge in Südtirol"
      ];
    }
    else if (userInput.includes('essen') || userInput.includes('restaurant')) {
      newSuggestions = [
        "Hotels mit Michelin-Sternen-Restaurants",
        "Kulinarische Reiseziele in Europa",
        "Weinregionen zum Besuchen",
        "Kochkurse in Ihren Hotels"
      ];
    }
    else {
      newSuggestions = [
        "Einzigartige Hotelerlebnisse",
        "Saisonale Reiseempfehlungen",
        "Hotels mit außergewöhnlichem Ausblick",
        "Wellness- und Spa-Destinationen"
      ];
    }
    
    setSuggestions(newSuggestions);
  };

  // Tastaturhandler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Handler für Vorschlag-Klick
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  // Zeit für Nachrichten formatieren
  const formatTime = useCallback((date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  return (
    <>
      {/* Chat-Button */}
      {isFloating && (
        <motion.button
          {...(() => {
            const props = getChatButtonProps();
            const { ref, ...rest } = props;
            return { ref: ref as React.RefObject<HTMLButtonElement>, ...rest };
          })()}
          className="fixed bottom-6 right-6 z-40 bg-brand-olive-400 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-brand-olive-500 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isOpen ? "Chat schließen" : "Reiseberater öffnen"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}
        </motion.button>
      )}

      {/* Chat-Fenster */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              "fixed bottom-24 right-6 z-40 w-[90vw] sm:w-[400px] max-w-lg h-[70vh] max-h-[600px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200",
              className
            )}
            style={style}
            id={id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Travel Advisor Chat"
          >
            {/* Chat-Header */}
            <div className="p-4 bg-brand-olive-400 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <Image
                    src={avatarSrc}
                    alt={assistantName}
                    width={20}
                    height={20}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{assistantName}</h3>
                  <p className="text-xs text-white/80">CinCin Hotels AI Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => handleOpenChange(false)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Chat schließen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat-Nachrichten */}
            <div 
              className="flex-1 overflow-y-auto p-4 bg-gray-50"
              role="log"
              aria-live="polite"
              aria-label="Chatverlauf"
            >
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <ChatBubble 
                    key={message.id || index}
                    message={message}
                    timeFormatter={formatTime}
                  />
                ))}
                
                {/* Schreib-Indikator */}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Vorschläge */}
            {suggestions.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-100 bg-white">
                <p className="text-xs text-gray-500 mb-2">Vorgeschlagene Fragen:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <SuggestionButton
                      key={index}
                      suggestion={suggestion}
                      onClick={handleSuggestionClick}
                      isPriority={index === 0}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Chat-Eingabe */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Schreiben Sie Ihre Nachricht..."
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-olive-400/50 text-sm"
                  aria-label="Nachrichtentext"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  className="bg-brand-olive-400 text-white p-2.5 rounded-full disabled:opacity-50"
                  disabled={!inputValue.trim()}
                  aria-label="Nachricht senden"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-2">
                Powered by AI • CinCin Hotels Travel Assistant
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TravelAdvisor;