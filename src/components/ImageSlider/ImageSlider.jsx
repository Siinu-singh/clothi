'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './ImageSlider.module.css';

export default function ImageSlider({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayRef = useRef(null);

  const slides = images.length > 0 ? images : [
    'https://res.cloudinary.com/dsrht8rss/image/upload/v1775568636/4_koks8s.jpg',
    'https://res.cloudinary.com/dsrht8rss/image/upload/v1776182265/5_qexced.png',
    'https://res.cloudinary.com/dsrht8rss/image/upload/v1775568636/1_gnlpyw.jpg',
    'https://res.cloudinary.com/dsrht8rss/image/upload/v1776182265/5_qexced.png',
  ];

  // Auto-play effect
  useEffect(() => {
    if (slides.length === 0) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(autoPlayRef.current);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index % slides.length);
  };

  return (
    <div className={styles.sliderContainer}>
      {/* Slides */}
      <div className={styles.slidesWrapper}>
        {slides.map((image, index) => (
          <div
            key={index}
            className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
            style={{
              backgroundImage: `url('${image}')`,
            }}
          />
        ))}
      </div>

      {/* Navigation Dots */}
      <div className={styles.dotsContainer}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
