const express = require('express');
const router = express.Router();
const {getAllUsers, getUserById, register, login, updateUserInfo, assignRole, changePassword, deleteUser} =require('../controllers/userController')
router.get('/', getAllUsers);
router.get('/:id', getUserById)
router.post('/register', register);
router.post('/login', login);
router.put('/:id', updateUserInfo);
router.put('/:id/role', assignRole);
router.put('/:id/password', changePassword);
router.delete('/:id', deleteUser);


module.exports = router;
