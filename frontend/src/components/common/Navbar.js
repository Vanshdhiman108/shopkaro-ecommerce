import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🛍️ ShopKaro</Link>

      <div style={styles.links}>
        <Link to="/products" style={styles.link}>Products</Link>

        {user ? (
          <>
            <Link to="/cart" style={styles.link}>
              🛒 Cart {itemCount > 0 && <span style={styles.badge}>{itemCount}</span>}
            </Link>
            <Link to="/orders" style={styles.link}>My Orders</Link>
            {isAdmin && <Link to="/admin" style={{ ...styles.link, color: '#f59e0b' }}>Admin</Link>}
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={{ ...styles.link, ...styles.registerBtn }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#1e293b', color: '#fff', position: 'sticky', top: 0, zIndex: 100, width: '100%', boxSizing: 'border-box' },
  brand: { fontSize: '1.5rem', fontWeight: 700, color: '#fff', textDecoration: 'none' },
  links: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
  link: { color: '#cbd5e1', textDecoration: 'none', fontSize: '0.95rem', position: 'relative' },
  badge: { background: '#ef4444', color: '#fff', borderRadius: '50%', padding: '2px 7px', fontSize: '0.75rem', marginLeft: '4px' },
  btn: { background: 'transparent', border: '1px solid #64748b', color: '#cbd5e1', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  registerBtn: { background: '#3b82f6', color: '#fff', padding: '6px 14px', borderRadius: '6px' },
};

export default Navbar;
