'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

// Custom Icon für Restaurants
const createRestaurantIcon = (isSelected = false) => {
  return L.divIcon({
    html: `
      <div class="${isSelected ? 'animate-bounce' : ''}">
        <div class="relative">
          <div class="absolute -inset-1 bg-brand-olive-400 rounded-full opacity-25 ${isSelected ? 'animate-pulse' : ''}"></div>
          <div class="relative bg-white rounded-full p-2 shadow-lg border-2 ${isSelected ? 'border-brand-olive-400' : 'border-gray-300'}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3h18v18H3V3z" stroke="#93A27F" stroke-width="2" fill="none"/>
              <path d="M8 12h8M12 8v8" stroke="#93A27F" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="12" r="3" fill="#93A27F"/>
            </svg>
          </div>
        </div>
      </div>
    `,
    className: 'custom-restaurant-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

// Component to update map view when filters change
function ChangeView({ restaurants, selectedRestaurant }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedRestaurant) {
      // Zoom to selected restaurant
      map.setView(
        [selectedRestaurant.location.lat, selectedRestaurant.location.lng], 
        16, 
        { animate: true, duration: 1 }
      );
    } else if (restaurants.length > 0) {
      // Fit all restaurants in view
      const bounds = L.latLngBounds(
        restaurants.map(r => [r.location.lat, r.location.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  }, [restaurants, selectedRestaurant, map]);
  
  return null;
}

export default function DiningMap({ restaurants, selectedRestaurant, onRestaurantClick }) {
  // Default center (will be overridden by ChangeView)
  const defaultCenter = [37.4456, 25.3278];
  
  return (
    <div className="h-full w-full relative">
      <MapContainer 
        center={defaultCenter} 
        zoom={14} 
        className="h-full w-full rounded-2xl"
        style={{ height: '100%', width: '100%', minHeight: '500px' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        <ChangeView 
          restaurants={restaurants} 
          selectedRestaurant={selectedRestaurant} 
        />
        
        {restaurants.map(restaurant => {
          const isSelected = selectedRestaurant?.id === restaurant.id;
          
          return (
            <Marker 
              key={restaurant.id}
              position={[restaurant.location.lat, restaurant.location.lng]}
              icon={createRestaurantIcon(isSelected)}
              eventHandlers={{
                click: () => onRestaurantClick?.(restaurant)
              }}
            >
              <Popup>
                <div className="p-3 min-w-[250px] font-brooklyn">
                  <h3 className="font-bold text-lg mb-1 text-gray-900">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{restaurant.cuisine}</p>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium">{restaurant.price}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium">{restaurant.rating}</span>
                    </div>
                  </div>
                  
                  {restaurant.mustTry && (
                    <div className="border-t pt-2">
                      <p className="text-xs text-gray-700">
                        <span className="font-semibold">Must try:</span> {restaurant.mustTry}
                      </p>
                    </div>
                  )}
                  
                  {restaurant.description && (
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                      {restaurant.description}
                    </p>
                  )}
                  
                  <button 
                    className="mt-3 w-full bg-brand-olive-400 text-white text-sm py-2 px-4 rounded-lg hover:bg-brand-olive-600 transition-colors"
                    onClick={() => onRestaurantClick?.(restaurant)}
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Legend</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-brand-olive-400 rounded-full"></div>
            <span className="text-xs text-gray-600">Selected Restaurant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span className="text-xs text-gray-600">Available Restaurants</span>
          </div>
        </div>
      </div>
    </div>
  );
}