'use client';

import { Dispensary } from '@/lib/demo-data';
import { MapPin, Phone, Star, Tag } from 'lucide-react';

interface DispensaryCardProps {
  dispensary: Dispensary;
  distance?: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export function DispensaryCard({
  dispensary,
  distance,
  isSelected,
  onClick,
}: DispensaryCardProps) {
  const dealCount = dispensary.deals?.length || 0;

  return (
    <div
      onClick={onClick}
      className={`glass rounded-xl p-4 cursor-pointer transition-all ${
        isSelected
          ? 'ring-2 ring-primary-500 bg-white/10'
          : 'hover:bg-white/10'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{dispensary.name}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{dispensary.address}</span>
          </div>
        </div>
        {dealCount > 0 && (
          <div className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
            {dealCount}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{dispensary.rating}</span>
          <span className="text-sm text-gray-400">
            ({dispensary.reviewCount})
          </span>
        </div>
        {distance !== undefined && (
          <span className="text-sm text-gray-400">{distance.toFixed(1)} mi</span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span
          className={`text-xs px-2 py-1 rounded ${
            dispensary.isOpen
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {dispensary.isOpen ? 'Open' : 'Closed'}
        </span>
        <span className="text-xs px-2 py-1 rounded bg-primary-500/20 text-primary-400 capitalize">
          {dispensary.licenseType}
        </span>
      </div>

      {dealCount > 0 && (
        <div className="border-t border-white/10 pt-3">
          <div className="flex items-center gap-1 text-sm text-primary-400 font-semibold mb-2">
            <Tag className="w-4 h-4" />
            <span>{dealCount} Deal{dealCount > 1 ? 's' : ''} Available</span>
          </div>
          {dispensary.deals?.slice(0, 2).map((deal) => (
            <div key={deal.id} className="text-sm text-gray-300 mb-1">
              <span className="font-medium">{deal.product}</span>
              <span className="text-gray-500 mx-2">•</span>
              <span className="line-through text-gray-500">
                ${deal.originalPrice}
              </span>
              <span className="text-primary-400 font-semibold ml-2">
                ${deal.salePrice}
              </span>
              <span className="text-xs text-red-400 ml-2">
                {Math.round(
                  ((deal.originalPrice - deal.salePrice) /
                    deal.originalPrice) *
                    100
                )}
                % off
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1 text-sm text-gray-400 mt-3">
        <Phone className="w-4 h-4" />
        <span>{dispensary.phone}</span>
      </div>
    </div>
  );
}
