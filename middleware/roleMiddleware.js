import jwt from 'jsonwebtoken';

export const roleMiddleware = (roles) => {
    return function (req, res, next) {
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'Ошибка авторизации' });
    }
  const  {roles: userRoles} = jwt.verify(token, process.env.SECRET);
  console.log(`User ID`, roles);
  
  let hasRole = false;
  if (userRoles === roles) {
    hasRole = true;

  }
  if (!hasRole) {
    return res.status(403).json({ message: 'Недостаточно прав' });
  }
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: 'Ошибка авторизации' });
  }
}
};
