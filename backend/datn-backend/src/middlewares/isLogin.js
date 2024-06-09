import jwt from 'jsonwebtoken'
const secretKey = process.env.TOKEN_SECRET;

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.userId = decoded._id; // Lưu thông tin người dùng vào request
    next(); // Cho phép request tiếp tục điều hướng
  });
}

export default verifyToken;
