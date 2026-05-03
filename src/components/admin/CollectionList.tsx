'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Eye, MoreVertical } from 'lucide-react';
import styles from './CollectionList.module.css';

interface CollectionListProps {
  collections: any[];
  loading?: boolean;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

export default function CollectionList({
  collections,
  onDelete,
  onToggleFeatured,
  onToggleActive,
}: CollectionListProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    if (openDropdownId === id) {
      setOpenDropdownId(null);
      setDeleteConfirmId(null);
    } else {
      setOpenDropdownId(id);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Collection</th>
            <th className={styles.th}>Products</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Visibility</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {collections.map((collection) => (
            <tr key={collection._id} className={styles.tr}>
              <td className={styles.td}>
                <div className={styles.collectionInfo}>
                  <div className={styles.imageWrapper}>
                    {collection.imageUrl ? (
                      <img
                        src={collection.imageUrl}
                        alt={collection.name}
                        className={styles.image}
                      />
                    ) : (
                      <div className={styles.imagePlaceholder}>
                        <Eye className={styles.iconSmall} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className={styles.collectionName}>{collection.name}</h3>
                    <p className={styles.collectionDescription}>{collection.description || 'No description provided'}</p>
                    {collection.category && (
                      <div style={{ marginTop: '0.25rem' }}>
                        <span className={styles.category}>{collection.category}</span>
                      </div>
                    )}
                  </div>
                </div>
              </td>
              
              <td className={styles.td}>
                <div className={styles.productCount}>
                  <span>{collection.products?.length || 0}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-on-surface-variant)' }}>Items</span>
                </div>
              </td>
              
              <td className={styles.td}>
                <button
                  onClick={() => onToggleActive(collection._id, collection.isActive)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
                >
                  <span className={`${styles.badge} ${collection.isActive ? styles.badgeActive : styles.badgeInactive}`}>
                    <span className={`${styles.statusDot} ${collection.isActive ? styles.statusDotActive : styles.statusDotInactive}`}></span>
                    {collection.isActive ? 'Active' : 'Draft'}
                  </span>
                </button>
              </td>
              
              <td className={styles.td}>
                <button
                  onClick={() => onToggleFeatured(collection._id, collection.isFeatured)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
                >
                  <span className={`${styles.badge} ${collection.isFeatured ? styles.badgeFeatured : styles.badgeNotFeatured}`}>
                    {collection.isFeatured ? 'Featured' : 'Standard'}
                  </span>
                </button>
              </td>
              
              <td className={styles.td}>
                <div className={styles.actions}>
                  <Link
                    href={`/collections/${collection.slug}`}
                    target="_blank"
                    className={styles.actionBtn}
                    title="View Collection"
                  >
                    <Eye size={18} strokeWidth={1.5} />
                  </Link>
                  
                  <Link
                    href={`/admin/collections/${collection._id}/edit`}
                    className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                    title="Edit Collection"
                  >
                    <Edit size={18} strokeWidth={1.5} />
                  </Link>
                  
                  <div className={styles.dropdownWrapper}>
                    <button
                      onClick={() => toggleDropdown(collection._id)}
                      className={styles.actionBtn}
                    >
                      <MoreVertical size={18} strokeWidth={1.5} />
                    </button>
                    
                    {openDropdownId === collection._id && (
                      <div className={styles.dropdownMenu}>
                        {deleteConfirmId === collection._id ? (
                          <div>
                            <p className={styles.dropdownTitle}>Delete Collection?</p>
                            <p className={styles.dropdownText}>This action cannot be undone.</p>
                            <div className={styles.dropdownActions}>
                              <button
                                onClick={() => {
                                  onDelete(collection._id);
                                  setOpenDropdownId(null);
                                  setDeleteConfirmId(null);
                                }}
                                className={styles.confirmDeleteBtn}
                              >
                                Yes, Delete
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className={styles.cancelDeleteBtn}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(collection._id)}
                            className={styles.actionBtn}
                            style={{ width: '100%', justifyContent: 'flex-start', gap: '0.5rem', color: '#dc2626' }}
                          >
                            <Trash2 size={16} strokeWidth={1.5} />
                            <span>Delete Collection</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}