'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import { Plus, Package, TrendingUp, Star, AlertTriangle, DollarSign, Search, Calendar, Upload } from 'lucide-react';
import styles from './AdminProducts.module.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function apiFetch(endpoint: string, options: any = {}) {
  const headers: any = {};
  if (options.body) headers['Content-Type'] = 'application/json';
  if (options.headers) { Object.assign(headers, options.headers); }
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE}/api${endpoint}`, { ...options, headers });
  if (!response.ok) {
    let errorMsg = `HTTP error! status: ${response.status}`;
    try {
      const errData = await response.json();
      if (errData.details && Array.isArray(errData.details)) {
        errorMsg = errData.details.map((d: any) => `${d.path ? d.path.join('.') + ': ' : ''}${d.message}`).join(', ');
      } else {
        errorMsg = errData.message || errData.error || errorMsg;
      }
    } catch (e) {
      // Ignore JSON parse error on error responses
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

async function getProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/products${query ? `?${query}` : ''}`);
}

async function createProductApi(data: any) {
  return apiFetch('/products', { method: 'POST', body: JSON.stringify(data) });
}

async function deleteProductApi(id: string) {
  return apiFetch(`/products/${id}`, { method: 'DELETE' });
}

async function bulkImportProducts(items: any[], onProgress: any) {
  const results = { success: 0, failed: 0, errors: [] as string[] };
  for (let i = 0; i < items.length; i++) {
    try { await createProductApi(items[i]); results.success++; }
    catch (error: any) { results.failed++; results.errors.push(`${items[i].title}: ${error.message}`); }
    if (onProgress) onProgress({ current: i + 1, total: items.length, success: results.success, failed: results.failed });
  }
  return results;
}

