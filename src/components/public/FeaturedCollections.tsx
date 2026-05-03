'use client';
import { useEffect, useState } from 'react';
import { useCollection } from '@/context/CollectionContext';
import CollectionCard from './CollectionCard';

interface FeaturedCollectionsProps {
  limit?: number;
}

export default function FeaturedCollections({
  limit = 6,
}: FeaturedCollectionsProps) {
  const { featuredCollections, loading, loadFeaturedCollections } = useCollection();
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    loadFeaturedCollections(1, limit);
  }, [limit, loadFeaturedCollections]);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(featuredCollections.length / itemsPerPage);
  const startIdx = currentPage * itemsPerPage;
  const visibleCollections = featuredCollections.slice(
    startIdx,
    startIdx + itemsPerPage
  );

  const goToPrevious = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="w-full py-12 bg-gray-50 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading featured collections...</p>
      </div>
    );
  }

  if (featuredCollections.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Collections</h2>
            <p className="text-gray-600 mt-2">Discover our curated selections</p>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleCollections.map((collection) => (
              <CollectionCard
                key={collection._id}
                collection={collection}
                variant="featured"
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          {totalPages > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition text-gray-700 hidden lg:block"
                aria-label="Previous"
              >
                ←
              </button>
              <button
                onClick={goToNext}
                className="absolute -right-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition text-gray-700 hidden lg:block"
                aria-label="Next"
              >
                →
              </button>
            </>
          )}

          {/* Dots */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`w-2 h-2 rounded-full transition ${
                    idx === currentPage
                      ? 'bg-blue-600'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
