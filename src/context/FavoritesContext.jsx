'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from './AuthContext';
import { useLoginPrompt } from './LoginPromptContext';

const FavoritesContext = createContext({});

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const { showLoginPrompt } = useLoginPrompt();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shareLinks, setShareLinks] = useState([]);

  // Load favorites when user logs in
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/favorites');
      // Backend returns: { success: true, data: { favorites: [...], pagination: {...} } }
      // Each favorite item has: { _id, userId, productId: {...full_product_object}, createdAt }
      const favoritesData = response.data?.favorites || response.favorites || response.data || [];
      // Store favorites with productId as string ID and keep full product data
      const normalized = Array.isArray(favoritesData) ? favoritesData.map(item => {
        if (!item) return null;
        
        // Extract product ID from populated productId field
        let productId = null;
        let productData = null;
        
        if (item.productId) {
          if (typeof item.productId === 'object' && item.productId._id) {
            // Backend populated productId with full product object
            productId = String(item.productId._id);
            productData = item.productId;
          } else if (typeof item.productId === 'string') {
            // productId is already a string
            productId = item.productId;
          }
        }
        
        if (!productId) return null; // Drop broken/orphaned database links
        
        return {
          _id: item._id,
          productId: productId,
          product: productData, // Cache full product data to avoid re-fetch
        };
      }).filter(Boolean) : [];
      setFavorites(normalized);
    } catch (err) {
      console.error('Failed to load favorites', err);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (productId) => {
    if (!user) {
      showLoginPrompt({
        title: 'Sign in to save favorites',
        message: 'Create an account or sign in to save your favorite items and access them anytime.',
      });
      return false;
    }

    try {
      // Ensure productId is a string to prevent [object Object] in URLs
      const idString = String(productId);
      
      const response = await apiFetch('/favorites/add', {
        method: 'POST',
        body: JSON.stringify({ productId: idString })
      });
      
      // Update local state with properly formatted object
      setFavorites(prev => {
        // Check if product is already in favorites
        const exists = prev.some(item => 
          String(item._id) === idString || String(item.productId) === idString
        );
        if (!exists) {
          return [...prev, { productId: idString, _id: idString }];
        }
        return prev;
      });
      
      return true;
    } catch (err) {
      console.error('Add to favorites failed', err);
      throw err;
    }
  };

  const removeFromFavorites = async (productId) => {
    if (!user) {
      return false;
    }

    try {
      const idString = String(productId);
      
      await apiFetch(`/favorites/${idString}`, {
        method: 'DELETE'
      });
      
      // Update local state
      setFavorites(prev => prev.filter(item => 
        String(item._id) !== idString && String(item.productId) !== idString
      ));
      
      return true;
    } catch (err) {
      console.error('Remove from favorites failed', err);
      throw err;
    }
  };

  const isFavorited = (productId) => {
    const idString = String(productId);
    return favorites.some(item => 
      String(item._id) === idString || String(item.productId) === idString
    );
  };

  const checkFavorite = async (productId) => {
    if (!user) {
      return false;
    }

    try {
      const idString = String(productId);
      const data = await apiFetch(`/favorites/${idString}/check`);
      return data.isFavorited || data.favorited || false;
    } catch (err) {
      console.error('Check favorite failed', err);
      return false;
    }
  };

  const createShareLink = async (expiresInDays = null) => {
    if (!user) {
      return null;
    }

    try {
      const response = await apiFetch('/wishlist-share', {
        method: 'POST',
        body: JSON.stringify({ expiresIn: expiresInDays })
      });
      
      setShareLinks(prev => [...prev, response.data.shareToken]);
      return response.data;
    } catch (err) {
      console.error('Failed to create share link', err);
      throw err;
    }
  };

  const getShareLinks = async () => {
    if (!user) {
      return [];
    }

    try {
      const response = await apiFetch('/wishlist-share');
      setShareLinks(response.data.shareLinks);
      return response.data;
    } catch (err) {
      console.error('Failed to get share links', err);
      return [];
    }
  };

  const revokeShareLink = async (shareTokenId) => {
    if (!user) {
      return false;
    }

    try {
      await apiFetch(`/wishlist-share/${shareTokenId}/revoke`, {
        method: 'PATCH'
      });
      
      setShareLinks(prev => prev.filter(link => link._id !== shareTokenId));
      return true;
    } catch (err) {
      console.error('Failed to revoke share link', err);
      throw err;
    }
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorited,
      checkFavorite,
      loading,
      loadFavorites,
      createShareLink,
      getShareLinks,
      revokeShareLink,
      shareLinks,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
