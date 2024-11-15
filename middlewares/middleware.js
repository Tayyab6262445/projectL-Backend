// middleware/auth.js
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

// module.exports = function (req, res, next) {
//   const token = req.cookies.token; // Access token from cookies

//   if (!token) {
//     return res.status(401).json({ error: "Access denied. No token provided." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_KEY); // Verify token
//     req.user = decoded.user; // Attach user to request object
//     next(); // Proceed to the next middleware
//   } catch (err) {
//     res.status(400).json({ error: "Invalid token." });
//   }
// };



const authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token Provided' });
  }

  if (!process.env.JWT_KEY) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ message: 'Internal server error' });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      console.log('Decoded token:', decoded);

      req.user = await User.findById(decoded.user.id);
      console.log('User found:', req.user);

      if (!req.user) {
          console.log(`User not found in DB for ID: ${decoded.user.id}`);
          return res.status(401).json({ message: 'User not found' });
      }

      console.log('User authenticated:', req.user);
      next();
  } catch (error) {
      console.error('JWT verification failed:', error.message);
      return res.status(401).json({ message: 'jwt verification failed' });
  }
};

// const authenticateUser = async (req, res, next) => {

//     const token = req.header('Authorization')?.replace('Bearer ', '');
//     if (!token) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }
  
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret
//       req.user = await User.findById(decoded.id);
//       if (!req.user) {
//         return res.status(401).json({ message: 'Unauthorized' });
//       }
//       next();
//     } catch (error) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }
//   };


const fetchUser=(req,res,next)=>{
    const token=req.header('auth-token')
    if(!token){
        res.status(401).send({error:'no token'})
    }
    try {
        var data = jwt.verify(token, process.env.JWT_KEY);
        req.user=data.user;
        next();
    } catch (error) {
        res.status(401).send({error:'pls authenticate using a valid token'})
    }
    }
    
    

    module.exports = {
       fetchUser,
       authenticateUser
    };