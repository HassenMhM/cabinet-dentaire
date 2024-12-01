const express = require('express');
const { getAllProducts, addProduct, deleteProduct } = require('../controllers/stockController');
const router = express.Router();

router.get('/', getAllProducts);
router.post('/addProduct', addProduct);
router.delete('/deleteProduct/:id', deleteProduct);

module.exports = router;
