const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/connect', authController.connect);

module.exports = router;