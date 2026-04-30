import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMyOrders, getOrderById } from '../utils/api';

const STATUS_CONFIG = {
  Processing: { color: '#d97706', bg: '#fef3c7', icon: '⏳', step: 0 },
  Confirmed:  { color: '#2563eb', bg: '#dbeafe', icon: '✅', step: 1 },
  Shipped:    { color: '#7c3aed', bg: '#ede9fe', icon: '🚚', step: 2 },
  Delivered:  { color: '#059669', bg: '#d1fae5', icon: '🎉', step: 3 },
  Cancelled:  { color: '#dc2626', bg: '#fee2e2', icon: '✕',  step: -1 },
};

const STEPS = ['Confirmed', 'Shipped', 'Delivered'];

/* ══════════════════════════════
   ORDERS LIST PAGE
══════════════════════════════ */
export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data.orders))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.pageWrapper}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <h1 style={styles.headerTitle}>📦 My Orders</h1>
          <p style={styles.headerSub}>{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
        </div>
      </div>

      <div style={styles.wrapper}>
        {loading ? (
          <div>
            {[...Array(3)].map((_, i) => <SkeletonOrder key={i} />)}
          </div>
        ) : orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          orders.map((order, i) => (
            <OrderCard key={order._id} order={order} delay={i * 80} />
          ))
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════
   ORDER DETAIL PAGE
══════════════════════════════ */
export const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrderById(id).then((res) => setOrder(res.data.order));
  }, [id]);

  if (!order) return (
    <div style={styles.loadingWrapper}>
      <div style={styles.loadingSpinner}>📦</div>
      <p style={styles.loadingText}>Loading order details...</p>
    </div>
  );

  const cfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.Processing;
  const currentStep = cfg.step;

  return (
    <div style={styles.pageWrapper}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <Link to="/orders" style={styles.backBtn}>← Back to Orders</Link>
          <h1 style={styles.headerTitle}>Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p style={styles.headerSub}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <div style={styles.wrapper}>
        {/* Status Tracker */}
        {order.orderStatus !== 'Cancelled' && (
          <div style={styles.tracker}>
            <h3 style={styles.trackerTitle}>Order Progress</h3>
            <div style={styles.trackerSteps}>
              {STEPS.map((step, i) => {
                const done = currentStep > i;
                const active = currentStep === i + 1;
                const s = STATUS_CONFIG[step];
                return (
                  <React.Fragment key={step}>
                    <div style={styles.trackerStep}>
                      <div style={{
                        ...styles.trackerDot,
                        background: done || active ? s.color : '#e2e8f0',
                        color: done || active ? '#fff' : '#94a3b8',
                        transform: active ? 'scale(1.2)' : 'scale(1)',
                        boxShadow: active ? `0 0 0 4px ${s.bg}` : 'none',
                      }}>
                        {done ? '✓' : s.icon}
                      </div>
                      <p style={{ ...styles.trackerLabel, color: done || active ? s.color : '#94a3b8', fontWeight: active ? 800 : 600 }}>
                        {step}
                      </p>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div style={{ ...styles.trackerLine, background: currentStep > i + 1 ? '#10b981' : '#e2e8f0' }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {order.orderStatus === 'Cancelled' && (
          <div style={styles.cancelledBanner}>
            <span style={{ fontSize: '1.5rem' }}>✕</span>
            <div>
              <p style={{ fontWeight: 800, color: '#dc2626', marginBottom: '0.2rem' }}>Order Cancelled</p>
              <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>This order has been cancelled.</p>
            </div>
          </div>
        )}

        <div style={styles.detailGrid}>
          {/* Left col */}
          <div>
            {/* Items */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>🛍️ Items Ordered</h3>
              {order.orderItems.map((item, i) => (
                <div key={i} style={styles.orderItem}>
                  <div style={styles.orderItemImg}>
                    {item.image
                      ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '1.5rem' }}>📦</span>}
                  </div>
                  <div style={styles.orderItemInfo}>
                    <p style={styles.orderItemName}>{item.name}</p>
                    <p style={styles.orderItemQty}>Qty: {item.quantity}</p>
                  </div>
                  <p style={styles.orderItemPrice}>₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Shipping */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>🚚 Shipping Address</h3>
              <p style={styles.addressLine}>{order.shippingAddress.street}</p>
              <p style={styles.addressLine}>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p style={styles.addressLine}>Pincode: {order.shippingAddress.pincode}</p>
            </div>
          </div>

          {/* Right col */}
          <div>
            {/* Summary */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>🧾 Order Summary</h3>
              <div style={styles.summaryRow}><span style={styles.summaryLabel}>Items</span><span>₹{order.itemsPrice?.toLocaleString()}</span></div>
              <div style={styles.summaryRow}><span style={styles.summaryLabel}>Shipping</span><span style={{ color: order.shippingPrice === 0 ? '#059669' : '#1e293b' }}>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
              <div style={styles.summaryRow}><span style={styles.summaryLabel}>GST (18%)</span><span>₹{order.taxPrice?.toLocaleString()}</span></div>
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Total</span>
                <span style={styles.totalVal}>₹{order.totalPrice?.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>💳 Payment Info</h3>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Method</span>
                <span style={{ fontWeight: 700 }}>{order.paymentMethod}</span>
              </div>
              <div style={{ marginTop: '0.75rem', padding: '0.75rem', borderRadius: '10px', background: order.isPaid ? '#d1fae5' : '#fef3c7', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{order.isPaid ? '✅' : '⏳'}</span>
                <div>
                  <p style={{ fontWeight: 700, color: order.isPaid ? '#059669' : '#d97706', fontSize: '0.9rem' }}>
                    {order.isPaid ? 'Payment Confirmed' : 'Payment Pending'}
                  </p>
                  {order.isPaid && order.paidAt && (
                    <p style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                      {new Date(order.paidAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Status badge */}
            <div style={{ ...styles.statusBadgeCard, background: cfg.bg, border: `1px solid ${cfg.color}30` }}>
              <span style={{ fontSize: '1.5rem' }}>{cfg.icon}</span>
              <div>
                <p style={{ fontWeight: 800, color: cfg.color, fontSize: '1rem' }}>{order.orderStatus}</p>
                <p style={{ color: cfg.color, fontSize: '0.8rem', opacity: 0.8 }}>Current order status</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Sub-components ── */
const OrderCard = ({ order, delay }) => {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), delay); }, [delay]);
  const cfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.Processing;

  return (
    <div
      style={{
        ...styles.orderCard,
        opacity: mounted ? 1 : 0,
        transform: mounted ? (hovered ? 'translateY(-3px)' : 'translateY(0)') : 'translateY(15px)',
        transition: 'all 0.3s ease',
        boxShadow: hovered ? '0 8px 25px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.orderCardTop}>
        <div>
          <p style={styles.orderId}>#{order._id.slice(-8).toUpperCase()}</p>
          <p style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          <p style={styles.orderItems}>{order.orderItems?.length || 0} item{order.orderItems?.length !== 1 ? 's' : ''}</p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ ...styles.statusBadge, background: cfg.bg, color: cfg.color }}>
            {cfg.icon} {order.orderStatus}
          </div>
          <p style={{ fontSize: '0.75rem', color: order.isPaid ? '#059669' : '#d97706', marginTop: '0.4rem', fontWeight: 700 }}>
            {order.isPaid ? '✅ Paid' : '⏳ Pending'}
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <p style={styles.orderTotal}>₹{order.totalPrice?.toLocaleString()}</p>
          <Link to={`/orders/${order._id}`} style={styles.viewBtn}>View Details →</Link>
        </div>
      </div>
    </div>
  );
};

const SkeletonOrder = () => (
  <div style={{ ...styles.orderCard, marginBottom: '1rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
      <div style={{ flex: 1 }}>
        <div style={styles.skelLine} />
        <div style={{ ...styles.skelLine, width: '60%', marginTop: '0.5rem' }} />
      </div>
      <div style={{ ...styles.skelLine, width: '80px' }} />
      <div style={{ ...styles.skelLine, width: '100px' }} />
    </div>
  </div>
);

const EmptyOrders = () => (
  <div style={styles.emptyState}>
    <div style={styles.emptyIcon}>📦</div>
    <h2 style={styles.emptyTitle}>No orders yet!</h2>
    <p style={styles.emptyText}>Looks like you haven't placed any orders. Start shopping!</p>
    <Link to="/products" style={styles.shopBtn}>Browse Products →</Link>
  </div>
);

/* ── Styles ── */
const styles = {
  pageWrapper: { minHeight: '100vh', background: '#f8fafc' },
  header: { background: 'linear-gradient(135deg, #0f172a, #1e40af)', padding: '2.5rem 1rem' },
  headerInner: { maxWidth: '900px', margin: '0 auto' },
  backBtn: { color: '#93c5fd', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, display: 'inline-block', marginBottom: '0.5rem' },
  headerTitle: { color: '#fff', fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.3rem' },
  headerSub: { color: '#93c5fd', fontSize: '0.9rem' },
  wrapper: { maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' },

  // Order card
  orderCard: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem' },
  orderCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' },
  orderId: { fontWeight: 800, color: '#0f172a', fontSize: '1rem', marginBottom: '0.2rem' },
  orderDate: { fontSize: '0.82rem', color: '#64748b', marginBottom: '0.2rem' },
  orderItems: { fontSize: '0.8rem', color: '#94a3b8' },
  statusBadge: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.9rem', borderRadius: '50px', fontSize: '0.82rem', fontWeight: 700 },
  orderTotal: { fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', marginBottom: '0.5rem' },
  viewBtn: { display: 'inline-block', background: '#1e293b', color: '#fff', padding: '0.45rem 1.1rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.82rem' },

  // Detail page
  tracker: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem', marginBottom: '1.5rem' },
  trackerTitle: { fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', fontSize: '1rem' },
  trackerSteps: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  trackerStep: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', minWidth: '80px' },
  trackerDot: { width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', transition: 'all 0.3s ease' },
  trackerLabel: { fontSize: '0.78rem', textAlign: 'center', transition: 'all 0.3s ease' },
  trackerLine: { flex: 1, height: '3px', borderRadius: '50px', margin: '0 0.5rem', marginBottom: '1.5rem', transition: 'background 0.3s ease' },

  cancelledBanner: { background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '12px', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },

  detailGrid: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'flex-start' },
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem' },
  cardTitle: { fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: '1.25rem' },

  orderItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '0.75rem', marginBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' },
  orderItemImg: { width: '50px', height: '50px', background: '#f1f5f9', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  orderItemInfo: { flex: 1 },
  orderItemName: { fontWeight: 700, color: '#0f172a', fontSize: '0.9rem', marginBottom: '0.2rem' },
  orderItemQty: { fontSize: '0.78rem', color: '#64748b' },
  orderItemPrice: { fontWeight: 700, color: '#1d4ed8' },

  addressLine: { color: '#475569', fontSize: '0.9rem', marginBottom: '0.25rem' },

  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem', color: '#475569' },
  summaryLabel: { color: '#64748b' },
  totalRow: { display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #e2e8f0', paddingTop: '0.75rem', marginTop: '0.5rem' },
  totalLabel: { fontWeight: 800, color: '#0f172a' },
  totalVal: { fontWeight: 900, color: '#1d4ed8', fontSize: '1.15rem' },

  statusBadgeCard: { borderRadius: '16px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' },

  // Skeleton
  skelLine: { height: '14px', background: '#e2e8f0', borderRadius: '6px', width: '100%' },

  // Empty
  emptyState: { textAlign: 'center', padding: '5rem 2rem' },
  emptyIcon: { fontSize: '4rem', marginBottom: '1rem' },
  emptyTitle: { fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' },
  emptyText: { color: '#64748b', marginBottom: '2rem' },
  shopBtn: { display: 'inline-block', background: '#3b82f6', color: '#fff', padding: '0.85rem 2rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 700 },

  // Loading
  loadingWrapper: { textAlign: 'center', padding: '5rem' },
  loadingSpinner: { fontSize: '3rem', marginBottom: '1rem' },
  loadingText: { color: '#64748b', fontSize: '1rem' },
};