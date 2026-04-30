import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome Back 👋</h1>
        <p style={styles.sub}>Login to your ShopKaro account</p>
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={styles.input} placeholder="you@example.com" required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={styles.input} placeholder="••••••••" required />
          </div>
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </form>
        <p style={styles.footer}>Don't have an account? <Link to="/register" style={{ color: '#3b82f6' }}>Register</Link></p>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate     = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account 🚀</h1>
        <p style={styles.sub}>Join ShopKaro today</p>
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={styles.input} placeholder="John Doe" required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={styles.input} placeholder="you@example.com" required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={styles.input} placeholder="Min 6 characters" minLength={6} required />
          </div>
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Creating account...' : 'Register →'}
          </button>
        </form>
        <p style={styles.footer}>Already have an account? <Link to="/login" style={{ color: '#3b82f6' }}>Login</Link></p>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' },
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '420px' },
  title: { fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.25rem' },
  sub: { color: '#94a3b8', marginBottom: '2rem' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#475569', marginBottom: '0.3rem' },
  input: { width: '100%', padding: '0.7rem 0.9rem', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' },
  btn: { width: '100%', padding: '0.85rem', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' },
  footer: { textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.9rem' },
};
