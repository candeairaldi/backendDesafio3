const express = require('express');
const router = express.Router();

// Ruta para la vista de productos en tiempo real
router.get('/', (req, res) => {
  res.render('realtimeProducts', { products });
});

module.exports = router;