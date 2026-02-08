'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FilterPanel } from '@/components/FilterPanel';
import { DispensaryCard } from '@/components/DispensaryCard';
import { AgeGate } from '@/components/AgeGate';
import { demoDispensaries, Dispensary } from '@/lib/demo-data';
import { isPointInPolygon, calculateDistance } from '@/lib/geo-utils';
import { Map, List, Share2 } from 'lucide-react';

const MapView = dynamic(
  () => import('@/components/MapView').then((mod) => ({ default: mod.MapView })),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p>Loading map...</p>
        </div>
      </div>
    )
  }
);

type DispensaryWithDistance = Dispensary & { distance: number };

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLicenseType, setSelectedLicenseType] = useState('');
  const [maxDistance, setMaxDistance] = useState(25);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [showDealsOnly, setShowDealsOnly] = useState(false);
  const [polygon, setPolygon] = useState<[number, number][] | null>(null);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [view, setView] = useState<'map' | 'list'>('map');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          setUserLocation([37.7749, -122.4194]);
        }
      );
    } else {
      setUserLocation([37.7749, -122.4194]);
    }
  }, []);

  const filteredDispensaries = useMemo(() => {
    let results: (Dispensary | DispensaryWithDistance)[] = [...demoDispensaries];

    if (polygon) {
      results = results.filter((d) =>
        isPointInPolygon([d.lng, d.lat], polygon)
      );
    }

    if (searchTerm) {
      results = results.filter(
        (d) =>
          d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      results = results.filter((d) =>
        d.deals?.some((deal) => deal.category === selectedCategory)
      );
    }

    if (selectedLicenseType) {
      results = results.filter((d) => d.licenseType === selectedLicenseType || d.licenseType === 'both');
    }

    if (showOpenOnly) {
      results = results.filter((d) => d.isOpen);
    }

    if (showDealsOnly) {
      results = results.filter((d) => d.deals && d.deals.length > 0);
    }

    if (userLocation) {
      results = results
        .map((d) => ({
          ...d,
          distance: calculateDistance(
            userLocation[0],
            userLocation[1],
            d.lat,
            d.lng
          ),
        }))
        .filter((d) => d.distance <= maxDistance);

      if (selectedCategory) {
        results = results.filter((d) =>
          d.deals?.some(
            (deal) =>
              deal.category === selectedCategory &&
              deal.salePrice >= priceRange[0] &&
              deal.salePrice <= priceRange[1]
          )
        );
      }

      results.sort((a, b) => (a as DispensaryWithDistance).distance - (b as DispensaryWithDistance).distance);
    } else {
      results.sort((a, b) => b.rating - a.rating);
    }

    return results as DispensaryWithDistance[];
  }, [
    searchTerm,
    selectedCategory,
    selectedLicenseType,
    maxDistance,
    priceRange,
    showOpenOnly,
    showDealsOnly,
    polygon,
    userLocation,
  ]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLicenseType('');
    setMaxDistance(25);
    setPriceRange([0, 100]);
    setShowOpenOnly(false);
    setShowDealsOnly(false);
    setPolygon(null);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: 'Cannabis Finder',
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const stats = useMemo(() => {
    const withDeals = filteredDispensaries.filter((d) => d.deals && d.deals.length > 0).length;
    const open = filteredDispensaries.filter((d) => d.isOpen).length;
    const avgRating = filteredDispensaries.length > 0
      ? (filteredDispensaries.reduce((sum, d) => sum + d.rating, 0) / filteredDispensaries.length).toFixed(1)
      : '0';
    return { total: filteredDispensaries.length, withDeals, open, avgRating };
  }, [filteredDispensaries]);

  return (
    <>
      <AgeGate />
      <main className="h-screen flex flex-col">
        <header className="glass border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">🌿 Cannabis Finder</h1>
              <p className="text-sm text-gray-400">
                {stats.total} dispensaries • {stats.withDeals} with deals • {stats.open} open now
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="lg:hidden flex gap-2">
                <button
                  onClick={() => setView('map')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    view === 'map' ? 'bg-primary-500 text-white' : 'bg-white/10'
                  }`}
                >
                  <Map className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    view === 'list' ? 'bg-primary-500 text-white' : 'bg-white/10'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <aside className="w-80 border-r border-white/10 p-4 overflow-y-auto scrollbar-hide hidden lg:block">
            <FilterPanel
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedLicenseType={selectedLicenseType}
              setSelectedLicenseType={setSelectedLicenseType}
              maxDistance={maxDistance}
              setMaxDistance={setMaxDistance}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              showOpenOnly={showOpenOnly}
              setShowOpenOnly={setShowOpenOnly}
              showDealsOnly={showDealsOnly}
              setShowDealsOnly={setShowDealsOnly}
              onClearFilters={handleClearFilters}
            />
            <div className="mt-4 space-y-3">
              {filteredDispensaries.map((dispensary) => (
                <DispensaryCard
                  key={dispensary.id}
                  dispensary={dispensary}
                  distance={dispensary.distance}
                  isSelected={selectedId === dispensary.id}
                  onClick={() => setSelectedId(dispensary.id)}
                />
              ))}
            </div>
          </aside>

          <div className="flex-1 relative">
            <div className={`absolute inset-0 ${view === 'map' ? 'block' : 'hidden lg:block'}`}>
              <MapView
                dispensaries={filteredDispensaries}
                onPolygonChange={setPolygon}
                selectedId={selectedId}
                onSelectDispensary={setSelectedId}
                userLocation={userLocation}
              />
            </div>

            <div className={`absolute inset-0 overflow-y-auto p-4 lg:hidden ${view === 'list' ? 'block' : 'hidden'}`}>
              <FilterPanel
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedLicenseType={selectedLicenseType}
                setSelectedLicenseType={setSelectedLicenseType}
                maxDistance={maxDistance}
                setMaxDistance={setMaxDistance}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                showOpenOnly={showOpenOnly}
                setShowOpenOnly={setShowOpenOnly}
                showDealsOnly={showDealsOnly}
                setShowDealsOnly={setShowDealsOnly}
                onClearFilters={handleClearFilters}
                isMobile
              />
              <div className="mt-4 space-y-3">
                {filteredDispensaries.map((dispensary) => (
                  <DispensaryCard
                    key={dispensary.id}
                    dispensary={dispensary}
                    distance={dispensary.distance}
                    isSelected={selectedId === dispensary.id}
                    onClick={() => {
                      setSelectedId(dispensary.id);
                      setView('map');
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
