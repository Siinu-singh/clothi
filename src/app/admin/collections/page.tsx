'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCollection } from '@/context/CollectionContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import { Plus, Package, TrendingUp, Star, AlertTriangle, DollarSign, Search, LayoutGrid } from 'lucide-react';
import CollectionList from '@/components/admin/CollectionList';
import styles from './AdminCollections.module.css';

export default function AdminCollectionsPage() {
  const { user, loading: authLoading } = useAuth() as any;
  const {
    collections,
    loading,
    loadCollections,
    handleDeleteCollection,
    handleToggleFeatured,
    handleToggleActive,
    stats,
    loadStats,
    error,
  } = useCollection() as any;
  const { toast } = useToast() as any;
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      loadCollections(page);
      loadStats();
    }
  }, [page, authLoading, user, loadCollections, loadStats]);

  // Filter collections by search
  const filteredCollections = searchTerm 
    ? collections?.filter((c: any) => 
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : collections;

  if (authLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.messageCard}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.unauthorizedContainer}>
        <div className={styles.messageCard}>
          <div className={styles.iconWrapper}>
            <Package className={styles.icon} />
          </div>
          <h2 className={styles.title}>Login Required</h2>
          <p className={styles.description}>You must be logged in to access this page.</p>
          <Link href="/login" className="btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className={styles.unauthorizedContainer}>
        <div className={styles.messageCard}>
          <div className={styles.iconWrapper}>
            <AlertTriangle className={styles.iconPrimary} />
          </div>
          <h2 className={styles.title}>Access Denied</h2>
          <p className={styles.description}>Your account does not have admin permissions.</p>
          <p className={styles.loadingText}>Please contact the administrator to request access.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.messageCard}>
          <div className={styles.iconWrapperPrimary}>
            <AlertTriangle className={styles.iconPrimary} />
          </div>
          <h2 className={styles.title}>Access Error</h2>
          <p className={styles.description}>{error}</p>
          <div className={styles.actionButtons}>
            <Link href="/login" className="btn-primary">
              Go to Login
            </Link>
            <button onClick={() => loadStats()} className="btn-outline">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      await handleDeleteCollection(id);
      toast.success('Collection deleted successfully');
    } catch (err) {
      toast.error('Failed to delete collection');
    }
  };

  const handleToggleFeaturedClick = async (id: string, featured: boolean) => {
    try {
      await handleToggleFeatured(id, !featured);
      toast.success(`Collection ${!featured ? 'featured' : 'unfeatured'}`);
    } catch (err) {
      toast.error('Failed to update collection');
    }
  };

  const handleToggleActiveClick = async (id: string, active: boolean) => {
    try {
      await handleToggleActive(id, !active);
      toast.success(`Collection ${!active ? 'activated' : 'deactivated'}`);
    } catch (err) {
      toast.error('Failed to update collection');
    }
  };

  return (
    <div className={styles.page}>
      {/* Premium Header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerContent}>
            <div className={styles.headerTitleGroup}>
              <div className={styles.headerIcon}>
                <LayoutGrid color="var(--color-white)" size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h1 className={styles.headerTitle}>Collections</h1>
                <p className={styles.headerSubtitle}>Manage and organize your product categories</p>
              </div>
            </div>
            
            <div className={styles.headerActions}>
              <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search collections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              
              <Link href="/admin/collections/create" className={styles.newBtn}>
                <Plus size={16} />
                <span>New Collection</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Refined Stats Cards */}
      <div className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {/* Total Collections */}
          <div className={styles.statCard}>
            <div className={styles.statCardInner}>
              <div>
                <p className={styles.statLabel}>Total</p>
                <p className={styles.statValue}>{stats?.totalCollections || 0}</p>
              </div>
              <div className={`${styles.statIconWrapper} ${styles.statIconWrapperDefault}`}>
                <Package className={`${styles.statIcon} ${styles.statIconDefault}`} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Active */}
          <div className={styles.statCard}>
            <div className={styles.statCardInner}>
              <div>
                <p className={styles.statLabel}>Active</p>
                <p className={`${styles.statValue} ${styles.statValueActive}`}>{stats?.activeCollections || 0}</p>
              </div>
              <div className={`${styles.statIconWrapper} ${styles.statIconWrapperActive}`}>
                <TrendingUp className={`${styles.statIcon} ${styles.statIconActive}`} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Featured */}
          <div className={styles.statCard}>
            <div className={styles.statCardInner}>
              <div>
                <p className={styles.statLabel}>Featured</p>
                <p className={`${styles.statValue} ${styles.statValueFeatured}`}>{stats?.featuredCollections || 0}</p>
              </div>
              <div className={`${styles.statIconWrapper} ${styles.statIconWrapperDefault}`}>
                <Star className={`${styles.statIcon} ${styles.statIconFeatured}`} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Low Stock */}
          <div className={styles.statCard}>
            <div className={styles.statCardInner}>
              <div>
                <p className={styles.statLabel}>Low Stock</p>
                <p className={`${styles.statValue} ${styles.statValueLowStock}`}>{stats?.lowStockCollections || 0}</p>
              </div>
              <div className={`${styles.statIconWrapper} ${styles.statIconWrapperLowStock}`}>
                <AlertTriangle className={`${styles.statIcon} ${styles.statIconLowStock}`} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Total Value */}
          <div className={styles.statCard}>
            <div className={styles.statCardInner}>
              <div>
                <p className={styles.statLabel}>Value</p>
                <p className={`${styles.statValue} ${styles.statValueMoney}`}>₹{Math.round(stats?.totalInventoryValue || 0).toLocaleString()}</p>
              </div>
              <div className={`${styles.statIconWrapper} ${styles.statIconWrapperDefault}`}>
                <DollarSign className={`${styles.statIcon} ${styles.statIconDefault}`} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collections Table Container */}
      <div className={styles.tableContainer}>
        <div className={styles.tableCard}>
          {loading ? (
            <div className={styles.emptyState}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingText}>Loading collections...</p>
            </div>
          ) : filteredCollections?.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconWrapper}>
                <Package className={styles.emptyIcon} />
              </div>
              <h3 className={styles.emptyTitle}>No collections found</h3>
              <p className={styles.emptyDescription}>
                {searchTerm ? "We couldn't find any collections matching your search criteria." : "Get started by creating your first product collection to showcase in your store."}
              </p>
              {!searchTerm && (
                <Link href="/admin/collections/create" className={styles.emptyBtn}>
                  Create Collection
                </Link>
              )}
            </div>
          ) : (
            <CollectionList
              collections={filteredCollections}
              loading={loading}
              onDelete={handleDelete}
              onToggleFeatured={handleToggleFeaturedClick}
              onToggleActive={handleToggleActiveClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}