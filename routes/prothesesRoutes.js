const express = require('express');
const { getAllProtheses, getProthesisById, addProthesis, deleteProthesis, updateProthesis } = require('../controllers/prothesesController');
const router = express.Router();

router.get('/', getAllProtheses);
router.get('/:id', getProthesisById);
router.post('/', addProthesis);
router.put('/', updateProthesis);
router.delete(':id', deleteProthesis );

module.exports = router;
