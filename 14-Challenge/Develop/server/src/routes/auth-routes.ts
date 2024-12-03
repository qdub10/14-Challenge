import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response): Promise<Response> => {
  // TODO: If the user exists and the password is correct, return a JWT token
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json('User not found');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json('Incorrect password');
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    return res.json({ token });
  } catch (err) {
    return res.status(500).json('Internal server error');
  }
};

const router = Router();

// POST /login - Login a user
router.post('/login', login);

export default router;
