var express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken')
require('dotenv').config();
const secret = process.env.JWT_TOKEN

const User = require('../models/user');


router.post('/register', async(req, res) => {
  const {name, email, password} = req.body;
  const user = new User({name,email,password})

  try {
    await user.save();
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({error: `Error registering new user`})
  }
})

module.exports = router;
