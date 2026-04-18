'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useFavorites } from '../../context/FavoritesContext';
import styles from './SearchDropdown.module.css';

export default function SearchDropdown({ isOpen, onClose }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const router = useRouter();
  const { addToFavorites, removeFromFavorites, isFavorited } = useFavorites();
  const dropdownRef = useRef(null);
  const gridWrapperRef = useRef(null);

  const categories = ['', 'The Crown Series', 'Zen-G by Clothi', 'Motion x', 'Prime Basics'];
  const ITEMS_PER_PAGE = 8;
  
  // Hardcoded top searches similar to Snitch
  const topSearches = [
    'POLO', 'LINEN SHIRTS', 'WHITE SHIRT', 
    'BLACK SHIRT', 'FORMAL WEAR', 'BOOTCUT JEANS', 
    'BROWN SHIRT', 'PINK SHIRT', 'BAGGY JEANS', 'BLACK JEANS'
  ];

  useEffect(() => {
    if (isOpen) {
      setPage(1);
      setProducts([]);
      setHasMore(true);
      fetchProducts(activeCategory, 1);
    }
  }, [isOpen, activeCategory]);

  useEffect(() => {
    const wrapper = gridWrapperRef.current;
    if (!wrapper) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = wrapper;
      // When user is within 100px of the bottom, fetch more
      if (scrollHeight - scrollTop - clientHeight < 100 && hasMore && !isLoadingMore && !loading) {
        fetchMoreProducts(activeCategory, page + 1);
      }
    };

    wrapper.addEventListener('scroll', handleScroll);
    return () => wrapper.removeEventListener('scroll', handleScroll);
  }, [page, hasMore, isLoadingMore, loading, activeCategory]);

  const fetchProducts = async (category, pageNum) => {
    try {
      setLoading(true);
      let url = `/products?limit=${ITEMS_PER_PAGE}&skip=${(pageNum - 1) * ITEMS_PER_PAGE}&sortBy=popular`;
      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }
      const response = await apiFetch(url);
      const newProducts = response.data?.products || response.products || [];
      setProducts(newProducts);
      setPage(pageNum);
      setHasMore(newProducts.length === ITEMS_PER_PAGE);
    } catch (err) {
      console.error('Failed to fetch trending products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreProducts = async (category, pageNum) => {
    try {
      setIsLoadingMore(true);
      let url = `/products?limit=${ITEMS_PER_PAGE}&skip=${(pageNum - 1) * ITEMS_PER_PAGE}&sortBy=popular`;
      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }
      const response = await apiFetch(url);
      const newProducts = response.data?.products || response.products || [];
      setProducts(prev => [...prev, ...newProducts]);
      setPage(pageNum);
      setHasMore(newProducts.length === ITEMS_PER_PAGE);
    } catch (err) {
      console.error('Failed to fetch more products:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleToggleFavorite = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isFavorited(productId)) {
        await removeFromFavorites(productId);
      } else {
        await addToFavorites(productId);
      }
    } catch (err) {
      console.error('Failed to update favorites:', err);
    }
  };

  const handleTagClick = (tag) => {
     router.push(`/catalog`);
     onClose();
  };

  if (!isOpen) return null;

  const getColorsCount = (product) => {
      return product.colors?.length || Math.floor(Math.random() * 3) + 1;
  };

  return (
    <div className={styles.overlay} ref={dropdownRef}>
      <div className={styles.inner}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <h3 className={styles.sectionTitle}>TOP SEARCHES</h3>
          <div className={styles.tagsGrid}>
            {topSearches.map(tag => (
              <button 
                key={tag} 
                className={styles.tagButton}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          <h3 className={styles.sectionTitle} style={{ visibility: 'hidden' }}>TRENDING</h3>
          <div className={styles.categoriesRow}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`${styles.categoryPill} ${activeCategory === cat ? styles.categoryPillActive : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat || 'All'}
              </button>
            ))}
          </div>

          <div className={styles.productGridWrapper} ref={gridWrapperRef}>
            <div className={styles.productGrid}>
              {loading ? (
                // Skeletons
                [...Array(4)].map((_, i) => (
                  <div key={i} className={styles.skeletonCard}>
                    <div className={styles.skeletonImage}></div>
                    <div className={styles.skeletonText}></div>
                    <div className={`${styles.skeletonText} ${styles.skeletonTextShort}`}></div>
                  </div>
                ))
              ) : (
                <>
                  {products.map(p => (
                    <Link href={`/product/${p._id}`} key={p._id} className={styles.productCard} onClick={onClose}>
                      <div className={styles.imageWrapper}>
                        <img 
                          src={p.images?.[0] || p.image} 
                          alt={p.title} 
                          className={styles.productImage} 
                        />
                        <button 
                          className={`${styles.wishlistBtn} ${isFavorited(p._id) ? styles.wishlistBtnActive : ''}`}
                          onClick={(e) => handleToggleFavorite(e, p._id)}
                        >
                          <Heart 
                            size={18} 
                            strokeWidth={1.5} 
                            fill={isFavorited(p._id) ? 'currentColor' : 'none'}
                          />
                        </button>
                      </div>
                      <div className={styles.productInfo}>
                        <h4 className={styles.productTitle}>{p.title}</h4>
                        <p className={styles.productPrice}>${p.price?.toFixed(0) || '0'}</p>
                        <div className={styles.colorSwatches}>
                          <div className={styles.swatch} style={{backgroundColor: '#e5e5e5'}}></div>
                          <div className={styles.swatch} style={{backgroundColor: '#303030'}}></div>
                          {getColorsCount(p) > 2 && (
                            <span className={styles.swatchCount}>+{getColorsCount(p) - 2}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                  {isLoadingMore && (
                    <>
                      {[...Array(2)].map((_, i) => (
                        <div key={`skeleton-${i}`} className={styles.skeletonCard}>
                          <div className={styles.skeletonImage}></div>
                          <div className={styles.skeletonText}></div>
                          <div className={`${styles.skeletonText} ${styles.skeletonTextShort}`}></div>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
