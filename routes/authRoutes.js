// /routes/authRoutes.js
const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const {fetchUser  } = require('../middlewares/middleware');
const router = express.Router();

// Route to create a new user
router.post(
  '/createuser',
  [
    body('name', 'Name should be minimum of 3 characters').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password is too short').isLength({ min: 5 }),
  ],
  authController.createUser
);



router.post(
    '/login',
    [
      body('email', 'Enter a valid email').isEmail(),
      body('password', 'Password cannot be blank').exists()
    ],
    authController.loginUser
  );


  router.post('/getuser', fetchUser, authController.getUser);

module.exports = router;
