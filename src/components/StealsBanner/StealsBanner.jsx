'use client';
import Link from 'next/link';
import { Tag } from 'lucide-react';
import styles from './StealsBanner.module.css';

export default function StealsBanner() {
  const deals = [
    {
      id: 1,
      title: 'SHIRTS UNDER ₹999',
      image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1775568636/2_teqbm9.jpg',
      link: '/catalog',
    },
    {
      id: 2,
      title: 'TEES UNDER ₹499',
      image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1776182265/5_qexced.png',
      link: '/catalog',
    },
    {
      id: 3,
      title: 'BOTTOMS UNDER ₹1499',
      image: 'https://res.cloudinary.com/dsrht8rss/image/upload/v1775568636/4_koks8s.jpg',
      link: '/catalog',
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.scrollTextWrapper}>
        <div className={styles.marqueeText}>
           STEALS • STEALS • STEALS • STEALS • STEALS • STEALS • STEALS • STEALS • STEALS •
        </div>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.header}>
            <div className={styles.badge}>
              <Tag size={16} /> LIMITED TIME
            </div>
            <h2 className={styles.title}>STEALS OF THE DAY</h2>
        </div>

        <div className={styles.cardsContainer}>
          {deals.map(deal => (
            <Link href={deal.link} key={deal.id} className={styles.card}>
                <div className={styles.imageBlock}>
                  <img src={deal.image} alt={deal.title} loading="lazy" />
                  <div className={styles.dealTag}>HOT DEAL</div>
                </div>
                <div className={styles.cardBody}>
                   <h3>{deal.title}</h3>
                   <span className={styles.shopLink}>Shop Now &rarr;</span>
                </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
