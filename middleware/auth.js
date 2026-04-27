import jwt from "jsonwebtoken";
import { TOKEN_KEY } from "../config/config.js";

export const verifyToken = (req, res, next) => {


  const tokenHeader = req.header('Authorization');

  if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {

    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = tokenHeader.split(' ')[1];
  jwt.verify(token, TOKEN_KEY, (err, user) => {
    if (err) {

      return res.status(401).json({ message: 'Invalid token' });
    }
    // Normalizar campos del payload para evitar undefined
    // Algunos tokens usan `user_id` (underscore) en lugar de `userId` (camelCase)
    user.userId = user.userId || user.user_id || user.id;
    // Si existe un tipo de usuario en el token, normalizarlo también
    user.userType = user.userType || user.typeusers_id || user.type || null;

    req.user = user;
    next();
  });
}; 
/*

import jwt from "jsonwebtoken";
import { TOKEN_KEY } from "../config/config.js";

export const verifyToken = (req, res, next) => {
  
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  if (!authHeader.startsWith('Bearer ')) {

    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  try {
    const decoded = jwt.verify(token, TOKEN_KEY);
    req.user = decoded;
    next();
  } catch (error) {

    return res.status(401).json({ message: 'Invalid token' });
  }
};*/