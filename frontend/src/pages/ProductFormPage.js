import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getProduct } from '../utils/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Other'];

const empty = { name: '', description: '', price: '', discountPrice: '', category: 'Electronics', brand: '', stock: '', images: '', isFeatured: false };

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      getProduct(id)
        .then((res) => {
          const p = res.data.product;
          setForm({
            name: p.name || '',
            description: p.description || '',
            price: p.price || '',
            discountPrice: p.discountPrice || '',
            category: p.category || 'Electronics',
            brand: p.brand || '',
            stock: p.stock || '',
            images: (p.images || []).join(', '),
            isFeatured: p.isFeatured || false,
          });
        })
        .catch(() => toast.error('Failed to load product'))
        .finally(() => setFetching(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: Number(form.discountPrice) || 0,
        stock: Number(form.stock),
        images: form.images ? form.images.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };
      if (isEdit) {
        await updateProduct(id, payload);
        toast.success('Product updated!');
      } else {
        await createProduct(payload);
        toast.success('Product created!');
      }
      navigate('/admin');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={styles.center}>Loading...</div>;

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>{isEdit ? '✏️ Edit Product' : '➕ Add New Product'}</h1>

        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            {/* Name */}
            <div style={styles.fieldFull}>
              <label style={styles.label}>Product Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Wireless Earbuds Pro" style={styles.input} />
            </div>

            {/* Description */}
            <div style={styles.fieldFull}>
              <label style={styles.label}>Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Product description..." style={{ ...styles.input, resize: 'vertical' }} />
            </div>

            {/* Price */}
            <div style={styles.field}>
              <label style={styles.label}>Price (₹) *</label>
              <input name="price" type="number" min="0" value={form.price} onChange={handleChange} required placeholder="1999" style={styles.input} />
            </div>

            {/* Discount Price */}
            <div style={styles.field}>
              <label style={styles.label}>Discount Price (₹)</label>
              <input name="discountPrice" type="number" min="0" value={form.discountPrice} onChange={handleChange} placeholder="0" style={styles.input} />
            </div>

            {/* Category */}
            <div style={styles.field}>
              <label style={styles.label}>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} style={styles.input}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Brand */}
            <div style={styles.field}>
              <label style={styles.label}>Brand</label>
              <input name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Samsung" style={styles.input} />
            </div>

            {/* Stock */}
            <div style={styles.field}>
              <label style={styles.label}>Stock *</label>
              <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required placeholder="50" style={styles.input} />
            </div>

            {/* Images */}
            <div style={styles.fieldFull}>
              <label style={styles.label}>Image URLs <span style={styles.hint}>(comma separated)</span></label>
              <input name="images" value={form.images} onChange={handleChange} placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" style={styles.input} />
            </div>

            {/* Featured */}
            <div style={styles.fieldFull}>
              <label style={styles.checkboxLabel}>
                <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} style={{ marginRight: '0.5rem', width: '16px', height: '16px' }} />
                Mark as Featured Product
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div style={styles.btnRow}>
            <button type="button" onClick={() => navigate('/admin')} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" disabled={loading} style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { minHeight: '100vh', background: '#f8fafc', padding: '2rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' },
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', width: '100%', maxWidth: '720px' },
  title: { fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' },
  field: { display: 'flex', flexDirection: 'column' },
  fieldFull: { display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' },
  hint: { fontWeight: 400, color: '#94a3b8', fontSize: '0.8rem' },
  input: { padding: '0.65rem 0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', color: '#1e293b', outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' },
  checkboxLabel: { display: 'flex', alignItems: 'center', fontSize: '0.95rem', fontWeight: 600, color: '#475569', cursor: 'pointer' },
  btnRow: { display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem' },
  cancelBtn: { padding: '0.65rem 1.5rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem', color: '#475569' },
  submitBtn: { padding: '0.65rem 2rem', background: '#10b981', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', color: '#fff' },
  center: { textAlign: 'center', padding: '5rem', fontSize: '1.2rem', color: '#94a3b8' },
};

export default ProductFormPage;