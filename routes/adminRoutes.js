const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

router.get('/scoring', adminController.getPrompts);
router.post('/scoring', adminController.setPrompts);
router.post('/goose', adminController.runGoose);

module.exports = router;
