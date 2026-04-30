import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../utils/api';

const categoryIcon = (cat) =>
  ({ Electronics: '📱', Clothing: '👕', Books: '📚', Home: '🏠', Sports: '⚽', Beauty: '💄' }[cat] || '🛍️');

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty'];

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setVisible(true), 100);
    getProducts({ limit: 6 })
      .then((res) => setFeatured(res.data.products))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", overflowX: 'hidden' }}>

      {/* ── HERO SECTION ── */}
      <section style={styles.hero}>
        <div style={styles.heroBg} />
        <div style={{ ...styles.heroContent, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.8s ease' }}>
          <div style={styles.heroBadge}>🛍️ New Arrivals Every Week</div>
          <h1 style={styles.heroTitle}>
            Shop Everything<br />
            <span style={styles.heroHighlight}>You Love</span>
          </h1>
          <p style={styles.heroSub}>
            Premium products · Lightning-fast delivery · Unbeatable prices
          </p>
          <div style={styles.heroBtns}>
            <Link to="/products" style={styles.heroBtnPrimary}>
              Shop Now →
            </Link>
            <Link to="/products?category=Electronics" style={styles.heroBtnSecondary}>
              Explore Electronics
            </Link>
          </div>
          {/* Stats */}
          <div style={styles.heroStats}>
            {[['500+', 'Products'], ['10K+', 'Happy Customers'], ['4.8★', 'Avg Rating']].map(([val, label]) => (
              <div key={label} style={styles.heroStat}>
                <span style={styles.heroStatVal}>{val}</span>
                <span style={styles.heroStatLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Browse Categories</h2>
          <p style={styles.sectionSub}>Find what you're looking for</p>
        </div>
        <div style={styles.catGrid}>
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat} cat={cat} delay={i * 80} />
          ))}
        </div>
      </section>

      {/* ── BANNER ── */}
      <section style={styles.banner}>
        <div style={styles.bannerContent}>
          <div>
            <p style={styles.bannerTag}>Limited Time Offer</p>
            <h3 style={styles.bannerTitle}>Free Shipping on Orders Above ₹500!</h3>
            <p style={styles.bannerSub}>Use code <strong>SHOPKARO</strong> at checkout</p>
          </div>
          <Link to="/products" style={styles.bannerBtn}>Grab the Deal →</Link>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Featured Products</h2>
          <p style={styles.sectionSub}>Handpicked just for you</p>
        </div>

        {loading ? (
          <div style={styles.skeletonGrid}>
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div style={styles.productGrid}>
            {featured.map((p, i) => (
              <ProductCard key={p._id} product={p} delay={i * 100} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link to="/products" style={styles.heroBtnPrimary}>View All Products →</Link>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section style={{ background: '#f8fafc', padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Why ShopKaro?</h2>
            <p style={styles.sectionSub}>We make shopping simple and joyful</p>
          </div>
          <div style={styles.whyGrid}>
            {[
              { icon: '🚚', title: 'Fast Delivery', desc: 'Get your orders delivered in 2-5 business days across India' },
              { icon: '🔒', title: 'Secure Payments', desc: 'Razorpay & Stripe powered — your data is always safe' },
              { icon: '↩️', title: 'Easy Returns', desc: '7-day hassle-free return policy on all products' },
              { icon: '💬', title: '24/7 Support', desc: 'Our team is always here to help you with any issue' },
            ].map((item) => (
              <WhyCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div>
            <h3 style={styles.footerLogo}>🛍️ ShopKaro</h3>
            <p style={styles.footerTagline}>Your one-stop shop for everything.</p>
          </div>
          <div style={styles.footerLinks}>
            {[['/', 'Home'], ['/products', 'Products'], ['/cart', 'Cart'], ['/orders', 'My Orders']].map(([to, label]) => (
              <Link key={label} to={to} style={styles.footerLink}>{label}</Link>
            ))}
          </div>
        </div>
        <p style={styles.footerCopy}>© 2025 ShopKaro. Built with ❤️ using MERN Stack.</p>
      </footer>

    </div>
  );
};

/* ── Sub-components ── */

const CategoryCard = ({ cat, delay }) => {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), delay); }, [delay]);

  return (
    <Link
      to={`/products?category=${cat}`}
      style={{
        ...styles.catCard,
        opacity: mounted ? 1 : 0,
        transform: mounted ? (hovered ? 'translateY(-6px) scale(1.03)' : 'translateY(0)') : 'translateY(20px)',
        transition: 'all 0.3s ease',
        boxShadow: hovered ? '0 12px 30px rgba(59,130,246,0.15)' : '0 2px 8px rgba(0,0,0,0.05)',
        background: hovered ? '#eff6ff' : '#fff',
        borderColor: hovered ? '#3b82f6' : '#e2e8f0',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ fontSize: '2.2rem' }}>{categoryIcon(cat)}</span>
      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>{cat}</span>
    </Link>
  );
};

const ProductCard = ({ product: p, delay }) => {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), delay); }, [delay]);

  const discount = p.discountPrice > p.price
    ? Math.round(((p.discountPrice - p.price) / p.discountPrice) * 100)
    : null;

  return (
    <Link
      to={`/products/${p._id}`}
      style={{
        ...styles.productCard,
        opacity: mounted ? 1 : 0,
        transform: mounted ? (hovered ? 'translateY(-8px)' : 'translateY(0)') : 'translateY(30px)',
        transition: 'all 0.35s ease',
        boxShadow: hovered ? '0 20px 40px rgba(0,0,0,0.12)' : '0 2px 12px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={styles.imgBox}>
        {p.images?.[0] ? (
          <img
            src={p.images[0]}
            alt={p.name}
            style={{ ...styles.img, transform: hovered ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.4s ease' }}
          />
        ) : (
          <div style={styles.imgPlaceholder}>📦</div>
        )}
        {discount && <div style={styles.discountBadge}>{discount}% OFF</div>}
        {p.isFeatured && <div style={styles.featuredBadge}>⭐ Featured</div>}
      </div>

      {/* Info */}
      <div style={styles.productInfo}>
        <p style={styles.productCategory}>{p.category}</p>
        <p style={styles.productName}>{p.name}</p>
        <div style={styles.priceRow}>
          <span style={styles.productPrice}>₹{p.price.toLocaleString()}</span>
          {p.discountPrice > p.price && (
            <span style={styles.originalPrice}>₹{p.discountPrice.toLocaleString()}</span>
          )}
        </div>
        <div style={styles.ratingRow}>
          <span style={styles.stars}>{'★'.repeat(Math.round(p.ratings))}{'☆'.repeat(5 - Math.round(p.ratings))}</span>
          <span style={styles.ratingText}>{p.ratings.toFixed(1)} ({p.numReviews})</span>
        </div>
        <div style={{ ...styles.addToCartBtn, background: hovered ? '#2563eb' : '#3b82f6' }}>
          View Product →
        </div>
      </div>
    </Link>
  );
};

const SkeletonCard = () => (
  <div style={styles.skeleton}>
    <div style={styles.skeletonImg} />
    <div style={{ padding: '1rem' }}>
      <div style={{ ...styles.skeletonLine, width: '60%' }} />
      <div style={{ ...styles.skeletonLine, width: '90%', marginTop: '0.5rem' }} />
      <div style={{ ...styles.skeletonLine, width: '40%', marginTop: '0.5rem' }} />
    </div>
  </div>
);

const WhyCard = ({ icon, title, desc }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ ...styles.whyCard, transform: hovered ? 'translateY(-4px)' : 'none', boxShadow: hovered ? '0 12px 30px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.05)', transition: 'all 0.3s ease' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.whyIcon}>{icon}</div>
      <h4 style={styles.whyTitle}>{title}</h4>
      <p style={styles.whyDesc}>{desc}</p>
    </div>
  );
};

/* ── Styles ── */
const styles = {
  // Hero
  hero: { position: 'relative', background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 60%, #3b82f6 100%)', color: '#fff', padding: '7rem 2rem 5rem', overflow: 'hidden', minHeight: '520px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heroBg: { position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(99,102,241,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.2) 0%, transparent 50%)', pointerEvents: 'none' },
  heroContent: { position: 'relative', textAlign: 'center', maxWidth: '700px' },
  heroBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50px', padding: '0.4rem 1.2rem', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 600 },
  heroTitle: { fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-1px' },
  heroHighlight: { background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  heroSub: { fontSize: '1.1rem', opacity: 0.8, marginBottom: '2.5rem' },
  heroBtns: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' },
  heroBtnPrimary: { display: 'inline-block', background: '#fff', color: '#1e293b', padding: '0.85rem 2.2rem', borderRadius: '50px', fontWeight: 800, textDecoration: 'none', fontSize: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', transition: 'transform 0.2s' },
  heroBtnSecondary: { display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '0.85rem 2.2rem', borderRadius: '50px', fontWeight: 700, textDecoration: 'none', fontSize: '1rem', border: '2px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)' },
  heroStats: { display: 'flex', gap: '2rem', justifyContent: 'center', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '2rem' },
  heroStat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' },
  heroStatVal: { fontSize: '1.5rem', fontWeight: 800 },
  heroStatLabel: { fontSize: '0.8rem', opacity: 0.7 },

  // Sections
  section: { maxWidth: '1200px', margin: '0 auto', padding: '4rem 1rem' },
  sectionHeader: { textAlign: 'center', marginBottom: '2.5rem' },
  sectionTitle: { fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' },
  sectionSub: { color: '#64748b', fontSize: '1rem' },

  // Categories
  catGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' },
  catCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', padding: '1.8rem 1rem', borderRadius: '16px', textDecoration: 'none', border: '2px solid #e2e8f0', cursor: 'pointer' },

  // Banner
  banner: { background: 'linear-gradient(135deg, #1e293b, #334155)', margin: '0', padding: '3rem 1rem' },
  bannerContent: { maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' },
  bannerTag: { color: '#60a5fa', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' },
  bannerTitle: { color: '#fff', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' },
  bannerSub: { color: '#94a3b8', fontSize: '0.95rem' },
  bannerBtn: { display: 'inline-block', background: '#3b82f6', color: '#fff', padding: '0.85rem 2rem', borderRadius: '50px', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', fontSize: '1rem' },

  // Products
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' },
  productCard: { background: '#fff', borderRadius: '16px', overflow: 'hidden', textDecoration: 'none', color: '#1e293b', border: '1px solid #e2e8f0', cursor: 'pointer' },
  imgBox: { height: '200px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  imgPlaceholder: { fontSize: '3.5rem' },
  discountBadge: { position: 'absolute', top: '10px', left: '10px', background: '#ef4444', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '50px' },
  featuredBadge: { position: 'absolute', top: '10px', right: '10px', background: '#f59e0b', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '50px' },
  productInfo: { padding: '1.1rem' },
  productCategory: { fontSize: '0.72rem', color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' },
  productName: { fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem', color: '#0f172a', lineHeight: 1.4 },
  priceRow: { display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' },
  productPrice: { color: '#1d4ed8', fontWeight: 800, fontSize: '1.15rem' },
  originalPrice: { color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'line-through' },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.8rem' },
  stars: { color: '#f59e0b', fontSize: '0.8rem' },
  ratingText: { fontSize: '0.78rem', color: '#64748b' },
  addToCartBtn: { textAlign: 'center', color: '#fff', padding: '0.55rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', transition: 'background 0.2s' },

  // Skeleton
  skeletonGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' },
  skeleton: { background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' },
  skeletonImg: { height: '200px', background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' },
  skeletonLine: { height: '14px', background: '#e2e8f0', borderRadius: '6px' },

  // Why Us
  whyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' },
  whyCard: { background: '#fff', borderRadius: '16px', padding: '2rem 1.5rem', textAlign: 'center', border: '1px solid #e2e8f0', cursor: 'default' },
  whyIcon: { fontSize: '2.5rem', marginBottom: '1rem' },
  whyTitle: { fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', marginBottom: '0.5rem' },
  whyDesc: { color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 },

  // Footer
  footer: { background: '#0f172a', color: '#fff', padding: '3rem 1rem 1.5rem' },
  footerInner: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' },
  footerLogo: { fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' },
  footerTagline: { color: '#64748b', fontSize: '0.9rem' },
  footerLinks: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' },
  footerLink: { color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 },
  footerCopy: { textAlign: 'center', color: '#475569', fontSize: '0.85rem', borderTop: '1px solid #1e293b', paddingTop: '1.5rem', maxWidth: '1200px', margin: '0 auto' },
};

export default HomePage;