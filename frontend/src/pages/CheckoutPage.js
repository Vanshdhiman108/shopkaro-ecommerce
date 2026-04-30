import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, createRazorpayOrder, verifyRazorpayPayment, updateOrderToPaid } from '../utils/api';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cart, emptyCart } = useCart();
  const { user }            = useAuth();
  const navigate            = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading]             = useState(false);
  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    country: 'India',
  });

  const shipping = cart.totalPrice > 500 ? 0 : 50;
  const tax      = Math.round(cart.totalPrice * 0.18);
  const total    = cart.totalPrice + shipping + tax;

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.pincode) {
      return toast.error('Please fill in your shipping address');
    }
    setLoading(true);

    try {
      const orderItems = cart.items.map((i) => ({
        product: i.product._id || i.product,
        name: i.product.name || 'Product',
        image: i.product.images?.[0] || '',
        price: i.price,
        quantity: i.quantity,
      }));

      // Create order in DB
      const orderRes = await createOrder({ orderItems, shippingAddress: address, paymentMethod });
      const orderId  = orderRes.data.order._id;

      if (paymentMethod === 'razorpay') {
        // Create Razorpay order
        const rpRes = await createRazorpayOrder({ amount: total });
        const { order: rpOrder, key } = rpRes.data;

        const options = {
          key,
          amount: rpOrder.amount,
          currency: 'INR',
          name: 'ShopKaro',
          description: 'Payment for your order',
          order_id: rpOrder.id,
          handler: async (response) => {
            try {
              await verifyRazorpayPayment({ ...response, orderId });
              await emptyCart();
              toast.success('Payment successful! 🎉');
              navigate(`/orders/${orderId}`);
            } catch {
              toast.error('Payment verification failed');
            }
          },
          prefill: { name: user.name, email: user.email },
          theme: { color: '#3b82f6' },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else if (paymentMethod === 'cod') {
        await emptyCart();
        toast.success('Order placed! Pay on delivery.');
        navigate(`/orders/${orderId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  const field = (label, key, type = 'text') => (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <input type={type} value={address[key]} onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
        style={styles.input} placeholder={label} />
    </div>
  );

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>Checkout</h1>
      <div style={styles.layout}>
        {/* Left: Address + Payment */}
        <div>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>📦 Shipping Address</h2>
            {field('Street / House No.', 'street')}
            {field('City', 'city')}
            {field('State', 'state')}
            {field('Pincode', 'pincode')}
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>💳 Payment Method</h2>
            {[['razorpay', '🏦 Razorpay (UPI / Card / NetBanking)'], ['cod', '💵 Cash on Delivery']].map(([val, label]) => (
              <label key={val} style={styles.radioLabel}>
                <input type="radio" value={val} checked={paymentMethod === val} onChange={() => setPaymentMethod(val)} style={{ marginRight: '0.5rem' }} />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Right: Summary */}
        <div style={styles.summary}>
          <h2 style={styles.sectionTitle}>🧾 Order Summary</h2>
          {cart.items.map((item) => (
            <div key={item.product._id || item.product} style={styles.summaryItem}>
              <span>{item.product.name || 'Item'} × {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div style={styles.divider} />
          <div style={styles.summaryRow}><span>Subtotal</span><span>₹{cart.totalPrice.toLocaleString()}</span></div>
          <div style={styles.summaryRow}><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
          <div style={styles.summaryRow}><span>GST (18%)</span><span>₹{tax}</span></div>
          <div style={{ ...styles.summaryRow, fontWeight: 700, fontSize: '1.2rem', borderTop: '2px solid #e2e8f0', paddingTop: '1rem', marginTop: '0.5rem' }}>
            <span>Total</span><span>₹{total.toLocaleString()}</span>
          </div>
          <button onClick={handlePlaceOrder} style={styles.placeBtn} disabled={loading}>
            {loading ? 'Processing...' : `Place Order • ₹${total.toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' },
  title: { fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem', color: '#1e293b' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' },
  section: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' },
  sectionTitle: { fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', color: '#1e293b' },
  field: { marginBottom: '0.75rem' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#475569', marginBottom: '0.3rem' },
  input: { width: '100%', padding: '0.6rem 0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' },
  radioLabel: { display: 'flex', alignItems: 'center', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '0.5rem', cursor: 'pointer', fontWeight: 500 },
  summary: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', height: 'fit-content', position: 'sticky', top: '80px' },
  summaryItem: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#475569' },
  divider: { borderTop: '1px solid #e2e8f0', margin: '1rem 0' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#475569' },
  placeBtn: { width: '100%', padding: '0.9rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: '1.5rem' },
};

export default CheckoutPage;
