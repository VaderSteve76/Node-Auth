const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');


router.post('/register', async (req, res) => {
//Validate data before becoming a user
  const { error } = registerValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  //Check if user is already in DB
  const emailExist = await User.findOne({ email: req.body.email });
  if(emailExist) return res.status(400).send('email already exists');

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt); 

  //Create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err){
    res.status(400).send(err);
  }
});

router.post('/login', async (req, res) => {
  //Validate data before becoming a user
  const { error } = loginValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  //Check if user is already in DB
  const user = await User.findOne({ email: req.body.email });
  if(!user) return res.status(400).send('Incorrect email or password');

  //Password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if(!validPassword) return res.status(400).send('Invalid password');

  //Create token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);

  // res.send('Login Successful!');
});



module.exports = router;