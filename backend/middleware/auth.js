import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // 1. Get token from the 'Authorization' header
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  // 2. Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // 3. Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Add user's ID to the request object
    req.userId = decoded.userId;
    next(); // Move on to the next function (the route handler)
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default authMiddleware;
