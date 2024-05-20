const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');

//For Assign authToken to JWT_SECRET ( which represents the secret key used to sign and verify the JWT.)
const JWT_SECRET = 'Ahmad.com'

//ROUTE-1: "Create a User using: POST "/api/auth/createuser/". No login require
router.post('/createuser', [
    body('name', 'Enter valid Name').isLength({ min: 3 }),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
    body('email', 'Enter valid email ').isEmail()
], async (req, res) => {
    let success = false;

    //If error return (Bad request and erros)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        //check wether the user with this email exits already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "User with this email already exists" })
        }
        //Hash password
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)
        //Create a new User
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })
        const data = {
            user: {
                id: user.id
            }
        }
        //create jsonwebTokken
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken })

        //catch errors
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


//ROUTE-2: Authanticate a User using: POST "/api/auth/login/". No login require
router.post('/login', [
    body('password', 'Password cannot be blank').exists(),
    body('email', 'Enter valid email ').isEmail()
], async (req, res) => {
    let success = false;
    //If error return (Bad request and erros)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //get email and password from user
    const { email, password } = req.body;
    try {
        //check in DB
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, errors: "Login Incorrect" });
        }
        // Check Password
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, errors: "Login Incorrect" });

        }
        const data = {
            user: {
                id: user.id
            }
        }
        //using jsonwebTokken
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


//ROUTE-3: Get loggedin User Details using: POST "/api/auth/getuser/". login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");

    }
})


module.exports = router;