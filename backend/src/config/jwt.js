import jwt from 'jsonwebtoken';

const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    { expiresIn: '7d' }
  );
};

const verifyToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET || 'your-secret-key-change-in-production'
  );
};

export { generateToken, verifyToken };
