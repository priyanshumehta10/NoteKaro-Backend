const express = require('express');
const User = require('../models/User');
const router = express.Router()
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
const JWT_SECRET = "harryisgoodb@y";
const fetchuser = require('../middleware/fetchuser');

//ROUTE 1: Create a user : POST "/api/auth/createUser" No login required
router.post('/createUser', [
  body('email', 'Enter a Valid Email').isEmail(),
  body('name', 'Enter a Valid Name').isLength({ min: 3 }),
  body('password', "Please Provide A Strong One").isLength({ min: 5 })

], async (req, res) => {
  //if there are errors return bad requestand the errors 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // chacke whether the user with the same email already exists
  try {
    let user = await User.findOne({ email: req.body.email })
    if (user) {
      return res.status(400).json({ error: "Sorry a user with the same email already exists" })
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt)
    //Create a new user
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    })

    const data = {
      user: {
        id: user.id
      }
    }
    var authtoken = jwt.sign(data, JWT_SECRET);


    success = true;
    res.json({success, authtoken })

  } catch (error) {
    console.error(error.message);
    success = false;
    res.status(500).json({success,error:"Some Error occurred"});

  }

})

//ROUTE 2:login user : POST "/api/auth/login" No login required
router.post('/login', [
  body('email', 'Enter a Valid Email').isEmail(),
  body('password', "password can't be blank").exists()

], async (req, res) => {
  //if there are errors return bad requestand the errors 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email })
    if (!user) {
      success = false;
      return res.status(400).json({success, error: "Please try to login with correct credentials" })
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false;
      return res.status(400).json({success, error: "Please try to login with correct credentials" })
    }
    const data = {
      user: {
        id: user.id
      }
    }
    var authtoken = jwt.sign(data, JWT_SECRET);

    success = true;
    res.json({success, authtoken })
  } catch (error) {
    console.error(error.message);
    success = false;
    res.status(500).json({success,error:"Some Error occurred"});

  }
})
// ROUTE 3: get loggedin User Details using : POST "/api/auth/getuser"  login required
router.get('/getuser', fetchuser, async (req, res) => {

  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error occurred");
  }
})
module.exports = router