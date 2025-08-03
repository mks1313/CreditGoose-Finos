const express = require('express');
const router = express.Router();
const { simulate } = require('../controllers/simulateController');
const { healthCheck } = require('../controllers/healthController');

router.get('/', (req, res) => {
  res.send('🚀 Backend de CreditGoose funcionando en Vercel!');
});

router.get('/simulate', simulate);
router.get('/health', healthCheck);

module.exports = router;