'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getCollectionBySlug } from '@/lib/api-collections';
import { Collection } from '@/models/collection';
import CollectionDetail from '@/components/public/CollectionDetail';
import Link from 'next/link';

export default function CollectionDetailPage() {
  const params = useParams() as any;
  const slug = params.slug as string;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCollection = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCollectionBySlug(slug);
        setCollection(response.data);
      } catch (err: any) {
        console.error('Failed to load collection:', err);
        setError(err.message || 'Failed to load collection');
      } finally {
        setLoading(false);
      }
    };

    loadCollection();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Loading collection...</div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            {error || 'Collection not found'}
          </p>
          <Link href="/collections" className="text-blue-600 hover:text-blue-800">
            Back to collections
          </Link>
        </div>
      </div>
    );
  }

  return <CollectionDetail collection={collection} />;
}
