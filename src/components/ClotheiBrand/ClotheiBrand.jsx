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
      icon: 'tshirt',
    },
    {
      id: 2,
      image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1775568636/3_tzfa7v.jpg',
      subtitle: 'PREMIUM ESSENTIALS',
      title: 'MENS WINTER STAPLES',
      buttonText: 'EXPLORE',
      link: '/catalog',
      icon: 'pants',
    },
    {
      id: 3,
      image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1775568636/4_koks8s.jpg',
      subtitle: 'ELEVATE YOUR EVERYDAY',
      title: 'SHADES OF WINTER',
      buttonText: 'DISCOVER',
      link: '/catalog',
      icon: 'jacket',
    }
  ];

  // SVG icon components for clothing items
  const getClothingIcon = (iconType, isActive) => {
    const iconProps = {
      width: '32px',
      height: '32px',
      viewBox: '0 0 32 32',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      className: isActive ? styles.activeIcon : styles.inactiveIcon,
    };

    switch (iconType) {
      case 'tshirt':
        return (
          <svg {...iconProps}>
            {/* T-Shirt Body */}
            <path
              d="M8 6L6 10V22C6 23.6569 7.34315 25 9 25H23C24.6569 25 26 23.6569 26 22V10L24 6H8Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Neck */}
            <circle cx="16" cy="8" r="2" fill="white" />
            {/* Left Sleeve */}
            <path
              d="M8 10L3 12"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Right Sleeve */}
            <path
              d="M24 10L29 12"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Center Line */}
            <path
              d="M16 10V20"
              stroke="white"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.5"
            />
          </svg>
        );
      case 'pants':
        return (
          <svg {...iconProps}>
            {/* Waist */}
            <path
              d="M8 8H24C24 8 24 10 24 12"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Left Pant Leg */}
            <path
              d="M10 12V24C10 25.1046 9.10457 26 8 26H8"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Right Pant Leg */}
            <path
              d="M22 12V24C22 25.1046 22.8954 26 24 26H24"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Main Body */}
            <path
              d="M9 8L8 10V12H24V10L23 8H9Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Center seam */}
            <path
              d="M16 12V24"
              stroke="white"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.5"
            />
          </svg>
        );
      case 'jacket':
        return (
          <svg {...iconProps}>
            {/* Outer Jacket */}
            <path
              d="M5 9V22C5 23.6569 6.34315 25 8 25H24C25.6569 25 27 23.6569 27 22V9L16 4L5 9Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Left Lapel */}
            <path
              d="M5 9L11 14"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Right Lapel */}
            <path
              d="M27 9L21 14"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Front Opening */}
            <path
              d="M16 9V22"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Collar */}
            <path
              d="M14 10L16 8L18 10"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="white"
              opacity="0.7"
            />
            {/* Button Detail */}
            <circle cx="16" cy="16" r="1" fill="white" opacity="0.6" />
          </svg>
        );
      default:
        return null;
    }
  };

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
        {slides.map((slide, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          >
            {getClothingIcon(slide.icon, index === currentSlide)}
          </button>
        ))}
      </div>
    </section>
  );
}
