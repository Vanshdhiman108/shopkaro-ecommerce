import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct, addReview } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id }          = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty]   = useState(1);
  const [rating, setRating]   = useState(5);
  const [comment, setComment] = useState('');
  const { addItem }     = useCart();
  const { user }        = useAuth();

  useEffect(() => {
    getProduct(id).then((res) => setProduct(res.data.product));
  }, [id]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      await addReview(id, { rating, comment });
      toast.success('Review submitted!');
      setComment('');
      getProduct(id).then((res) => setProduct(res.data.product));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (!product) return <p style={{ textAlign: 'center', padding: '4rem' }}>Loading...</p>;

  return (
    <div style={styles.wrapper}>
      <div style={styles.grid}>
        {/* Image */}
        <div style={styles.imgSection}>
          {product.images?.[0]
            ? <img src={product.images[0]} alt={product.name} style={styles.img} />
            : <div style={styles.placeholder}>📦</div>}
        </div>

        {/* Details */}
        <div style={styles.details}>
          <p style={styles.category}>{product.category}</p>
          <h1 style={styles.name}>{product.name}</h1>
          <p style={styles.rating}>⭐ {product.ratings.toFixed(1)} ({product.numReviews} reviews)</p>
          <p style={styles.price}>₹{product.price.toLocaleString()}</p>
          {product.discountPrice > 0 && <p style={styles.originalPrice}>MRP: ₹{product.discountPrice.toLocaleString()}</p>}
          <p style={styles.description}>{product.description}</p>

          <div style={styles.stockBadge}>
            {product.stock > 0 ? `✅ In Stock (${product.stock} left)` : '❌ Out of Stock'}
          </div>

          <div style={styles.qtyRow}>
            <label style={styles.label}>Qty:</label>
            <select value={qty} onChange={(e) => setQty(Number(e.target.value))} style={styles.select}>
              {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <button onClick={() => addItem(product._id, qty)} style={styles.addBtn} disabled={product.stock === 0}>
            🛒 Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div style={styles.reviewSection}>
        <h2 style={styles.reviewTitle}>Customer Reviews</h2>
        {product.reviews.length === 0 && <p style={{ color: '#94a3b8' }}>No reviews yet. Be the first!</p>}
        {product.reviews.map((r) => (
          <div key={r._id} style={styles.reviewCard}>
            <p style={styles.reviewName}>{r.name} — ⭐ {r.rating}/5</p>
            <p style={styles.reviewComment}>{r.comment}</p>
          </div>
        ))}

        {user && (
          <form onSubmit={handleAddReview} style={styles.reviewForm}>
            <h3>Write a Review</h3>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} style={styles.select}>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} ⭐</option>)}
            </select>
            <textarea placeholder="Your review..." value={comment} onChange={(e) => setComment(e.target.value)}
              style={styles.textarea} required />
            <button type="submit" style={styles.submitBtn}>Submit Review</button>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' },
  imgSection: { background: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '350px' },
  img: { width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '16px' },
  placeholder: { fontSize: '5rem' },
  details: {},
  category: { color: '#3b82f6', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' },
  name: { fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' },
  rating: { color: '#64748b', marginBottom: '0.75rem' },
  price: { fontSize: '2rem', fontWeight: 700, color: '#3b82f6', marginBottom: '0.25rem' },
  originalPrice: { color: '#94a3b8', textDecoration: 'line-through', fontSize: '0.9rem' },
  description: { color: '#475569', lineHeight: 1.7, margin: '1rem 0' },
  stockBadge: { fontWeight: 600, marginBottom: '1rem', fontSize: '0.9rem' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' },
  label: { fontWeight: 600 },
  select: { padding: '0.4rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem' },
  addBtn: { width: '100%', padding: '0.85rem', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' },
  reviewSection: { borderTop: '2px solid #e2e8f0', paddingTop: '2rem' },
  reviewTitle: { fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' },
  reviewCard: { background: '#f8fafc', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' },
  reviewName: { fontWeight: 700, marginBottom: '0.25rem' },
  reviewComment: { color: '#475569', lineHeight: 1.6 },
  reviewForm: { marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' },
  textarea: { padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', height: '100px', fontSize: '0.95rem', resize: 'vertical' },
  submitBtn: { padding: '0.6rem 1.5rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' },
};

export default ProductDetailPage;
