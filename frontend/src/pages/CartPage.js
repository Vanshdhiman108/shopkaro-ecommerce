import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, updateItem, removeItem, emptyCart } = useCart();
  const navigate = useNavigate();
  const [removingId, setRemovingId] = useState(null);

  const handleRemove = async (id) => {
    setRemovingId(id);
    setTimeout(() => { removeItem(id); setRemovingId(null); }, 300);
  };

  // Empty cart
  if (!cart.items || cart.items.length === 0) {
    return (
      <div style={styles.emptyWrapper}>
        <div style={styles.emptyCard}>
          <div style={styles.emptyIcon}>🛒</div>
          <h2 style={styles.emptyTitle}>Your cart is empty!</h2>
          <p style={styles.emptyText}>Looks like you haven't added anything yet.</p>
          <Link to="/products" style={styles.shopBtn}>
            🛍️ Start Shopping
          </Link>
          <Link to="/" style={styles.homeLink}>← Back to Home</Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.totalPrice;
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.18);
  const grand = subtotal + shipping + tax;

  return (
    <div style={styles.pageWrapper}>
      {/* Header */}
      <div style={styles.pageHeader}>
        <div style={styles.pageHeaderInner}>
          <h1 style={styles.pageTitle}>🛒 Shopping Cart</h1>
          <p style={styles.pageSubtitle}>{cart.items.length} item{cart.items.length > 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div style={styles.wrapper}>
        {/* ── Cart Items ── */}
        <div style={styles.itemsCol}>

          {/* Free shipping progress */}
          {subtotal < 500 && (
            <div style={styles.shippingBanner}>
              <span>🚚</span>
              <span>Add <strong>₹{(500 - subtotal).toLocaleString()}</strong> more for <strong>FREE shipping!</strong></span>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${Math.min((subtotal / 500) * 100, 100)}%` }} />
              </div>
            </div>
          )}
          {subtotal >= 500 && (
            <div style={{ ...styles.shippingBanner, background: '#f0fdf4', borderColor: '#bbf7d0' }}>
              <span>🎉</span>
              <span style={{ color: '#16a34a', fontWeight: 700 }}>You've unlocked FREE shipping!</span>
            </div>
          )}

          {/* Items */}
          {cart.items.map((item) => {
            const id = item.product._id || item.product;
            const isRemoving = removingId === id;
            return (
              <div
                key={id}
                style={{
                  ...styles.item,
                  opacity: isRemoving ? 0 : 1,
                  transform: isRemoving ? 'translateX(30px)' : 'translateX(0)',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Image */}
                <div style={styles.itemImg}>
                  {item.product.images?.[0]
                    ? <img src={item.product.images[0]} alt={item.product.name} style={styles.itemImgEl} />
                    : <span style={{ fontSize: '2rem' }}>📦</span>
                  }
                </div>

                {/* Info */}
                <div style={styles.itemInfo}>
                  <p style={styles.itemName}>{item.product.name || 'Product'}</p>
                  <p style={styles.itemPrice}>₹{item.price.toLocaleString()} each</p>
                  {item.product.stock < 5 && item.product.stock > 0 && (
                    <p style={styles.lowStock}>⚠️ Only {item.product.stock} left!</p>
                  )}
                </div>

                {/* Qty controls */}
                <div style={styles.qtyBox}>
                  <button
                    onClick={() => updateItem(id, item.quantity - 1)}
                    style={styles.qtyBtn}
                  >−</button>
                  <span style={styles.qtyNum}>{item.quantity}</span>
                  <button
                    onClick={() => updateItem(id, item.quantity + 1)}
                    style={styles.qtyBtn}
                  >+</button>
                </div>

                {/* Item total */}
                <div style={styles.itemTotalBox}>
                  <p style={styles.itemTotal}>₹{(item.price * item.quantity).toLocaleString()}</p>
                  {item.quantity > 1 && (
                    <p style={styles.itemTotalSub}>₹{item.price.toLocaleString()} × {item.quantity}</p>
                  )}
                </div>

                {/* Remove */}
                <button onClick={() => handleRemove(id)} style={styles.removeBtn} title="Remove item">
                  🗑️
                </button>
              </div>
            );
          })}

          {/* Clear cart */}
          <div style={styles.cartActions}>
            <Link to="/products" style={styles.continueBtn}>← Continue Shopping</Link>
            <button onClick={emptyCart} style={styles.clearBtn}>🗑️ Clear Cart</button>
          </div>
        </div>

        {/* ── Order Summary ── */}
        <div style={styles.summaryCol}>
          <div style={styles.summaryCard}>
            <h2 style={styles.summaryTitle}>Order Summary</h2>

            <div style={styles.summaryRows}>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Subtotal ({cart.items.length} items)</span>
                <span style={styles.summaryVal}>₹{subtotal.toLocaleString()}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Shipping</span>
                <span style={{ ...styles.summaryVal, color: shipping === 0 ? '#16a34a' : '#475569', fontWeight: shipping === 0 ? 700 : 400 }}>
                  {shipping === 0 ? '🎉 FREE' : `₹${shipping}`}
                </span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>GST (18%)</span>
                <span style={styles.summaryVal}>₹{tax.toLocaleString()}</span>
              </div>
            </div>

            <div style={styles.summaryTotal}>
              <span style={styles.summaryTotalLabel}>Total</span>
              <span style={styles.summaryTotalVal}>₹{grand.toLocaleString()}</span>
            </div>

            <button onClick={() => navigate('/checkout')} style={styles.checkoutBtn}>
              Proceed to Checkout →
            </button>

            {/* Trust badges */}
            <div style={styles.trustBadges}>
              {['🔒 Secure Payment', '↩️ Easy Returns', '🚚 Fast Delivery'].map((b) => (
                <span key={b} style={styles.trustBadge}>{b}</span>
              ))}
            </div>
          </div>

          {/* Promo */}
          <div style={styles.promoCard}>
            <p style={styles.promoTitle}>🎁 Have a promo code?</p>
            <div style={styles.promoRow}>
              <input placeholder="Enter code" style={styles.promoInput} />
              <button style={styles.promoBtn}>Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { minHeight: '100vh', background: '#f8fafc' },
  pageHeader: { background: 'linear-gradient(135deg, #0f172a, #1e40af)', padding: '2.5rem 1rem' },
  pageHeaderInner: { maxWidth: '1100px', margin: '0 auto' },
  pageTitle: { color: '#fff', fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.3rem' },
  pageSubtitle: { color: '#93c5fd', fontSize: '0.95rem' },

  wrapper: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem', display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'flex-start' },

  // Items
  itemsCol: {},
  shippingBanner: { display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '0.9rem 1.2rem', marginBottom: '1.25rem', fontSize: '0.9rem', color: '#1e40af', flexWrap: 'wrap' },
  progressBar: { width: '100%', height: '6px', background: '#dbeafe', borderRadius: '50px', marginTop: '0.4rem' },
  progressFill: { height: '100%', background: '#3b82f6', borderRadius: '50px', transition: 'width 0.5s ease' },

  item: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  itemImg: { width: '80px', height: '80px', background: '#f8fafc', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  itemImgEl: { width: '100%', height: '100%', objectFit: 'cover' },
  itemInfo: { flex: 1, minWidth: 0 },
  itemName: { fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem', fontSize: '0.95rem' },
  itemPrice: { color: '#64748b', fontSize: '0.82rem' },
  lowStock: { color: '#f59e0b', fontSize: '0.78rem', fontWeight: 600, marginTop: '0.2rem' },

  qtyBox: { display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.2rem' },
  qtyBtn: { width: '30px', height: '30px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '7px', cursor: 'pointer', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qtyNum: { minWidth: '28px', textAlign: 'center', fontWeight: 800, fontSize: '0.95rem' },

  itemTotalBox: { textAlign: 'right', minWidth: '80px' },
  itemTotal: { fontWeight: 800, color: '#0f172a', fontSize: '1rem' },
  itemTotalSub: { color: '#94a3b8', fontSize: '0.72rem', marginTop: '0.2rem' },

  removeBtn: { background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: '4px', opacity: 0.6, transition: 'opacity 0.2s' },

  cartActions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' },
  continueBtn: { color: '#3b82f6', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' },
  clearBtn: { background: 'transparent', border: '1px solid #fecaca', color: '#ef4444', padding: '0.4rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' },

  // Summary
  summaryCol: { position: 'sticky', top: '1rem' },
  summaryCard: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '1.75rem', marginBottom: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' },
  summaryTitle: { fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #f1f5f9' },
  summaryRows: { marginBottom: '1rem' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' },
  summaryLabel: { color: '#64748b', fontSize: '0.9rem' },
  summaryVal: { fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' },
  summaryTotal: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #f1f5f9', paddingTop: '1rem', marginTop: '0.5rem' },
  summaryTotalLabel: { fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' },
  summaryTotalVal: { fontWeight: 900, fontSize: '1.4rem', color: '#1d4ed8' },
  checkoutBtn: { width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', marginTop: '1.5rem', boxShadow: '0 4px 15px rgba(59,130,246,0.4)', transition: 'transform 0.2s' },
  trustBadges: { display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' },
  trustBadge: { fontSize: '0.78rem', color: '#64748b', fontWeight: 500 },

  promoCard: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem' },
  promoTitle: { fontWeight: 700, color: '#0f172a', fontSize: '0.9rem', marginBottom: '0.75rem' },
  promoRow: { display: 'flex', gap: '0.5rem' },
  promoInput: { flex: 1, padding: '0.6rem 0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', outline: 'none' },
  promoBtn: { padding: '0.6rem 1rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' },

  // Empty
  emptyWrapper: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' },
  emptyCard: { background: '#fff', borderRadius: '24px', padding: '4rem 3rem', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', maxWidth: '400px', width: '100%' },
  emptyIcon: { fontSize: '5rem', marginBottom: '1rem' },
  emptyTitle: { fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' },
  emptyText: { color: '#64748b', marginBottom: '2rem', fontSize: '0.95rem' },
  shopBtn: { display: 'inline-block', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff', padding: '0.85rem 2.5rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 800, fontSize: '1rem', boxShadow: '0 4px 15px rgba(59,130,246,0.35)', marginBottom: '1rem' },
  homeLink: { display: 'block', color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', marginTop: '0.75rem' },
};

export default CartPage;