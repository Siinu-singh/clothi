import { apiFetch } from './api';
import {
  Collection,
  CreateCollectionInput,
  UpdateCollectionInput,
  CollectionListResponse,
  CollectionStats,
} from '@/models/collection';

/**
 * PUBLIC ENDPOINTS
 */

/**
 * Get all featured collections (with pagination)
 */
export async function getFeaturedCollections(page = 1, limit = 10) {
  const response = await apiFetch(
    `/collections/featured?page=${page}&limit=${limit}`
  );
  return response as CollectionListResponse;
}

/**
 * Get all collections with pagination and filtering
 */
export async function getCollections(
  page = 1,
  limit = 10,
  filters?: {
    category?: string;
    tags?: string[];
    search?: string;
  }
) {
  let query = `?page=${page}&limit=${limit}`;
  if (filters?.category) query += `&category=${filters.category}`;
  if (filters?.tags?.length) query += `&tags=${filters.tags.join(',')}`;
  if (filters?.search) query += `&search=${encodeURIComponent(filters.search)}`;

  const response = await apiFetch(`/collections${query}`);
  return response as CollectionListResponse;
}

/**
 * Search collections by query
 */
export async function searchCollections(
  query: string,
  page = 1,
  limit = 10
) {
  const response = await apiFetch(
    `/collections/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
  );
  return response as CollectionListResponse;
}

/**
 * Get collection by slug
 */
export async function getCollectionBySlug(slug: string) {
  const response = await apiFetch(`/collections/${slug}`);
  return response as { success: boolean; data: Collection; message: string };
}

/**
 * Get collections by category
 */
export async function getCollectionsByCategory(
  category: string,
  page = 1,
  limit = 10
) {
  const response = await apiFetch(
    `/collections/category/${category}?page=${page}&limit=${limit}`
  );
  return response as CollectionListResponse;
}

/**
 * Get collections by tags
 */
export async function getCollectionsByTags(
  tags: string[],
  page = 1,
  limit = 10
) {
  const response = await apiFetch(
    `/collections/tags/${tags.join(',')}?page=${page}&limit=${limit}`
  );
  return response as CollectionListResponse;
}

/**
 * Get all collections (no pagination, for quick access)
 */
export async function getAllCollections() {
  const response = await apiFetch('/collections/all');
  return response as {
    success: boolean;
    data: Collection[];
    message: string;
  };
}

/**
 * ADMIN ENDPOINTS
 */

/**
 * Create a new collection (admin only)
 */
export async function createCollection(data: CreateCollectionInput) {
  const response = await apiFetch('/collections', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response as { success: boolean; data: Collection; message: string };
}

/**
 * Update a collection (admin only)
 */
export async function updateCollection(
  id: string,
  data: UpdateCollectionInput
) {
  const response = await apiFetch(`/collections/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response as { success: boolean; data: Collection; message: string };
}

/**
 * Delete a collection (admin only)
 */
export async function deleteCollection(id: string) {
  const response = await apiFetch(`/collections/${id}`, {
    method: 'DELETE',
  });
  return response as { success: boolean; message: string };
}

/**
 * Toggle featured status (admin only)
 */
export async function toggleFeaturedCollection(
  id: string,
  featured: boolean
) {
  const response = await apiFetch(`/collections/${id}/toggle-featured`, {
    method: 'PATCH',
    body: JSON.stringify({ featured }),
  });
  return response as { success: boolean; data: Collection; message: string };
}

/**
 * Toggle active status (admin only)
 */
export async function toggleActiveCollection(id: string, active: boolean) {
  const response = await apiFetch(`/collections/${id}/toggle-active`, {
    method: 'PATCH',
    body: JSON.stringify({ active }),
  });
  return response as { success: boolean; data: Collection; message: string };
}

/**
 * Get collection statistics (admin only)
 */
export async function getCollectionStats() {
  const response = await apiFetch('/collections/admin/stats', {
    method: 'GET',
  });
  return response as {
    success: boolean;
    data: CollectionStats;
    message: string;
  };
}
