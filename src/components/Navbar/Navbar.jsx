'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Heart, User, ShoppingBag, LogOut, Package, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import CartDropdown from '../CartDropdown/CartDropdown';
import SearchDropdown from '../SearchDropdown/SearchDropdown';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef(null);
  const cartDropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
  const { user, logout, loading } = useAuth();
  const { cart } = useCart();
  const { favorites } = useFavorites();
  const router = useRouter();

  // Calculate cart item count
  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const favoritesCount = favorites?.length || 0;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target)) {
        setCartDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle scroll for navbar transparency effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    router.push('/');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return '';
    const name = user.name || user.email || '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <nav
      className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}
      onMouseLeave={() => setActiveMenu(null)}
    >
       <div className={styles.inner}>
          <div className={styles.left}>
            <Link href="/" className={styles.brand}>
              <img src="/Logo.png" alt="Clothi Logo" className={styles.logo} />
              <span>CLOTHI</span>
            </Link>
            <ul className={styles.navLinks}>
              <li><Link href="/catalog" className={`${styles.navLink} ${isScrolled ? styles.navLinkScrolled : ''}`}>SHOP ALL</Link></li>
              <li><Link href="/collections" className={`${styles.navLink} ${isScrolled ? styles.navLinkScrolled : ''}`}>COLLECTIONS</Link></li>
              <li><Link href="/catalog?category=POLO" className={`${styles.navLink} ${isScrolled ? styles.navLinkScrolled : ''}`}>POLO</Link></li>
              <li><Link href="/catalog?category=OVERSIZE" className={`${styles.navLink} ${isScrolled ? styles.navLinkScrolled : ''}`}>OVERSIZE</Link></li>
              <li><Link href="/catalog?category=CASUAL" className={`${styles.navLink} ${isScrolled ? styles.navLinkScrolled : ''}`}>CASUAL</Link></li>
              <li><Link href="/catalog?category=DRY-FIT" className={`${styles.navLink} ${isScrolled ? styles.navLinkScrolled : ''}`}>DRY-FIT</Link></li>
            </ul>
          </div>
        <div className={styles.right}>
          <div className={styles.searchContainer} ref={searchContainerRef}>
            <div 
              className={`${styles.searchBox} ${searchOpen ? styles.searchBoxActive : ''}`}
            >
              <Search size={16} strokeWidth={1.5} color="var(--color-outline)" />
              <input 
                 className={styles.searchInput} 
                 type="text" 
                 placeholder="Search" 
                 onFocus={() => setSearchOpen(true)}
               />
            </div>
            <SearchDropdown isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
          </div>
          
          {/* Favorites Button */}
          <Link href="/favorites" className={styles.iconBtn}>
            <Heart size={20} strokeWidth={1.5} />
            {favoritesCount > 0 && (
              <span className={styles.badge}>{favoritesCount}</span>
            )}
          </Link>

          {/* User Menu */}
          {loading ? (
            <div className={styles.iconBtn}>
              <div className={styles.avatarSkeleton} />
            </div>
          ) : user ? (
            <div className={styles.userMenuWrap} ref={userMenuRef}>
              <button 
                className={styles.avatarBtn}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className={styles.avatarImg} />
                ) : (
                  <span className={styles.avatarInitials}>{getUserInitials()}</span>
                )}
              </button>
              
              {userMenuOpen && (
                <div className={styles.userDropdown}>
                  <div className={styles.userDropdownHeader}>
                    <p className={styles.userName}>{user.name || 'User'}</p>
                    <p className={styles.userEmail}>{user.email}</p>
                  </div>
                   <div className={styles.userDropdownDivider} />
                   <Link 
                     href="/orders" 
                     className={styles.userDropdownItem}
                     onClick={() => setUserMenuOpen(false)}
                   >
                     <Package size={16} strokeWidth={1.5} />
                     <span>My Orders</span>
                   </Link>
{user.role === 'admin' && (
                      <>
                        <Link 
                          href="/admin/products" 
                          className={styles.userDropdownItem}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Package size={16} strokeWidth={1.5} />
                          <span>Manage Products</span>
                        </Link>
                        <Link 
                          href="/admin/collections" 
                          className={styles.userDropdownItem}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Package size={16} strokeWidth={1.5} />
                          <span>Manage Collections</span>
                        </Link>
                      </>
                    )}
                   <Link 
                     href="/account" 
                     className={styles.userDropdownItem}
                     onClick={() => setUserMenuOpen(false)}
                   >
                     <Settings size={16} strokeWidth={1.5} />
                     <span>Account Settings</span>
                   </Link>
                  <div className={styles.userDropdownDivider} />
                  <button 
                    className={styles.userDropdownItem}
                    onClick={handleLogout}
                  >
                    <LogOut size={16} strokeWidth={1.5} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className={styles.iconBtn}>
              <User size={20} strokeWidth={1.5} />
            </Link>
          )}

          {/* Cart Button with Dropdown */}
          <div className={styles.cartMenuWrap} ref={cartDropdownRef}>
            <button 
              className={styles.iconBtn}
              onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
              aria-expanded={cartDropdownOpen}
              aria-haspopup="true"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartItemCount > 0 && (
                <span className={styles.badge}>{cartItemCount}</span>
              )}
            </button>
            <CartDropdown 
              isOpen={cartDropdownOpen} 
              onClose={() => setCartDropdownOpen(false)} 
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
