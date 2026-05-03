import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <>
      <div className={styles.benefitsRow}>
        <div className={styles.benefitsInner}>
          <div className={styles.benefitItem}>
            <img src="https://fahertybrand.com/cdn/shop/files/Faherty_Truck_Illustration_1A.png?v=1744913088" className={styles.benefitIcon} alt="Free Shipping" />
            <h4 className={styles.benefitTitle}>Free Shipping</h4>
            <span className={styles.benefitSub}>*US domestic orders $150+</span>
          </div>

          <div className={styles.benefitItem}>
            <img src="https://fahertybrand.com/cdn/shop/files/Faherty_Shipping_Box_Illustration.png?v=1744913451" className={styles.benefitIcon} alt="Returns & Exchanges" />
            <h4 className={styles.benefitTitle}>Returns &amp; Exchanges</h4>
            <Link href="/" className={styles.benefitLink}>Learn More</Link>
          </div>
          <div className={styles.benefitItem}>
            <img src="https://fahertybrand.com/cdn/shop/files/Faherty_Guarantee_Badge_1A.png?v=1744913580" className={styles.benefitIcon} alt="Guarantee of Quality" />
            <h4 className={styles.benefitTitle}>Guarantee of Quality</h4>
            <Link href="/" className={styles.benefitLink}>Learn More</Link>
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* Column 1: Brand & Intro */}
            <div className={styles.col}>
              <Link href="/" className={styles.brand}>
                <img src="/clothi.png" alt="Clothi Logo" className={styles.brandLogo} />
                <span className={styles.brandText}>CLOTHI</span>
              </Link>
              <p className={styles.introText}>
                Get exclusive updates on the collection launch, personalized communications, and the latest news from Clothi.
              </p>
            </div>

            {/* Column 2: QUICK SHOP */}
            <div className={styles.col}>
              <h4 className={styles.colTitle}>QUICK SHOP</h4>
              <ul className={styles.linkList}>
                <li><Link href="/">Bestsellers</Link></li>
                <li><Link href="/">New Arrivals</Link></li>
                <li><Link href="/">Trending Now</Link></li>
              </ul>
            </div>

            {/* Column 3: HELPFUL LINKS */}
            <div className={styles.col}>
              <h4 className={styles.colTitle}>HELPFUL LINKS</h4>
              <ul className={styles.linkList}>
                <li><Link href="/">About Us</Link></li>
                <li><Link href="/">Our Stores</Link></li>
                <li><Link href="/">Blogs</Link></li>
                <li><Link href="/">Contact Us</Link></li>
                <li><Link href="/">Track Order</Link></li>
                <li><Link href="/">Career</Link></li>
              </ul>
            </div>

            {/* Column 4: MORE */}
            <div className={styles.col}>
              <h4 className={styles.colTitle}>MORE</h4>
              <ul className={styles.linkList}>
                <li><Link href="/">Shipping Policy</Link></li>
                <li><Link href="/">Return & Exchange Policy</Link></li>
                <li><Link href="/">Privacy Policy</Link></li>
                <li><Link href="/">Rewards</Link></li>
              </ul>
            </div>

            {/* Column 5: GET IN TOUCH */}
            <div className={styles.col}>
              <h4 className={styles.colTitle}>GET IN TOUCH</h4>
              <div className={styles.contactItem}>
                <Mail size={18} strokeWidth={1.5} />
                <a href="mailto:support@clothi.com">support@clothi.com</a>
              </div>
              <div className={styles.contactItem}>
                <Phone size={18} strokeWidth={1.5} />
                <a href="tel:+91750373590">+91750373590</a>
              </div>
              <div className={styles.socialRow}>
                <a href="#" className={styles.socialLink}><Instagram size={22} strokeWidth={1.5} /></a>
                <a href="#" className={styles.socialLink}><Linkedin size={22} strokeWidth={1.5} /></a>
                <a href="#" className={styles.socialLink}><Twitter size={22} strokeWidth={1.5} /></a>
                <a href="#" className={styles.socialLink}><Facebook size={22} strokeWidth={1.5} /></a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <div className={styles.bottomInner}>
            <p>© {new Date().getFullYear()} Clothi Clothing Private Limited. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
