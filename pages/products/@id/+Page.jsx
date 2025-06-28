import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../components/AuthContext'
import Layout from '../../../components/Layout'

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#3498db',
    textDecoration: 'none',
    marginBottom: '2rem',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'color 0.2s'
  },
  productContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    marginBottom: '3rem'
  },
  imageSection: {
    position: 'relative'
  },
  productImage: {
    width: '100%',
    height: '500px',
    objectFit: 'cover',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid #e1e8ed'
  },
  imagePlaceholder: {
    width: '100%',
    height: '500px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    color: '#6c757d',
    border: '2px dashed #dee2e6'
  },
  productInfo: {
    padding: '1rem 0'
  },
  productName: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '1rem',
    lineHeight: '1.2'
  },
  price: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: '1.5rem'
  },
  description: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#555',
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e9ecef'
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '2rem'
  },
  detailItem: {
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  detailLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#6c757d',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '0.5rem'
  },
  detailValue: {
    fontSize: '1.1rem',
    fontWeight: '500',
    color: '#2c3e50'
  },
  stockBadge: {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  stockInStock: {
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb'
  },
  stockLowStock: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    border: '1px solid #ffeaa7'
  },
  stockOutOfStock: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb'
  },
  actionButtons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem'
  },
  editButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#6c757d'
  },
  error: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#e74c3c',
    backgroundColor: '#f8d7da',
    borderRadius: '8px',
    border: '1px solid #f5c6cb'
  }
}

export default function ProductDetailPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [productId, setProductId] = useState('')

  useEffect(() => {
    // Get product ID from URL on client side
    if (typeof window !== 'undefined') {
      const id = window.location.pathname.split('/').pop()
      setProductId(id)
    }
  }, [])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      return
    }

    if (isAuthenticated && productId) {
      fetchProduct()
    }
  }, [isAuthenticated, authLoading, productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch(`/api/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        setProduct(data.data.product)
      } else {
        setError(data.message || 'Failed to fetch product')
      }
    } catch (err) {
      console.error('Error fetching product:', err)
      setError('Failed to fetch product')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        alert('Product deleted successfully!')
        if (typeof window !== 'undefined') {
          window.location.href = '/products'
        }
      } else {
        alert(data.message || 'Failed to delete product')
      }
    } catch (err) {
      console.error('Error deleting product:', err)
      alert('Failed to delete product')
    }
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', style: styles.stockOutOfStock }
    if (stock <= 10) return { text: 'Low Stock', style: styles.stockLowStock }
    return { text: 'In Stock', style: styles.stockInStock }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (authLoading || loading) {
    return (
      <Layout>
        <div style={styles.loading}>
          <div>🔄 Loading product details...</div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div style={styles.container}>
          <a href="/products" style={styles.backButton}>
            ← Back to Products
          </a>
          <div style={styles.error}>
            ❌ {error}
          </div>
        </div>
      </Layout>
    )
  }

  if (!product) {
    return (
      <Layout>
        <div style={styles.container}>
          <a href="/products" style={styles.backButton}>
            ← Back to Products
          </a>
          <div style={styles.error}>
            Product not found
          </div>
        </div>
      </Layout>
    )
  }

  const stockStatus = getStockStatus(product.stock)

  return (
    <Layout>
      <div style={styles.container}>
        <a href="/products" style={styles.backButton}>
          ← Back to Products
        </a>

        <div style={styles.productContainer}>
          {/* Product Image */}
          <div style={styles.imageSection}>
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name}
                style={styles.productImage}
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
            ) : null}
            <div style={{
              ...styles.imagePlaceholder,
              display: product.image ? 'none' : 'flex'
            }}>
              📦
            </div>
          </div>

          {/* Product Information */}
          <div style={styles.productInfo}>
            <h1 style={styles.productName}>{product.name}</h1>
            <div style={styles.price}>${product.price?.toFixed(2)}</div>
            
            <div style={styles.description}>
              {product.description}
            </div>

            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Category</div>
                <div style={styles.detailValue}>{product.category || 'Uncategorized'}</div>
              </div>

              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>SKU</div>
                <div style={styles.detailValue}>{product.sku || 'N/A'}</div>
              </div>

              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Stock</div>
                <div style={styles.detailValue}>
                  {product.stock} units
                  <div style={{...styles.stockBadge, ...stockStatus.style, marginTop: '0.5rem'}}>
                    {stockStatus.text}
                  </div>
                </div>
              </div>

              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>Created</div>
                <div style={styles.detailValue}>{formatDate(product.createdAt)}</div>
              </div>
            </div>

            <div style={styles.actionButtons}>
              <button 
                onClick={handleDelete}
                style={styles.deleteButton}
              >
                🗑️ Delete Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}