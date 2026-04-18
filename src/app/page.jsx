'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import SocialFeed from '../components/SocialFeed/SocialFeed';
import { apiFetch } from '../lib/api';
import styles from './Home.module.css';
import ImageSlider from '../components/ImageSlider/ImageSlider';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';

import WatchAndShop from '../components/WatchAndShop/WatchAndShop';
import SoulOfClothi from '../components/SoulOfClothi/SoulOfClothi';
import StoriesInMotion from '../components/StoriesInMotion/StoriesInMotion';
import ClotheiBrand from '../components/ClotheiBrand/ClotheiBrand';
import MatchTheMood from '../components/MatchTheMood/MatchTheMood';
import ShopByOccasion from '../components/ShopByOccasion/ShopByOccasion';
export default function Home() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const carouselRef = useRef(null);
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorited } = useFavorites();
  const { toast } = useToast();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const sortBy = activeTab === 'trending' ? 'popular' : 'newest';
        const response = await apiFetch(`/products?limit=14&sortBy=${sortBy}`);
        setNewArrivals(response.data?.products || response.products || []);
      } catch (error) {
        console.error('Failed to fetch new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, [activeTab]);

  // Handle tab filter clicks
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Handle carousel left arrow click
  const handleCarouselLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -300,
        behavior: 'smooth',
      });
    }
  };

  // Handle carousel right arrow click
  const handleCarouselRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 300,
        behavior: 'smooth',
      });
    }
  };

  // Format price for display
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `₹${price.toFixed(0)}`;
    }
    return price;
  };

  // Handle add to cart
  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(productId, 1);
  };

  // Handle add/remove from favorites
  const handleFavoriteClick = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isFavorited(productId)) {
        const removed = await removeFromFavorites(productId);
        if (removed !== false) {
          toast.success('Removed from favorites');
        }
      } else {
        const added = await addToFavorites(productId);
        if (added !== false) {
          toast.success('Added to favorites');
        }
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const sliderImages = [
    'https://res.cloudinary.com/dsrht8rss/image/upload/v1776509044/WEBSITE_BANNERS_gvcuq6.png',
    'https://res.cloudinary.com/dsrht8rss/image/upload/v1776182265/5_qexced.png',
    'https://res.cloudinary.com/dsrht8rss/image/upload/v1776508755/DRYFIT_image_iy9bke.png',
    'https://res.cloudinary.com/dsrht8rss/image/upload/v1776508907/Zen-G_by_clothi_1_tkltka.png',
  ];

  return (
    <>
      {/* ========== HERO ========== */}
      <ImageSlider images={sliderImages} />

      <WatchAndShop />

      {/* ========== NEW ARRIVALS ========== */}
      <section className={styles.arrivalsSection}>
        <div className={styles.arrivalsInner}>
          <div className="section-label" style={{ marginBottom: '2.5rem', paddingLeft: '2rem' }}>NEW ARRIVALS</div>
          <div className={styles.tabRow}>
            <div className={styles.tabs}>
              <button className={activeTab === 'all' ? styles.tabActive : styles.tab} onClick={() => handleTabClick('all')}>All</button>
              {/* <button className={styles.tab}>Men&apos;s</button> */}
              <button className={activeTab === 'trending' ? styles.tabActive : styles.tab} onClick={() => handleTabClick('trending')}>Trending</button>
            </div>
            <div className={styles.carouselNav}>
              <button onClick={handleCarouselLeft} className={styles.carouselBtn}><ChevronLeft size={18} /></button>
              <button onClick={handleCarouselRight} className={styles.carouselBtn}><ChevronRight size={18} /></button>
            </div>
          </div>
          <div className={styles.productGrid} ref={carouselRef}>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className={styles.productCardSkeleton}>
                  <div className={styles.skeletonImage} />
                  <div className={styles.skeletonText} />
                  <div className={styles.skeletonTextSmall} />
                </div>
              ))
            ) : newArrivals.length === 0 ? (
              <p className={styles.noProducts}>No products found</p>
            ) : (
              newArrivals.map(product => (
                <Link href={`/product/${product._id}`} key={product._id} className={styles.productCard}>
                  <div className={styles.productImage}>
                    <img src={product.image} alt={product.title} />
                    <button 
                      className={styles.wishlistBtn} 
                      onClick={(e) => handleFavoriteClick(e, product._id)}
                      aria-label={isFavorited(product._id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart 
                        size={16} 
                        strokeWidth={1.5}
                        fill={isFavorited(product._id) ? 'currentColor' : 'none'}
                      />
                    </button>
                    <button
                      className={styles.addToCartBtn}
                      onClick={(e) => handleAddToCart(e, product._id)}
                      title="Add to Cart"
                    >
                      <ShoppingCart size={16} strokeWidth={1.5} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                  {product.badge && <span className={styles.badge}>{product.badge}</span>}
                  <h3 className={styles.productName}>{product.title}</h3>
                  <p className={styles.productPrice}>{formatPrice(product.price)}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ========== CLOTHI BRAND SECTION ========== */}
      {/* <ClotheiBrand /> */}

      {/* ========== MATCH THE MOOD ========== */}
      <MatchTheMood />

      {/* ========== SHOP BY OCCASION ========== */}
      <ShopByOccasion />

      {/* ========== BRAND VALUES ========== */}
      {/* <section className={styles.valuesSection}>
        <div className={styles.valuesInner}>
          <div className={styles.valueCard}>
            <div className={styles.valueImg}>
              <img src="/brand_values.png" alt="Find a Store" style={{ objectPosition: 'left top' }} />
            </div>
            <h4 className={styles.valueTitle}>Come see us</h4>
            <Link href="/catalog" className={styles.valueLink}>FIND A STORE</Link>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.valueImg}>
              <img src="/brand_values.png" alt="Sustainability" style={{ objectPosition: 'right top' }} />
            </div>
            <h4 className={styles.valueTitle}>Our Commitment</h4>
            <Link href="/" className={styles.valueLink}>SUSTAINABILITY</Link>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.valueImg}>
              <img src="/brand_values.png" alt="Artisan Design" style={{ objectPosition: 'right bottom' }} />
            </div>
            <h4 className={styles.valueTitle}>Artisan Partners</h4>
            <Link href="/" className={styles.valueLink}>LEARN MORE</Link>
          </div>
        </div>
      </section> */}

      <SoulOfClothi />
      <StoriesInMotion />

      <SocialFeed />
    </>
  );
}
