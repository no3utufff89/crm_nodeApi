import jwt from 'jsonwebtoken';

export const tokenLogin = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'Ошибка авторизации' });
    }
    const decodedData = jwt.verify(token, process.env.SECRET);    
    req.id = decodedData.id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: 'Ошибка авторизации' });
  }
};
