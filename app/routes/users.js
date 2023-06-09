var express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken')
require('dotenv').config();
const secret = process.env.JWT_TOKEN

const User = require('../models/user');
const withAuth = require('../middlewares/auth');

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

router.post('/login', async(req, res) => {
  const {email, password} = req.body

  try {
    let user = await User.findOne({email});
    if(!user){
      res.status(401).json({error: 'incorrect email or password'});
    }else {
      user.isCorrectPassword(password, function (err, same) {
        if(!same){
          res.status(401).json({error: 'incorrect email or password'});
        }else{
          const token = jwt.sign({email}, secret, {expiresIn: '1d'});
          res.status(200).json({user: user, token: token})
        }
      })
    }
  } catch (error) {
    res.status(500).json({error: "Internal error, please try again"})
  }
})

router.put('/', withAuth, async (req, res) => {
  const {name, email} = req.body

  try {
    const user = await User.findOneAndUpdate(
      {_id: req.user._id},
      {$set: {name: name, email: email}},
      {$upsert: true, 'new': true}
    )
    res.status(200).json(user)
  } catch (error) {
    res.status(401).json({error: error.message})
  }
})

router.put('/password', withAuth, async (req, res) => {
  const {password} = req.body

  try {
    const user = await User.findOne({_id: req.user._id})
    user.password = password
    await user.save()
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({error: error.message})    
  }
})

router.delete('/', withAuth, async (req, res) => {
  try {
    const user = await User.findOneAndDelete(
      {_id: req.user._id}
    )
    res.status(200).json(user)
  } catch (error) {
    res.status(401).json({error: error.message})    
  }
})

module.exports = router;
