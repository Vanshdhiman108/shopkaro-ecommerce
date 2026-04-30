import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, getAllOrders, updateOrderStatus, deleteProduct, getAllUsers, getProducts } from '../utils/api';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const [tab, setTab]       = useState('dashboard');
  const [stats, setStats]   = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers]   = useState([]);

  useEffect(() => {
    getDashboardStats().then((res) => setStats(res.data));
  }, []);

  useEffect(() => {
    if (tab === 'orders') getAllOrders().then((res) => setOrders(res.data.orders));
    if (tab === 'products') getProducts({ limit: 50 }).then((res) => setProducts(res.data.products));
    if (tab === 'users') getAllUsers().then((res) => setUsers(res.data.users));
  }, [tab]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, { orderStatus: status });
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, orderStatus: status } : o));
      toast.success('Status updated');
    } catch { toast.error('Failed'); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const statCards = stats?.stats ? [
    { label: 'Total Revenue', value: `₹${Number(stats.stats.totalRevenue).toLocaleString()}`, icon: '💰' },
    { label: 'Total Orders', value: stats.stats.totalOrders, icon: '📦' },
    { label: 'Products', value: stats.stats.totalProducts, icon: '🛍️' },
    { label: 'Customers', value: stats.stats.totalUsers, icon: '👥' },
  ] : [];

  const statusColor = { Processing: '#f59e0b', Confirmed: '#3b82f6', Shipped: '#8b5cf6', Delivered: '#10b981', Cancelled: '#ef4444' };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>⚙️ Admin Panel</h1>

      {/* Tabs */}
      <div style={styles.tabs}>
        {['dashboard', 'orders', 'products', 'users'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {tab === 'dashboard' && stats && (
        <>
          <div style={styles.statGrid}>
            {statCards.map((s) => (
              <div key={s.label} style={styles.statCard}>
                <span style={styles.statIcon}>{s.icon}</span>
                <p style={styles.statValue}>{s.value}</p>
                <p style={styles.statLabel}>{s.label}</p>
              </div>
            ))}
          </div>
          <h2 style={styles.subTitle}>Recent Orders</h2>
          <table style={styles.table}>
            <thead><tr style={styles.thead}>
              <th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Paid</th>
            </tr></thead>
            <tbody>
              {stats.recentOrders.map((o) => (
                <tr key={o._id} style={styles.tr}>
                  <td style={styles.td}>#{o._id.slice(-6).toUpperCase()}</td>
                  <td style={styles.td}>{o.user?.name}</td>
                  <td style={styles.td}>₹{o.totalPrice.toLocaleString()}</td>
                  <td style={styles.td}><span style={{ color: statusColor[o.orderStatus] }}>{o.orderStatus}</span></td>
                  <td style={styles.td}>{o.isPaid ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Orders */}
      {tab === 'orders' && (
        <table style={styles.table}>
          <thead><tr style={styles.thead}>
            <th>ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Change Status</th>
          </tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} style={styles.tr}>
                <td style={styles.td}>#{o._id.slice(-6).toUpperCase()}</td>
                <td style={styles.td}>{o.user?.name}</td>
                <td style={styles.td}>₹{o.totalPrice.toLocaleString()}</td>
                <td style={styles.td}><span style={{ color: statusColor[o.orderStatus] }}>{o.orderStatus}</span></td>
                <td style={styles.td}>
                  <select value={o.orderStatus} onChange={(e) => handleStatusChange(o._id, e.target.value)} style={styles.select}>
                    {['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Products */}
      {tab === 'products' && (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <Link to="/admin/products/new" style={styles.addBtn}>+ Add New Product</Link>
          </div>
          <table style={styles.table}>
            <thead><tr style={styles.thead}><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Action</th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} style={styles.tr}>
                  <td style={styles.td}>{p.name}</td>
                  <td style={styles.td}>{p.category}</td>
                  <td style={styles.td}>₹{p.price.toLocaleString()}</td>
                  <td style={styles.td}>{p.stock}</td>
                  <td style={styles.td}>
                    <Link to={`/admin/products/${p._id}/edit`} style={{ ...styles.actionBtn, background: '#3b82f6' }}>Edit</Link>
                    <button onClick={() => handleDeleteProduct(p._id)} style={{ ...styles.actionBtn, background: '#ef4444', border: 'none', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Users */}
      {tab === 'users' && (
        <table style={styles.table}>
          <thead><tr style={styles.thead}><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} style={styles.tr}>
                <td style={styles.td}>{u.name}</td>
                <td style={styles.td}>{u.email}</td>
                <td style={styles.td}><span style={{ color: u.role === 'admin' ? '#f59e0b' : '#3b82f6', fontWeight: 600 }}>{u.role}</span></td>
                <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  wrapper: { maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' },
  title: { fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem', color: '#1e293b' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0' },
  tab: { padding: '0.6rem 1.25rem', background: 'transparent', border: 'none', fontWeight: 600, color: '#94a3b8', cursor: 'pointer', borderBottom: '3px solid transparent', fontSize: '0.95rem' },
  tabActive: { color: '#1e293b', borderBottomColor: '#3b82f6' },
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' },
  statCard: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', textAlign: 'center' },
  statIcon: { fontSize: '2rem' },
  statValue: { fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', margin: '0.5rem 0 0.25rem' },
  statLabel: { color: '#94a3b8', fontSize: '0.85rem' },
  subTitle: { fontWeight: 700, fontSize: '1.2rem', marginBottom: '1rem', color: '#1e293b' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' },
  thead: { background: '#f8fafc', textAlign: 'left' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '0.85rem 1rem', fontSize: '0.9rem', color: '#475569' },
  select: { padding: '0.3rem 0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.85rem' },
  addBtn: { display: 'inline-block', background: '#10b981', color: '#fff', padding: '0.5rem 1.25rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 700 },
  actionBtn: { display: 'inline-block', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '6px', textDecoration: 'none', fontSize: '0.8rem', marginRight: '0.5rem' },
};

export default AdminPage;
