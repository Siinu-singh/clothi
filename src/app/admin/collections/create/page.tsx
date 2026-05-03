'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCollection } from '@/context/CollectionContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import CollectionForm from '@/components/admin/CollectionForm';

export default function CreateCollectionPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth() as any;
  const { handleCreateCollection } = useCollection() as any;
  const { toast } = useToast() as any;
  const [loading, setLoading] = useState(false);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-4">You must be logged in as admin</p>
          <Link href="/login" className="text-blue-600 hover:text-blue-800">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (formData: any) => {
    try {
      setLoading(true);
      const collection = await handleCreateCollection(formData);
      toast.success('Collection created successfully!');
      router.push('/admin/collections');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create collection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/collections"
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Collection</h1>
              <p className="text-gray-500 mt-1">Add a new collection to your store</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CollectionForm onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </div>
  );
}
