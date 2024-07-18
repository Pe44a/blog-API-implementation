const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


exports.login = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      if (username !== process.env.ADMIN_USERNAME) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const payload = {
        user: 'admin',
      };
  
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict', 
        maxAge: 3600000 // 1 hour in milliseconds
      });
  
      res.json({ token: token, message: 'Logged in successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };



exports.authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.user !== 'admin') {
        throw new Error('Not authorized');
        }
        req.user = 'admin';
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};