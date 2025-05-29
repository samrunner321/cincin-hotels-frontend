'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-cluster/lib/assets/MarkerCluster.css';
import 'react-leaflet-cluster/lib/assets/MarkerCluster.Default.css';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const MarkerClusterGroup = dynamic(
  () => import('react-leaflet-cluster'),
  { ssr: false }
);

export default function WorldMapSection({
  title = "Explore Our World.",
  subtitle = "Enjoy a handpicked portfolio of one-of-a-kind properties across the globe",
  regions = []
}) {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [L, setL] = useState(null);

  useEffect(() => {
    // Load Leaflet only on client side
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
      // Fix for default marker icons in Leaflet
      delete leaflet.default.Icon.Default.prototype._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      });
    });
  }, []);

  useEffect(() => {
    // Flatten all hotels from regions
    const allHotels = regions.flatMap(region => 
      (region.hotels || []).map(hotel => ({
        ...hotel,
        regionName: region.name
      }))
    );
    setHotels(allHotels);
  }, [regions]);

  if (!L) {
    return (
      <section className="py-16" style={{ backgroundColor: "#f1f3ee" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-normal mb-3">{title}</h2>
            <p className="text-gray-700 mb-8 text-sm">{subtitle}</p>
            <div className="h-[450px] bg-gray-200 animate-pulse rounded-lg" />
          </div>
        </div>
      </section>
    );
  }

  // Create custom icon
  const createCustomIcon = (count) => {
    return L.divIcon({
      html: `<div class="custom-marker">
        <div class="marker-count">${count || 1}</div>
      </div>`,
      className: 'custom-div-icon',
      iconSize: [35, 45],
      iconAnchor: [17, 45],
      popupAnchor: [0, -45]
    });
  };

  return (
    <section className="py-16" style={{ backgroundColor: "#f1f3ee" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          <div className="md:col-span-3 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-normal mb-3">{title}</h2>
            <p className="text-gray-700 mb-4 text-sm">{subtitle}</p>
            <Link 
              href="/hotels"
              className="inline-block px-6 py-2 border border-black text-black rounded-md hover:bg-black hover:text-white transition-colors text-sm w-fit"
            >
              All Hotels
            </Link>
            
            {/* Region list */}
            <div className="mt-6 space-y-2">
              {regions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegion(region)}
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors flex justify-between items-center group"
                >
                  <span className="text-sm">{region.name}</span>
                  <span className="text-xs text-gray-500 group-hover:text-gray-700">{region.count} hotels</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-9 relative">
            <div className="h-[450px] rounded-lg overflow-hidden shadow-lg">
              <MapContainer
                center={[46.8182, 8.2275]} // Center on Europe
                zoom={4}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                
                {/* Add marker cluster group */}
                <MarkerClusterGroup
                  chunkedLoading
                  iconCreateFunction={(cluster) => {
                    const count = cluster.getChildCount();
                    return L.divIcon({
                      html: `<div class="cluster-marker">
                        <div class="cluster-count">${count}</div>
                      </div>`,
                      className: 'custom-cluster-icon',
                      iconSize: [40, 40],
                      iconAnchor: [20, 20]
                    });
                  }}
                >
                  {/* Add markers for each hotel */}
                  {hotels.map((hotel) => {
                    // Skip hotels without coordinates
                    if (!hotel.latitude || !hotel.longitude) return null;
                    
                    return (
                      <Marker
                        key={hotel.id}
                        position={[hotel.latitude, hotel.longitude]}
                        icon={createCustomIcon(1)}
                      >
                        <Popup>
                          <div className="p-2 min-w-[200px]">
                            <h4 className="font-semibold text-sm mb-1">{hotel.name}</h4>
                            <p className="text-xs text-gray-600 mb-1">{hotel.location}</p>
                            <p className="text-xs text-gray-500 mb-2">{hotel.regionName}</p>
                            <Link 
                              href={`/hotels/${hotel.slug}`}
                              className="text-xs text-amber-600 hover:text-amber-700"
                            >
                              View hotel →
                            </Link>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MarkerClusterGroup>
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal for selected region */}
      {selectedRegion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedRegion(null)}>
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-semibold mb-2">{selectedRegion.name}</h3>
                <p className="text-gray-600">{selectedRegion.count} hotels available</p>
              </div>
              <button 
                onClick={() => setSelectedRegion(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            
            {selectedRegion.hotels && selectedRegion.hotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedRegion.hotels.map(hotel => (
                  <Link 
                    key={hotel.id}
                    href={`/hotels/${hotel.slug}`}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow block"
                  >
                    <h4 className="font-medium text-lg mb-1">{hotel.name}</h4>
                    <p className="text-sm text-gray-600 mb-1">{hotel.location}</p>
                    <p className="text-xs text-amber-600">View hotel →</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No hotels available in this region yet.</p>
            )}
            
            <div className="mt-6 pt-4 border-t flex justify-between">
              <Link 
                href="/hotels"
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                View all hotels
              </Link>
              <button 
                onClick={() => setSelectedRegion(null)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        .custom-div-icon {
          background: transparent;
          border: none;
        }
        
        .custom-marker {
          width: 35px;
          height: 45px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .custom-marker::before {
          content: '';
          position: absolute;
          width: 30px;
          height: 30px;
          background: #000;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          top: 0;
          left: 50%;
          margin-left: -15px;
        }
        
        .marker-count {
          position: relative;
          color: white;
          font-size: 14px;
          font-weight: bold;
          z-index: 1;
          margin-top: -8px;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
        
        .leaflet-popup-content {
          margin: 8px 12px;
        }
        
        .leaflet-container {
          font-family: inherit;
        }
        
        .custom-cluster-icon {
          background: transparent;
        }
        
        .cluster-marker {
          width: 40px;
          height: 40px;
          background: #f59e0b;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        
        .cluster-count {
          color: white;
          font-size: 16px;
          font-weight: bold;
        }
        
        /* Override Leaflet cluster styles */
        .marker-cluster-small {
          background-color: rgba(245, 158, 11, 0.6);
        }
        .marker-cluster-small div {
          background-color: #f59e0b;
        }
        .marker-cluster-medium {
          background-color: rgba(245, 158, 11, 0.6);
        }
        .marker-cluster-medium div {
          background-color: #f59e0b;
        }
        .marker-cluster-large {
          background-color: rgba(245, 158, 11, 0.6);
        }
        .marker-cluster-large div {
          background-color: #f59e0b;
        }
      `}</style>
    </section>
  );
}