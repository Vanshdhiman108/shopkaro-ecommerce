const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @route   GET /api/admin/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalOrders, totalProducts, orders] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments(),
      Product.countDocuments(),
      Order.find({ isPaid: true }),
    ]);

    const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: { totalUsers, totalOrders, totalProducts, totalRevenue: totalRevenue.toFixed(2) },
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
