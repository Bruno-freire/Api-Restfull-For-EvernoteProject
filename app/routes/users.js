var express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken')
require('dotenv').config();
const secret = process.env.JWT_TOKEN

const User = require('../models/user');
const withAuth = require('../middlewares/auth');
const { generateAuthenticationCode, sendConfirmationEmail } = require('../utils/authUtils');
const { validateAndTransformEmail } = require('../utils/validatedEmail');

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const validatedEmail = validateAndTransformEmail(email)
  const user = new User({ name, email: validatedEmail, password });

  try {
    const existingUser = await User.findOne({email: validatedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async(req, res) => {
  const {email, password} = req.body
  const validatedEmail = validateAndTransformEmail(email)
 
  try {
    const user = await User.findOne({email: validatedEmail});
    if(!user){
      return res.status(401).json({error: 'incorrect email or password'});
    }else {
      if(!user.authenticated){
        return res.status(400).json({error: 'unauthenticated email'})
      }
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

router.post('/authentication/send-code', async (req,res) => {
  const { email } = req.body
  const authenticationCode = generateAuthenticationCode()
  const validatedEmail = validateAndTransformEmail(email)
  
  try {
    const user = await User.findOne({email: validatedEmail});

    if (user.authenticated) {
      return res.status(403).json({ message: 'User already authenticated' });
    }
    
    user.authenticationCode = authenticationCode;
    user.authenticationCodeCreatedAt = Date.now();
    await user.save()
    await sendConfirmationEmail(user.email, authenticationCode)
    res.status(200).json({message: "authentication sent"})
  } catch (error) {
    res.status(500).json({ error: 'There was an error sending the authentication code' });
  }
})

router.post('/authentication/verify-code', async (req, res) => {
  const { authenticationCode, email } = req.body;
  const validatedEmail = validateAndTransformEmail(email)

  try {
    const user = await User.findOne({email: validatedEmail})

    if (user.authenticated) {
      return res.status(403).json({ message: 'User already authenticated' });
    }

    if (authenticationCode === user.authenticationCode) {
      user.authenticated = true;
      await user.save();
      return res.status(200).json({ message: 'Authentication code is correct' });
    } else {
      return res.status(400).json({ error: 'Invalid authentication code' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while verifying the authentication code' });
  }
});

router.put('/', withAuth, async (req, res) => {
  const {name, email} = req.body
  const validatedEmail = validateAndTransformEmail(email)

  try {
    const user = await User.findOneAndUpdate(
      {_id: req.user._id},
      {$set: {name: name, email: validatedEmail}},
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