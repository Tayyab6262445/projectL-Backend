// /controllers/authController.js
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.createUser = async (req, res) => {
  let success = false;
  
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    // Check if user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success, err: 'User already exists with this email' });
    }

    // Hash the password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPass = bcrypt.hashSync(req.body.password, salt);

    // Create the new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPass,
    });

    // Generate JWT token
    const data = {
      user: {
        id: user.id,
      },
    };
    success = true;
    const token = jwt.sign(data, process.env.JWT_KEY);

    // Respond with token
    res.json({ success, token });
  } catch (error) {
    res.status(500).send({ success, error: error.message });
  }
};



exports.loginUser = async (req, res) => {
    let success = false;
    
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ success, errors: errors.array() });
    }
  
    try {
      const { email, password } = req.body;
  
      // Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success, error: "Please login with correct credentials" });
      }
  
      // Compare passwords
      const passCompare = bcrypt.compareSync(password, user.password);
      if (!passCompare) {
        return res.status(400).json({ success, error: "Please login with correct credentials" });
      }
  
      // Generate JWT token
      const data = {
        user: {
          id: user.id,
          name:user.name
        }
      };
  
      success = true;
      const token = jwt.sign(data, process.env.JWT_KEY); // Use secret from .env
      res.json({ success, token });
  
    } catch (error) {
      res.status(500).send({ success: false, error: "Internal Server Error" });
    }
  };




  exports.getUser = async (req, res) => {
  
    try {
      let userId = req.user.id; // `req.user` is available from the fetchUser middleware
      const user = await User.findById(userId).select('-password'); // Exclude password field
      res.send(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  };