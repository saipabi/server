// routes/logoutRoutes.js
const express = require('express');
const router = express.Router();


router.post('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

module.exports = router;
