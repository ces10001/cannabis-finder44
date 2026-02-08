'use client';

import { useEffect, useRef, useState } from 'react';
import { Dispensary } from '@/lib/demo-data';

interface MapViewProps {
  dispensaries: Dispensary[];
  onPolygonChange: (polygon: [number, number][] | null) => void;
  selectedId?: string;
  onSelectDispensary: (id: string) => void;
  userLocation: [number, number] | null;
}

export function MapView({
  dispensaries,
  onPolygonChange,
  selectedId,
  onSelectDispensary,
  userLocation,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const drawnItemsRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    let L: any;
    
    const initMap = async () => {
      // Dynamic import Leaflet only on client
      L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      await import('leaflet-draw');
      await import('leaflet-draw/dist/leaflet.draw.css');

      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      if (!mapContainer.current || mapRef.current) return;

      const centerLng = userLocation ? userLocation[1] : -122.4194;
      const centerLat = userLocation ? userLocation[0] : 37.7749;

      // Initialize map
      mapRef.current = L.map(mapContainer.current).setView([centerLat, centerLng], 12);

      // Add dark tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapRef.current);

      // Initialize drawing controls
      drawnItemsRef.current = new L.FeatureGroup();
      mapRef.current.addLayer(drawnItemsRef.current);

      const drawControl = new L.Control.Draw({
        position: 'topleft',
        draw: {
          polygon: {
            allowIntersection: false,
            shapeOptions: {
              color: '#22c55e',
              fillColor: '#22c55e',
              fillOpacity: 0.2,
              weight: 3,
            }
          },
          polyline: false,
          circle: false,
          circlemarker: false,
          marker: false,
          rectangle: false,
        },
        edit: {
          featureGroup: drawnItemsRef.current,
          remove: true,
        }
      });

      mapRef.current.addControl(drawControl);

      // Drawing event handlers
      mapRef.current.on(L.Draw.Event.CREATED, (e: any) => {
        const layer = e.layer;
        drawnItemsRef.current?.clearLayers();
        drawnItemsRef.current?.addLayer(layer);
        
        const latLngs = layer.getLatLngs()[0];
        const polygon = latLngs.map((latLng: any) => [latLng.lng, latLng.lat] as [number, number]);
        onPolygonChange(polygon);
      });

      mapRef.current.on(L.Draw.Event.DELETED, () => {
        onPolygonChange(null);
      });

      // Add user location marker
      if (userLocation) {
        const blueIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        L.marker([userLocation[0], userLocation[1]], { icon: blueIcon })
          .addTo(mapRef.current)
          .bindPopup('<div class="text-sm font-semibold text-white">Your Location</div>');
      }

      setMapLoaded(true);
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [userLocation, onPolygonChange]);

  // Update markers when dispensaries or selection changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const updateMarkers = async () => {
      const L = (await import('leaflet')).default;

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      const createCustomIcon = (isSelected: boolean, dealCount: number) => {
        const iconHtml = `
          <div class="relative">
            <div class="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
              isSelected 
                ? 'bg-green-500 scale-125 ring-4 ring-green-500/30' 
                : 'bg-gray-800 border-2 border-green-500'
            }">
              <span class="text-xl">🌿</span>
            </div>
            ${dealCount > 0 
              ? `<div class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  ${dealCount}
                </div>` 
              : ''
            }
          </div>
        `;

        return L.divIcon({
          html: iconHtml,
          className: 'custom-marker',
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40]
        });
      };

      // Add markers for each dispensary
      dispensaries.forEach((dispensary) => {
        const isSelected = selectedId === dispensary.id;
        const dealCount = dispensary.deals?.length || 0;
        const icon = createCustomIcon(isSelected, dealCount);

        const marker = L.marker([dispensary.lat, dispensary.lng], { icon })
          .addTo(mapRef.current!)
          .bindPopup(`
            <div class="p-2 bg-gray-900 text-white rounded min-w-[200px]">
              <h3 class="font-bold text-sm mb-1">${dispensary.name}</h3>
              <p class="text-xs text-gray-300 mb-1">${dispensary.address}</p>
              <div class="flex items-center gap-1 text-xs">
                <span class="text-yellow-400">★</span>
                <span class="font-semibold">${dispensary.rating}</span>
                <span class="text-gray-400">(${dispensary.reviewCount})</span>
              </div>
              ${dealCount > 0 
                ? `<div class="mt-2 text-xs text-green-400 font-semibold">
                    ${dealCount} Deal${dealCount > 1 ? 's' : ''} Available
                  </div>` 
                : ''
              }
            </div>
          `);

        marker.on('click', () => {
          onSelectDispensary(dispensary.id);
        });

        markersRef.current.push(marker);
      });
    };

    updateMarkers();
  }, [dispensaries, mapLoaded, selectedId, onSelectDispensary]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 z-0" />
      
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 glass rounded-lg px-4 py-2 text-sm text-gray-300 pointer-events-none z-10">
        <span className="font-semibold text-primary-400">💡 Tip:</span> Click the polygon tool (top-left) to draw a search area
      </div>
    </div>
  );
}
