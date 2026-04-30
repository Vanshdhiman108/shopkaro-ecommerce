const mongoose = require('mongoose');
require('dotenv').config();

const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    discountPrice: { type: Number, default: 0 },
    category: String,
    brand: String,
    images: [String],
    stock: Number,
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [],
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

const sampleProducts = [
  {
    name: 'Wireless Earbuds Pro',
    description: 'Premium sound quality with 30hr battery life, ANC, and IPX5 water resistance. Perfect for workouts and daily commute.',
    price: 1999,
    discountPrice: 2499,
    category: 'Electronics',
    brand: 'SoundMax',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'],
    stock: 50,
    ratings: 4.5,
    numReviews: 12,
    isFeatured: true,
  },
  {
    name: 'Smart Watch Series 5',
    description: 'Track your fitness, heart rate, sleep, and notifications. AMOLED display with 7-day battery backup.',
    price: 3499,
    discountPrice: 4999,
    category: 'Electronics',
    brand: 'FitPro',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
    stock: 30,
    ratings: 4.3,
    numReviews: 8,
    isFeatured: true,
  },
  {
    name: 'Mechanical Keyboard RGB',
    description: 'Full-size mechanical keyboard with Cherry MX Blue switches, RGB backlighting, and aluminum frame.',
    price: 2799,
    discountPrice: 3499,
    category: 'Electronics',
    brand: 'KeyMaster',
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400'],
    stock: 20,
    ratings: 4.7,
    numReviews: 15,
    isFeatured: false,
  },
  {
    name: 'Running Shoes AirFlex',
    description: 'Lightweight running shoes with responsive cushioning, breathable mesh upper, and anti-slip sole.',
    price: 1299,
    discountPrice: 1899,
    category: 'Sports',
    brand: 'SpeedRun',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
    stock: 75,
    ratings: 4.2,
    numReviews: 20,
    isFeatured: true,
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra thick 6mm non-slip yoga mat with alignment lines, carrying strap, and eco-friendly TPE material.',
    price: 699,
    discountPrice: 999,
    category: 'Sports',
    brand: 'ZenFit',
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400'],
    stock: 100,
    ratings: 4.4,
    numReviews: 9,
    isFeatured: false,
  },
  {
    name: 'Men\'s Casual T-shirt',
    description: 'Comfortable cotton-blend t-shirt with ribbed cuffs, and relaxed fit. Available in multiple colors.',
    price: 899,
    discountPrice: 1299,
    category: 'Clothing',
    brand: 'UrbanWear',
    images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400'],
    stock: 60,
    ratings: 4.1,
    numReviews: 7,
    isFeatured: false,
  },
  {
    name: 'Women\'s Floral Dress',
    description: 'Elegant floral print summer dress with A-line silhouette, V-neck, and breathable fabric. Perfect for casual outings.',
    price: 1199,
    discountPrice: 1599,
    category: 'Clothing',
    brand: 'BloomStyle',
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400'],
    stock: 40,
    ratings: 4.6,
    numReviews: 11,
    isFeatured: true,
  },
  {
    name: 'JavaScript: The Good Parts',
    description: 'Classic programming book by Douglas Crockford covering the best features of JavaScript. Must-read for every web developer.',
    price: 499,
    discountPrice: 699,
    category: 'Books',
    brand: "O'Reilly",
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'],
    stock: 200,
    ratings: 4.8,
    numReviews: 25,
    isFeatured: false,
  },
  {
    name: 'Aromatherapy Candle Set',
    description: 'Set of 6 soy wax aromatherapy candles — lavender, vanilla, jasmine, sandalwood, rose, and eucalyptus.',
    price: 799,
    discountPrice: 1199,
    category: 'Home',
    brand: 'AromaBliss',
    images: ['https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400'],
    stock: 80,
    ratings: 4.5,
    numReviews: 14,
    isFeatured: false,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: '360° surround sound, 12hr battery, IPX7 waterproof. Perfect for outdoor trips, beach, and camping.',
    price: 1599,
    discountPrice: 2199,
    category: 'Electronics',
    brand: 'BoomBox',
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400'],
    stock: 35,
    ratings: 4.3,
    numReviews: 18,
    isFeatured: true,
  },
  {
    name: 'Vitamin C Face Serum',
    description: '20% Vitamin C serum with hyaluronic acid and niacinamide. Brightens skin, reduces dark spots, and boosts collagen.',
    price: 599,
    discountPrice: 899,
    category: 'Beauty',
    brand: 'GlowUp',
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400'],
    stock: 120,
    ratings: 4.4,
    numReviews: 22,
    isFeatured: false,
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Double-wall insulated 1L bottle — keeps drinks cold 24hr, hot 12hr. BPA-free, leak-proof lid.',
    price: 449,
    discountPrice: 699,
    category: 'Sports',
    brand: 'HydroFlow',
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400'],
    stock: 150,
    ratings: 4.6,
    numReviews: 30,
    isFeatured: false,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    const existing = await Product.countDocuments();
    if (existing > 0) {
      console.log(`⚠️  ${existing} products already exist.`);
      console.log('   Deleting existing products and re-seeding...');
      await Product.deleteMany({});
    }

    await Product.insertMany(sampleProducts);
    console.log(`🎉 ${sampleProducts.length} products seeded successfully!`);
    console.log('\nProducts added:');
    sampleProducts.forEach((p, i) => console.log(`  ${i + 1}. ${p.name} — ₹${p.price} (${p.category})`));

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

seed();