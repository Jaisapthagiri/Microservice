import jwt from 'jsonwebtoken';

export const verifyJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer '))
      return res.status(401).json({ error: 'Unauthorized: Token missing' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.DJANGO_JWT_SECRET);

    req.userId = decoded.user_id; 
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
