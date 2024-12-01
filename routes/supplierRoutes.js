const express = require('express');
const { getAllSuppliers, getSupplierById, addSupplier, updateSupplierInfo, deleteSupplier } = require('../controllers/supplierController');
const router = express.Router();

router.get('/', getAllSuppliers);
router.get('/:id', getSupplierById)
router.post('/:id', addSupplier);
router.put('/:id', updateSupplierInfo);
router.delete('/:id', deleteSupplier);


module.exports = router;
