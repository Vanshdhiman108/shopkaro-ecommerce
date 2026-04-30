const express = require('express');
const router = express.Router();
const {
  getAllProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);
router.post('/:id/review', protect, addReview);

module.exports = router;
