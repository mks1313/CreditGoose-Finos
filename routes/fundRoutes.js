const express = require('express');
const router = express.Router();
const fundController = require('../controllers/fundController');

router.post('/request', fundController.requestFunding);

module.exports = router;
