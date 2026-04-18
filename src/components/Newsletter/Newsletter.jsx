import React from 'react';
import { ChevronRight } from 'lucide-react';
import styles from './Newsletter.module.css';

const Newsletter = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.newsletterContent}>
          <div className={styles.newsletterLeft}>
            <div className={styles.brandSun}>
              <img src="/clothi.png" alt="Clothi Logo" className={styles.clothiLogo} />
            </div>
            <div className={styles.nlText}>
              <h3 className={styles.nlTitle}>Stay Notified</h3>
              <p className={styles.nlDesc}>Subscribe to get exclusive updates, new collections, and special offers delivered to your inbox.</p>
            </div>
          </div>
          <div className={styles.newsletterRight}>
            <div className={styles.emailRow}>
              <input type="email" placeholder="your@email.com" className={styles.emailInput} />
              <button className={styles.emailBtn}><ChevronRight size={20} /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
