const express = require('express');
const router = express.Router();
const gooseController = require('../controllers/gooseController');

router.get('/version', gooseController.getGooseVersion);
router.get('/news', gooseController.getGooseNews);
router.get('/health', gooseController.gooseHealthCheck);

module.exports = router;