async function bulkImportProductsCsv(file: File, onProgress: any) {
  const formData = new FormData();
  formData.append('file', file);

  const headers: any = {};
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}/api/products/bulk-import`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    let errorMsg = `HTTP error! status: ${response.status}`;
    try {
      const errData = await response.json();
      if (errData.details && Array.isArray(errData.details)) {
        errorMsg = errData.details.join(', ');
      } else {
        errorMsg = errData.message || errData.error || errorMsg;
      }
    } catch (e) {
      // Ignore JSON parse error on error responses
    }
    throw new Error(errorMsg);
  }

  const data = await response.json();
  const createdCount = data?.data?.createdCount || 0;
  const updatedCount = data?.data?.updatedCount || 0;
  if (onProgress) onProgress({ current: 1, total: 1, success: createdCount + updatedCount, failed: 0 });
  return data;
}

const MAX_CSV_SIZE_BYTES = 5 * 1024 * 1024;
const REQUIRED_CSV_HEADERS = ['title', 'description', 'price', 'image', 'category', 'colors', 'sizes'];

export default function AdminProductsPage() {
  const { user, loading: authLoading } = useAuth() as any;
  const { toast } = useToast() as any;
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkData, setBulkData] = useState('');
  const [bulkFormat, setBulkFormat] = useState('json');
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, success: 0, failed: 0 });
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => { if (!authLoading && user) loadProducts(); }, [authLoading, user]);

  const loadProducts = async () => {
    try { setLoading(true); const response = await getProducts({ limit: 100 }); setProducts(response.data?.products || response.data || response || []); }
    catch (err: any) { console.error('Failed to load products', err); }
    finally { setLoading(false); }
  };

  const handleDelete = (id: string) => {
    setProductToDelete(id);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try { await deleteProductApi(productToDelete); toast.success('Product deleted'); loadProducts(); }
    catch (err: any) { toast.error(err.message || 'Failed to delete'); }
    finally { setProductToDelete(null); }
  };

  const resetBulkImport = () => {
    setShowBulkModal(false);
    setBulkData('');
    setBulkFile(null);
    setImportProgress({ current: 0, total: 0, success: 0, failed: 0 });
  };

  const handleCsvFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isCsv = file.name.toLowerCase().endsWith('.csv') || file.type.includes('csv');
    if (!isCsv) {
      toast.error('Please select a valid .csv file');
      e.target.value = '';
      setBulkFile(null);
      return;
    }
    if (file.size > MAX_CSV_SIZE_BYTES) {
      toast.error('CSV file is too large (max 5MB)');
      e.target.value = '';
      setBulkFile(null);
      return;
    }
    setBulkFile(file);
  };

  const handleBulkImport = async () => {
    let items: any[] = [];
    try {
      if (bulkFormat === 'json') {
        items = JSON.parse(bulkData);
        if (!Array.isArray(items)) items = [items];
      } else {
        if (!bulkFile) {
          toast.error('Please select a CSV file to import');
          return;
        }
        setImporting(true);
        setImportProgress({ current: 0, total: 1, success: 0, failed: 0 });
        const result = await bulkImportProductsCsv(bulkFile, setImportProgress);
        const createdCount = result?.data?.createdCount || 0;
        const updatedCount = result?.data?.updatedCount || 0;
        toast.success(`CSV import completed. Created ${createdCount}, updated ${updatedCount}`);
        resetBulkImport();
        loadProducts();
        return;
      }
      setImporting(true); setImportProgress({ current: 0, total: items.length, success: 0, failed: 0 });
      const results = await bulkImportProducts(items, setImportProgress);
      toast[results.failed > 0 ? 'warning' : 'success'](`Imported ${results.success}, ${results.failed} failed`);
      resetBulkImport(); loadProducts();
    } catch (err: any) { toast.error('Invalid data: ' + err.message); }
    finally { setImporting(false); }
  };

  const filteredProducts = searchTerm && Array.isArray(products) 
    ? products.filter((p: any) => p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || p.category?.toLowerCase().includes(searchTerm.toLowerCase())) 
    : products;
    
  const stats = { 
    total: Array.isArray(products) ? products.length : 0, 
    active: Array.isArray(products) ? products.filter((p: any) => p.badge === 'new').length : 0, 
    featured: Array.isArray(products) ? products.filter((p: any) => p.badge === 'premium').length : 0, 
    sale: Array.isArray(products) ? products.filter((p: any) => p.badge === 'bestseller').length : 0 
  };

  if (authLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.messageCard}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading products...</p>
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
          <Link href="/login" className="btn-primary">Go to Login</Link>
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
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Premium Header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerContent}>
            <div className={styles.headerTitleGroup}>
              <div className={styles.headerIcon}>
                <Package color="var(--color-white)" size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h1 className={styles.headerTitle}>Products</h1>
                <p className={styles.headerSubtitle}>Manage your products</p>
              </div>
            </div>
            
            <div className={styles.headerActions}>
              <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              
              <button onClick={() => setShowBulkModal(true)} className={styles.bulkBtn}>
                <Upload size={16} />
                <span>Bulk Import</span>
              </button>
              
              <Link href="/admin/products/create" className={styles.newBtn}>
                <Plus size={16} />
                <span>Add Product</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Refined Stats Cards */}
      <div className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {/* Total Products */}
          <div className={styles.statCard}>
            <div className={styles.statCardInner}>
              <div>
                <p className={styles.statLabel}>Total</p>
                <p className={styles.statValue}>{stats.total}</p>
              </div>
              <div className={`${styles.statIconWrapper} ${styles.statIconWrapperDefault}`}>
                <Package className={styles.statIcon} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* New */}
          <div className={styles.statCard}>
            <div className={styles.statCardInner}>
              <div>
            <p className={styles.statLabel}>New</p>
                <p className={styles.statValue} style={{ color: 'var(--color-primary)' }}>{stats.active}</p>
              </div>
              <div className={`${styles.statIconWrapper} ${styles.statIconWrapperDefault}`}>
                <Calendar className={styles.statIcon} style={{ color: 'var(--color-primary)' }} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Premium */}
          <div className={styles.statCard}>
            <div className={styles.statCardInner}>
              <div>
            <p className={styles.statLabel}>Premium</p>
            <p className={styles.statValue} style={{ color: 'var(--color-secondary)' }}>{stats.featured}</p>
              </div>
              <div className={`${styles.statIconWrapper} ${styles.statIconWrapperDefault}`}>
                <Star className={styles.statIcon} style={{ color: 'var(--color-secondary)' }} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Bestseller */}
          <div className={styles.statCard}>
            <div className={styles.statCardInner}>
              <div>
            <p className={styles.statLabel}>Bestseller</p>
            <p className={styles.statValue} style={{ color: '#dc2626' }}>{stats.sale}</p>
              </div>
              <div className={`${styles.statIconWrapper} ${styles.statIconWrapperDefault}`}>
                <TrendingUp className={styles.statIcon} style={{ color: '#dc2626' }} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Total Value */}
          <div className={styles.statCard}>
            <div className={styles.statCardInner}>
              <div>
                <p className={styles.statLabel}>Value</p>
                <p className={`${styles.statValue} ${styles.statValueMoney}`}>
                  ₹{Array.isArray(products) ? products.reduce((s: number, p: any) => s + (p.price || 0), 0).toLocaleString() : 0}
                </p>
              </div>
              <div className={`${styles.statIconWrapper} ${styles.statIconWrapperDefault}`}>
                <DollarSign className={styles.statIcon} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table Container */}
      <div className={styles.tableContainer}>
        <div className={styles.tableCard}>
          {loading ? (
            <div className={styles.emptyState}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingText}>Loading products...</p>
            </div>
          ) : !Array.isArray(filteredProducts) || filteredProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconWrapper}>
                <Package className={styles.emptyIcon} />
              </div>
              <h3 className={styles.emptyTitle}>No products found</h3>
              <p className={styles.emptyDescription}>
                {searchTerm ? "We couldn't find any products matching your search criteria." : "Create your first product."}
              </p>
              {!searchTerm && (
                <Link href="/admin/products/create" className={styles.emptyBtn}>
                  <Plus size={16} /> Add Product
                </Link>
              )}
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Product</th>
                    <th className={styles.th}>Price</th>
                    <th className={styles.th}>Category</th>
                    <th className={styles.th}>Badge</th>
                    <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product: any) => (
                    <tr key={product._id} className={styles.tr}>
                      <td className={styles.td}>
                        <div className={styles.productInfo}>
                          <div className={styles.imageWrapper}>
                            {product.image ? (
                              <img src={product.image} alt={product.title} className={styles.image} />
                            ) : (
                              <div className={styles.imagePlaceholder}>
                                <Package size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className={styles.productTitle}>{product.title}</p>
                            <div className={styles.colorList}>
                              {product.colors?.slice(0,3).map((c: any, i: number) => (
                                <span key={i} className={styles.colorDot} style={{ backgroundColor: c }} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.priceText}>₹{product.price}</span>
                        {product.oldPrice && <span className={styles.oldPriceText}>₹{product.oldPrice}</span>}
                      </td>
                      <td className={styles.td}>
                        <span className={styles.category}>{product.category}</span>
                      </td>
                      <td className={styles.td}>
                        {product.badge ? (
                          <span className={styles.badge} style={{
                            backgroundColor: product.badge === 'new' ? 'rgba(37, 99, 235, 0.1)' : product.badge === 'bestseller' ? 'rgba(220, 38, 38, 0.1)' : product.badge === 'premium' ? 'rgba(202, 138, 4, 0.1)' : 'rgba(147, 51, 234, 0.1)',
                            color: product.badge === 'new' ? '#2563eb' : product.badge === 'bestseller' ? '#dc2626' : product.badge === 'premium' ? '#ca8a04' : '#9333ea',
                            borderColor: product.badge === 'new' ? 'rgba(37, 99, 235, 0.2)' : product.badge === 'bestseller' ? 'rgba(220, 38, 38, 0.2)' : product.badge === 'premium' ? 'rgba(202, 138, 4, 0.2)' : 'rgba(147, 51, 234, 0.2)',
                          }}>
                            {product.badge}
                          </span>
                        ) : '-'}
                      </td>
                      <td className={styles.td}>
                        <div className={styles.actions}>
                          <Link href={`/admin/products/${product._id}/edit`} className={`${styles.actionBtn} ${styles.editBtn}`}>
                            Edit
                          </Link>
                          <button onClick={() => handleDelete(product._id)} className={`${styles.actionBtn} ${styles.deleteBtn}`}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showBulkModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Bulk Import</h2>
              <button onClick={() => setShowBulkModal(false)} className={styles.closeBtn}>&times;</button>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Format</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input type="radio" checked={bulkFormat==='json'} onChange={()=>setBulkFormat('json')}/>
                  <span>JSON</span>
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" checked={bulkFormat==='csv'} onChange={()=>setBulkFormat('csv')}/>
                  <span>CSV</span>
                </label>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>{bulkFormat === 'json' ? 'JSON Data' : 'CSV File'}</label>
              {bulkFormat === 'json' ? (
                <textarea 
                  value={bulkData} 
                  onChange={(e) => setBulkData(e.target.value)} 
                  placeholder='[{"title":"Product","description":"Soft cotton tee","price":999,"image":"https://...","category":"POLO","colors":["Red"],"sizes":["M"]},...]'
                  className={styles.textarea}
                />
              ) : (
                <>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleCsvFileChange}
                  />
                  <p style={{ marginTop: '0.5rem', color: 'var(--color-dark-gray)', fontSize: '0.85rem' }}>
                    Required headers: {REQUIRED_CSV_HEADERS.join(', ')}. Use | for list fields (colors, sizes, images).
                  </p>
                </>
              )}
            </div>
            
            {importing && (
              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }} />
                </div>
                <p className={styles.progressText}>
                  {importProgress.current}/{importProgress.total} - Success: {importProgress.success} Failed: {importProgress.failed}
                </p>
              </div>
            )}
            
            <div className={styles.modalActions}>
              <button onClick={resetBulkImport} className={styles.cancelBtn}>
                Cancel
              </button>
              <button 
                onClick={handleBulkImport} 
                disabled={importing || (bulkFormat === 'json' ? !bulkData.trim() : !bulkFile)} 
                className={styles.importBtn}
              >
                {importing ? 'Importing...' : 'Import'}
              </button>
            </div>
          </div>
        </div>
      )}

      {productToDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Delete Product</h2>
              <button onClick={() => setProductToDelete(null)} className={styles.closeBtn}>&times;</button>
            </div>
            <div className={styles.formGroup}>
              <p style={{ margin: 0, color: 'var(--color-dark-gray)' }}>Are you sure you want to delete this product? This action cannot be undone.</p>
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => setProductToDelete(null)} className={styles.cancelBtn}>
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                className={styles.deleteBtn}
                style={{ padding: '0.5rem 1rem', borderRadius: '4px' }}
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
