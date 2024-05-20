const jwt = require('jsonwebtoken');

//For Assign authToken to JWT_SECRET ( which represents the secret key used to sign and verify the JWT.)
const JWT_SECRET = 'Ahmad.com'

const fetchuser = (req, res, next) => {
    //Get user from jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authanticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();

    } catch (error) {
        res.status(401).send({ error: "Please authanticate using a valid token" })
    }
}

module.exports = fetchuser;