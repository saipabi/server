// routes/logoutRoutes.js
const express = require('express');
const router = express.Router();

// With JWT, logout is handled on client by deleting token.
// This route is optional, just returns success.
router.post('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

module.exports = router;
