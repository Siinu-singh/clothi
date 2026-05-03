// Product API helper for frontend
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function apiFetch(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return fetch(`${API_BASE}/api${endpoint}`, {
    ...options,
    headers,
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
}

// Get all products (public)
export async function getProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/products${query ? `?${query}` : ''}`);
}

// Get single product
export function getProduct(id) {
  return apiFetch(`/products/${id}`);
}

// Get new arrivals (products from last 30 days)
export function getNewArrivals(limit = 10) {
  return apiFetch(`/products?sort=new&limit=${limit}`);
}

// Search products
export function searchProducts(query) {
  return apiFetch(`/products/search?q=${encodeURIComponent(query)}`);
}

// Admin: Create product
export function createProduct(data) {
  return apiFetch('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Admin: Update product
export function updateProduct(id, data) {
  return apiFetch(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Admin: Delete product
export function deleteProduct(id) {
  return apiFetch(`/products/${id}`, {
    method: 'DELETE',
  });
}

// Admin: Bulk import products
export async function bulkImportProducts(products, onProgress) {
  const results = {
    success: 0,
    failed: 0,
    errors: [],
  };

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    try {
      await createProduct(product);
      results.success++;
    } catch (error) {
      results.failed++;
      results.errors.push(`${product.title || 'Unknown'}: ${error.message}`);
    }
    
    if (onProgress) {
      onProgress({
        current: i + 1,
        total: products.length,
        success: results.success,
        failed: results.failed,
      });
    }
  }

  return results;
}