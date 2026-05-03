'use client';
import { ChevronDown, X, Filter, ArrowUpDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import styles from './FilterBar.module.css';

export default function FilterBar({
  categories,
  sizes,
  selectedCategory,
  selectedSize,
  sortBy,
  onCategoryChange,
  onSizeChange,
  onSortChange,
  onClearAll,
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const hasActiveFilters = selectedCategory || selectedSize;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const getSortLabel = (val) => {
    if (val === 'newest') return 'Newest Arrivals';
    if (val === 'price') return 'Price: Low to High';
    if (val === 'popular') return 'Popular';
    return 'Relevance';
  };

  return (
    <div className={styles.filterContainer} ref={dropdownRef}>
      {/* --- DESKTOP FILTER BAR --- */}
      <div className={styles.desktopFilterBar}>
        <div className={styles.dropdownGroup}>
          <div className={styles.productCountWrapper}>
             <span className={styles.productCountText}>FILTERS</span>
          </div>
          {/* Size Dropdown */}
          <div className={styles.dropdownWrapper}>
            <button 
              className={`${styles.dropdownTrigger} ${selectedSize ? styles.hasSelection : ''}`}
              onClick={() => toggleDropdown('size')}
            >
              Size {selectedSize ? `: ${selectedSize}` : ''}
              <ChevronDown size={14} className={openDropdown === 'size' ? styles.rotateIcon : ''} />
            </button>
            
            {openDropdown === 'size' && (
              <div className={styles.dropdownMenu}>
                {sizes.map((s) => (
                  <button
                    key={s}
                    className={`${styles.dropdownItem} ${selectedSize === s ? styles.selectedItem : ''}`}
                    onClick={() => {
                      onSizeChange(selectedSize === s ? '' : s);
                      setOpenDropdown(null);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Dropdown */}
          <div className={styles.dropdownWrapper}>
            <button 
              className={`${styles.dropdownTrigger} ${selectedCategory ? styles.hasSelection : ''}`}
              onClick={() => toggleDropdown('category')}
            >
              Category {selectedCategory ? `: ${selectedCategory}` : ''}
              <ChevronDown size={14} className={openDropdown === 'category' ? styles.rotateIcon : ''} />
            </button>
            
            {openDropdown === 'category' && (
              <div className={styles.dropdownMenu}>
                {categories.map((cat) => (
                  <button
                    key={cat || 'all'}
                    className={`${styles.dropdownItem} ${selectedCategory === cat ? styles.selectedItem : ''}`}
                    onClick={() => {
                      onCategoryChange(cat);
                      setOpenDropdown(null);
                    }}
                  >
                    {cat || 'All'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {hasActiveFilters && (
            <button className={styles.clearDesktopBtn} onClick={onClearAll}>
              Clear All
            </button>
          )}
        </div>

        {/* Sort Align Right */}
        <div className={styles.dropdownWrapper}>
          <button 
            className={styles.dropdownTrigger}
            onClick={() => toggleDropdown('sort')}
          >
             <ArrowUpDown size={14} /> Sort: {getSortLabel(sortBy)}
          </button>
          
          {openDropdown === 'sort' && (
            <div className={`${styles.dropdownMenu} ${styles.dropdownMenuRight}`}>
              {['newest', 'price', 'popular'].map((opt) => (
                <button
                  key={opt}
                  className={`${styles.dropdownItem} ${sortBy === opt ? styles.selectedItem : ''}`}
                  onClick={() => {
                    onSortChange(opt);
                    setOpenDropdown(null);
                  }}
                >
                  {getSortLabel(opt)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- MOBILE FILTER STRIP --- */}
      <div className={styles.mobileFilterStrip}>
        <div className={styles.productCountMobile}>
           FILTERS
        </div>
        <div className={styles.mobileActions}>
          <button className={styles.mobileStripBtn} onClick={() => toggleDropdown('sortMobile')}>
             <ArrowUpDown size={15} /> Sort
          </button>
          <div className={styles.divider}></div>
          <button className={styles.mobileStripBtn} onClick={() => setIsMobileOpen(true)}>
             <Filter size={15} /> Filter {hasActiveFilters && <span className={styles.dot}></span>}
          </button>
        </div>
      </div>
      
      {/* Mobile Sort Dropdown absolute to strip */}
      {openDropdown === 'sortMobile' && (
        <div className={styles.mobileSortDropdown}>
           {['newest', 'price', 'popular'].map((opt) => (
              <button
                key={opt}
                className={`${styles.dropdownItem} ${sortBy === opt ? styles.selectedItem : ''}`}
                onClick={() => {
                  onSortChange(opt);
                  setOpenDropdown(null);
                }}
              >
                {getSortLabel(opt)}
              </button>
            ))}
        </div>
      )}

      {/* --- MOBILE BOTTOM SHEET MODAL --- */}
      {isMobileOpen && (
        <>
          <div className={styles.mobileOverlay} onClick={() => setIsMobileOpen(false)} />
          <div className={styles.bottomSheet}>
            <div className={styles.sheetHeader}>
              <div className={styles.sheetHeaderTop}>
                <h2>Filters {hasActiveFilters && `(${(selectedCategory ? 1 : 0) + (selectedSize ? 1 : 0)})`}</h2>
                <button onClick={() => setIsMobileOpen(false)}><X size={24} /></button>
              </div>
            </div>
            
            <div className={styles.sheetContent}>
              {/* Category */}
              <div className={styles.sheetSection}>
                <h3>Category</h3>
                <div className={styles.chipRow}>
                  {categories.map((cat) => (
                    <button
                      key={cat || 'all'}
                      className={`${styles.chip} ${selectedCategory === cat ? styles.chipSelected : ''}`}
                      onClick={() => onCategoryChange(cat)}
                    >
                      {cat || 'All'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className={styles.sheetSection}>
                <h3>Size</h3>
                <div className={styles.chipRow}>
                  {sizes.map((s) => (
                    <button
                      key={s}
                      className={`${styles.chip} ${selectedSize === s ? styles.chipSelected : ''}`}
                      onClick={() => onSizeChange(selectedSize === s ? '' : s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.sheetFooter}>
              <button className={styles.resetBtn} onClick={() => {
                onClearAll();
                setIsMobileOpen(false);
              }}>
                CLEAR ALL
              </button>
              <button className={styles.applyBtn} onClick={() => setIsMobileOpen(false)}>
                SHOW RESULTS
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
