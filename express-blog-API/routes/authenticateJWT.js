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

      // Send the token in the response body
      res.json({ token: token, message: 'Logged in successfully' });
      } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
};



exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
      return res.status(401).json({ message: 'No token, authorization denied' });
  }
  // Format should be: "Bearer [token]"
  const token = authHeader.split(' ')[1];
  if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.user !== 'admin') {
          throw new Error('Not authorized');
      }
      req.user = 'admin';
      res.status(201).json({message:'authorized successfully'})
      next();
  } catch (err) {
      res.status(401).json({ message: 'Token is not valid' });
  }
};