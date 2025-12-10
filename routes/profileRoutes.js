// routes/profileRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// GET /api/profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        dob: user.dob,
        contact: user.contact,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
    });
  }
});

// PUT /api/profile
router.put(
  '/',
  authenticateToken,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('age')
      .optional()
      .isInt({ min: 1, max: 150 })
      .withMessage('Age must be between 1 and 150'),
    body('dob').optional().isISO8601().withMessage('Invalid date format'),
    body('contact').optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { name, age, dob, contact } = req.body;

      const updateData = {};
      if (name !== undefined && name !== null) updateData.name = name.trim();
      if (age !== undefined && age !== null) {
        const ageNum = parseInt(age, 10);
        if (!isNaN(ageNum)) {
          updateData.age = ageNum;
        }
      }
      if (dob !== undefined && dob !== null && dob !== '') updateData.dob = dob;
      if (contact !== undefined && contact !== null) updateData.contact = contact.trim();

      const user = await User.findByIdAndUpdate(
        req.userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
          dob: user.dob,
          contact: user.contact,
        },
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
      });
    }
  }
);

module.exports = router;
