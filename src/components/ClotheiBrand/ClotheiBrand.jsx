'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './ClotheiBrand.module.css';

export default function ClotheiBrand() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1775568636/1_gnlpyw.jpg',
      subtitle: 'COMFORT IS THE NEW LUXURY',
      title: 'SKYCLUB COLLECTION',
      buttonText: 'SHOP NOW',
      link: '/catalog',
    },
    {
      id: 2,
      image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1775568636/3_tzfa7v.jpg',
      subtitle: 'PREMIUM ESSENTIALS',
      title: 'MENS WINTER STAPLES',
      buttonText: 'EXPLORE',
      link: '/catalog',
    },
    {
      id: 3,
      image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1775568636/4_koks8s.jpg',
      subtitle: 'ELEVATE YOUR EVERYDAY',
      title: 'SHADES OF WINTER',
      buttonText: 'DISCOVER',
      link: '/catalog',
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className={styles.slideshowContainer}>
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
        >
          <div className={styles.imageWrapper}>
            <img src={slide.image} alt={slide.title} className={styles.image} />
            <div className={styles.overlay}></div>
          </div>
          
          <div className={styles.content}>
            <span className={styles.subtitle}>{slide.subtitle}</span>
            <h2 className={styles.title}>{slide.title}</h2>
            <Link href={slide.link} className={styles.button}>
              {slide.buttonText}
            </Link>
          </div>
        </div>
      ))}

      <div className={styles.pagination}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          >
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {index === currentSlide ? (
                <circle cx="10" cy="10" r="5" fill="white" />
              ) : null}
              <circle
                cx="10"
                cy="10"
                r="9"
                stroke="white"
                strokeWidth="1.5px"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ))}
      </div>
    </section>
  );
}
