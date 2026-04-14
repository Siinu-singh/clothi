'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import SocialFeed from '../components/SocialFeed/SocialFeed';
import { apiFetch } from '../lib/api';
import styles from './Home.module.css';
import ImageSlider from '../components/ImageSlider/ImageSlider';
import { useCart } from '../context/CartContext';

import WatchAndShop from '../components/WatchAndShop/WatchAndShop';
import SoulOfClothi from '../components/SoulOfClothi/SoulOfClothi';
import StoriesInMotion from '../components/StoriesInMotion/StoriesInMotion';
import ClotheiBrand from '../components/ClotheiBrand/ClotheiBrand';

export default function Home() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const carouselRef = useRef(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const response = await apiFetch('/products?limit=14&sortBy=newest');
        setNewArrivals(response.data?.products || response.products || []);
      } catch (error) {
        console.error('Failed to fetch new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

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
      return `$${price.toFixed(0)}`;
    }
    return price;
  };

  // Handle add to cart
  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(productId, 1);
  };

  const sliderImages = [
    'https://res.cloudinary.com/dsrht8rss/image/upload/v1775568636/4_koks8s.jpg',
    'https://res.cloudinary.com/dsrht8rss/image/upload/v1776182265/5_qexced.png',
    'https://res.cloudinary.com/dsrht8rss/image/upload/v1775568636/1_gnlpyw.jpg',
    'https://res.cloudinary.com/dsrht8rss/image/upload/v1776182265/5_qexced.png',
  ];

  return (
    <>
      {/* ========== HERO ========== */}
      <ImageSlider images={sliderImages} />

      <WatchAndShop />

      {/* ========== NEW ARRIVALS ========== */}
      <section className={styles.arrivalsSection}>
        <div className={styles.arrivalsInner}>
          <div className="section-label" style={{ marginBottom: '2.5rem' }}>NEW ARRIVALS</div>
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
                     <button className={styles.wishlistBtn} onClick={e => e.preventDefault()}>
                       <Heart size={16} strokeWidth={1.5} />
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
                   <div className={styles.colorDots}>
                     {product.colors?.slice(0, 3).map((color, idx) => (
                       <span key={idx} className={styles.dot} style={{ background: color.hex || color }} />
                     ))}
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
      <ClotheiBrand />

      {/* ========== LIFESTYLE DUO ========== */}
      <section className={styles.lifestyleDuo}>
        <div className={styles.lifestyleDuoInner}>
          <Link href="/catalog" className={styles.lifestyleDuoCard}>
            <img src="/collection_duo.png" alt="Men's Indigo" style={{ objectPosition: 'left center' }} />
            <div className={styles.splitOverlay} />
            <div className={styles.lifestyleDuoLabel}>
              <span className={styles.lifestyleDuoKicker}>MEN&apos;S EDIT</span>
              <h3 className={styles.lifestyleDuoTitle}>The Indigo Collection</h3>
            </div>
          </Link>
          <Link href="/catalog" className={styles.lifestyleDuoCard}>
            <img src="/collection_duo.png" alt="Women's Transitional" style={{ objectPosition: 'right center' }} />
            <div className={styles.splitOverlay} />
            <div className={styles.lifestyleDuoLabel}>
              <span className={styles.lifestyleDuoKicker}>WOMEN&apos;S EDIT</span>
              <h3 className={styles.lifestyleDuoTitle}>Transitional Knits</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* ========== DESIGN STUDIO BANNER ========== */}
      <section className={styles.studioBanner}>
        <img src="/hero_coastal.png" alt="The Design Studio" className={styles.studioBg} />
        <div className={styles.studioOverlay} />
        <div className={styles.studioContent}>
          <h2 className={styles.studioTitle}>THE DESIGN STUDIO</h2>
          <Link href="/catalog" className={styles.studioLink}>LEARN MORE</Link>
        </div>
      </section>

      {/* ========== BRAND VALUES ========== */}
      <section className={styles.valuesSection}>
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
      </section>

      <SoulOfClothi />
      <StoriesInMotion />

      <SocialFeed />
    </>
  );
}
