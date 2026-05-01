import React, { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts } from '../utils/api';
import { useCart } from '../context/CartContext';

const CATEGORIES = ['', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty'];
const CATEGORY_ICONS = { Electronics: '📱', Clothing: '👕', Books: '📚', Home: '🏠', Sports: '⚽', Beauty: '💄' };
const SORTS = [['newest', '🕐 Newest'], ['price-asc', '💰 Price: Low → High'], ['price-desc', '💸 Price: High → Low'], ['rating', '⭐ Top Rated']];

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCart();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(total / 12);

  useEffect(() => {
    setLoading(true);
    getProducts({ category, search, sort, page, limit: 12 })
      .then((res) => { setProducts(res.data.products); setTotal(res.data.total); })
      .finally(() => setLoading(false));
  }, [category, search, sort, page]);

  const setParam = useCallback((key, value) => {
    const p = new URLSearchParams(searchParams);
    p.set(key, value);
    if (key !== 'page') p.set('page', '1');
    setSearchParams(p);
  }, [searchParams, setSearchParams]);

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    setAddingId(productId);
    await addItem(productId);
    setTimeout(() => setAddingId(null), 1000);
  };

  return (
    <div style={styles.pageWrapper}>
      {/* ── Page Header ── */}
      <div style={styles.pageHeader}>
        <div style={styles.pageHeaderInner}>
          <h1 style={styles.pageTitle}>
            {category ? `${CATEGORY_ICONS[category] || '🛍️'} ${category}` : '🛍️ All Products'}
          </h1>
          <p style={styles.pageSubtitle}>{total} products found</p>
        </div>
      </div>

      {/* Mobile Filter Button */}
      {isMobile && (
        <div style={styles.mobileFilterBar}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={styles.mobileFilterBtn}>
            🔧 Filters & Sort {sidebarOpen ? '▲' : '▼'}
          </button>
          {(category || search) && (
            <button onClick={() => setSearchParams({})} style={styles.mobileClearBtn}>✕ Clear</button>
          )}
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 98 }}
        />
      )}

      <div style={{ ...styles.wrapper, flexDirection: isMobile ? 'column' : 'row' }}>
        {/* ── Sidebar ── */}
        {(!isMobile || sidebarOpen) && (
        <aside style={{
          ...styles.sidebar,
          width: isMobile ? '280px' : '230px',
          position: isMobile ? 'fixed' : 'sticky',
          top: isMobile ? 0 : '1rem',
          left: isMobile ? 0 : 'auto',
          height: isMobile ? '100vh' : 'auto',
          overflowY: isMobile ? 'auto' : 'visible',
          zIndex: isMobile ? 99 : 'auto',
          background: '#fff',
          padding: isMobile ? '1.5rem' : '0',
          boxShadow: isMobile ? '4px 0 20px rgba(0,0,0,0.15)' : 'none',
        }}>
          {/* Search */}
          <div style={styles.searchBox}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setParam('search', e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {/* Categories */}
          <div style={styles.filterSection}>
            <h3 style={styles.filterTitle}>Categories</h3>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setParam('category', cat); if(isMobile) setSidebarOpen(false); }}
                style={{ ...styles.filterBtn, ...(category === cat ? styles.filterBtnActive : {}) }}
              >
                <span>{cat ? CATEGORY_ICONS[cat] : '🏠'}</span>
                <span>{cat || 'All Products'}</span>
                {category === cat && <span style={styles.filterCheck}>✓</span>}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div style={styles.filterSection}>
            <h3 style={styles.filterTitle}>Sort By</h3>
            {SORTS.map(([val, label]) => (
              <button
                key={val}
                onClick={() => { setParam('sort', val); if(isMobile) setSidebarOpen(false); }}
                style={{ ...styles.filterBtn, ...(sort === val ? styles.filterBtnActive : {}) }}
              >
                <span>{label}</span>
                {sort === val && <span style={styles.filterCheck}>✓</span>}
              </button>
            ))}
          </div>

          {(category || search || sort !== 'newest') && (
            <button onClick={() => { setSearchParams({}); setSidebarOpen(false); }} style={styles.clearBtn}>
              ✕ Clear All Filters
            </button>
          )}
        </aside>
        )}

        {/* ── Main Content ── */}
        <main style={styles.main}>
          {/* Active filters chips */}
          {(category || search) && (
            <div style={styles.activeFilters}>
              {category && (
                <span style={styles.chip}>
                  {CATEGORY_ICONS[category]} {category}
                  <button onClick={() => setParam('category', '')} style={styles.chipClose}>✕</button>
                </span>
              )}
              {search && (
                <span style={styles.chip}>
                  🔍 "{search}"
                  <button onClick={() => setParam('search', '')} style={styles.chipClose}>✕</button>
                </span>
              )}
            </div>
          )}

          {/* Loading skeletons */}
          {loading ? (
            <div style={styles.grid}>
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <EmptyState onClear={() => setSearchParams({})} />
          ) : (
            <div style={styles.grid}>
              {products.map((p, i) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  delay={i * 60}
                  isAdding={addingId === p._id}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                onClick={() => setParam('page', page - 1)}
                disabled={page === 1}
                style={{ ...styles.pageBtn, opacity: page === 1 ? 0.4 : 1 }}
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setParam('page', p)}
                  style={{ ...styles.pageBtn, ...(page === p ? styles.pageBtnActive : {}) }}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setParam('page', page + 1)}
                disabled={page === totalPages}
                style={{ ...styles.pageBtn, opacity: page === totalPages ? 0.4 : 1 }}
              >
                Next →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

/* ── Product Card ── */
const ProductCard = ({ product: p, delay, isAdding, onAddToCart }) => {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), delay); }, [delay]);

  const discount = p.discountPrice > p.price
    ? Math.round(((p.discountPrice - p.price) / p.discountPrice) * 100) : null;

  return (
    <div
      style={{
        ...styles.card,
        opacity: mounted ? 1 : 0,
        transform: mounted ? (hovered ? 'translateY(-6px)' : 'translateY(0)') : 'translateY(20px)',
        transition: 'all 0.3s ease',
        boxShadow: hovered ? '0 16px 40px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.05)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/products/${p._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {/* Image */}
        <div style={styles.imgBox}>
          {p.images?.[0]
            ? <img src={p.images[0]} alt={p.name} style={{ ...styles.img, transform: hovered ? 'scale(1.07)' : 'scale(1)', transition: 'transform 0.4s ease' }} />
            : <div style={styles.placeholder}>📦</div>
          }
          {discount && <div style={styles.discountBadge}>{discount}% OFF</div>}
          {p.stock === 0 && <div style={styles.outOfStockOverlay}>Out of Stock</div>}
          {p.isFeatured && <div style={styles.featuredBadge}>⭐</div>}
        </div>

        {/* Info */}
        <div style={styles.cardBody}>
          <p style={styles.cardCategory}>{CATEGORY_ICONS[p.category]} {p.category}</p>
          <p style={styles.cardName}>{p.name}</p>
          <div style={styles.priceRow}>
            <span style={styles.price}>₹{p.price.toLocaleString()}</span>
            {p.discountPrice > p.price && (
              <span style={styles.originalPrice}>₹{p.discountPrice.toLocaleString()}</span>
            )}
          </div>
          <div style={styles.ratingRow}>
            <span style={styles.stars}>{'★'.repeat(Math.round(p.ratings))}{'☆'.repeat(5 - Math.round(p.ratings))}</span>
            <span style={styles.ratingText}>{p.ratings.toFixed(1)} ({p.numReviews})</span>
          </div>
        </div>
      </Link>

      {/* Add to cart */}
      <button
        onClick={(e) => onAddToCart(e, p._id)}
        disabled={p.stock === 0 || isAdding}
        style={{
          ...styles.addBtn,
          background: p.stock === 0 ? '#94a3b8' : isAdding ? '#10b981' : hovered ? '#1d4ed8' : '#3b82f6',
          cursor: p.stock === 0 ? 'not-allowed' : 'pointer',
          transform: isAdding ? 'scale(0.97)' : 'scale(1)',
          transition: 'all 0.2s ease',
        }}
      >
        {p.stock === 0 ? '✕ Out of Stock' : isAdding ? '✓ Added!' : '🛒 Add to Cart'}
      </button>
    </div>
  );
};

/* ── Skeleton Card ── */
const SkeletonCard = () => (
  <div style={styles.skeleton}>
    <div style={styles.skeletonImg} />
    <div style={{ padding: '1rem' }}>
      <div style={{ ...styles.skeletonLine, width: '50%', marginBottom: '0.5rem' }} />
      <div style={{ ...styles.skeletonLine, width: '90%', marginBottom: '0.5rem' }} />
      <div style={{ ...styles.skeletonLine, width: '40%' }} />
    </div>
  </div>
);

/* ── Empty State ── */
const EmptyState = ({ onClear }) => (
  <div style={styles.emptyState}>
    <div style={styles.emptyIcon}>🔍</div>
    <h3 style={styles.emptyTitle}>No Products Found</h3>
    <p style={styles.emptyText}>Try adjusting your filters or search term</p>
    <button onClick={onClear} style={styles.emptyBtn}>Clear Filters</button>
  </div>
);

/* ── Styles ── */
const styles = {
  pageWrapper: { minHeight: '100vh', background: '#f8fafc', overflowX: 'hidden', width: '100%' },
  pageHeader: { background: 'linear-gradient(135deg, #0f172a, #1e40af)', padding: '2.5rem 1rem' },
  pageHeaderInner: { maxWidth: '1300px', margin: '0 auto' },
  pageTitle: { color: '#fff', fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.3rem' },
  pageSubtitle: { color: '#93c5fd', fontSize: '0.95rem' },

  wrapper: { display: 'flex', maxWidth: '1300px', margin: '0 auto', padding: '2rem 1rem', gap: '2rem', alignItems: 'flex-start', boxSizing: 'border-box', width: '100%' },
  mobileFilterBar: { display: 'flex', gap: '0.75rem', padding: '1rem', background: '#fff', borderBottom: '1px solid #e2e8f0' },
  mobileFilterBtn: { flex: 1, padding: '0.65rem 1rem', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' },
  mobileClearBtn: { padding: '0.65rem 1rem', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' },

  // Sidebar
  sidebar: { width: '230px', flexShrink: 0, position: 'sticky', top: '1rem' },
  searchBox: { position: 'relative', marginBottom: '1.5rem' },
  searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem' },
  searchInput: { width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.2rem', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '0.9rem', background: '#fff', boxSizing: 'border-box', outline: 'none' },
  filterSection: { background: '#fff', borderRadius: '14px', padding: '1.2rem', marginBottom: '1rem', border: '1px solid #e2e8f0' },
  filterTitle: { fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' },
  filterBtn: { display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem', marginBottom: '0.3rem', background: 'transparent', border: '1px solid transparent', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '0.88rem', fontWeight: 500, transition: 'all 0.2s' },
  filterBtnActive: { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontWeight: 700 },
  filterCheck: { marginLeft: 'auto', color: '#3b82f6', fontWeight: 800 },
  clearBtn: { width: '100%', padding: '0.6rem', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' },

  // Main
  main: { flex: 1, minWidth: 0 },
  activeFilters: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' },
  chip: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '50px', padding: '0.3rem 0.8rem', fontSize: '0.82rem', fontWeight: 700 },
  chipClose: { background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', fontWeight: 800, padding: '0', fontSize: '0.8rem' },

  // Grid & Cards
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1.25rem' },
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  imgBox: { height: '190px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  placeholder: { fontSize: '3rem' },
  discountBadge: { position: 'absolute', top: '8px', left: '8px', background: '#ef4444', color: '#fff', fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '50px' },
  featuredBadge: { position: 'absolute', top: '8px', right: '8px', background: '#f59e0b', fontSize: '0.75rem', padding: '0.2rem 0.4rem', borderRadius: '50px' },
  outOfStockOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' },
  cardBody: { padding: '0.9rem 1rem', flex: 1 },
  cardCategory: { fontSize: '0.72rem', color: '#3b82f6', fontWeight: 700, marginBottom: '0.3rem' },
  cardName: { fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: '0.4rem', lineHeight: 1.4 },
  priceRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' },
  price: { color: '#1d4ed8', fontWeight: 800, fontSize: '1.1rem' },
  originalPrice: { color: '#94a3b8', fontSize: '0.8rem', textDecoration: 'line-through' },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '0.3rem' },
  stars: { color: '#f59e0b', fontSize: '0.75rem' },
  ratingText: { fontSize: '0.75rem', color: '#64748b' },
  addBtn: { margin: '0 0.75rem 0.75rem', padding: '0.6rem', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem' },

  // Skeleton
  skeleton: { background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' },
  skeletonImg: { height: '190px', background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)', backgroundSize: '200% 100%' },
  skeletonLine: { height: '12px', background: '#e2e8f0', borderRadius: '6px' },

  // Empty state
  emptyState: { textAlign: 'center', padding: '5rem 2rem' },
  emptyIcon: { fontSize: '4rem', marginBottom: '1rem' },
  emptyTitle: { fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' },
  emptyText: { color: '#64748b', marginBottom: '1.5rem' },
  emptyBtn: { padding: '0.7rem 2rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '50px', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' },

  // Pagination
  pagination: { display: 'flex', gap: '0.4rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' },
  pageBtn: { padding: '0.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', background: '#fff', fontWeight: 600, fontSize: '0.9rem', color: '#475569', transition: 'all 0.2s' },
  pageBtnActive: { background: '#3b82f6', color: '#fff', borderColor: '#3b82f6' },
};

export default ProductsPage;