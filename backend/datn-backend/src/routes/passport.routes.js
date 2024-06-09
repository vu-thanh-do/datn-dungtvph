import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import User from '../models/user.model.js';

import { generateRefreshToken, generateToken } from '../configs/token.js';
import Enviroment from '../utils/checkEnviroment.js';
dotenv.config();

const PassportRoutes = express.Router();

PassportRoutes.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

PassportRoutes.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: Enviroment() + '/signin' }),
  function (req, res) {
    const { role } = req.user;
    if (role === 'customer') {
      const urlRedirect = Enviroment();
      res.redirect(urlRedirect);
    }
  }
);

PassportRoutes.get('/getUser', async (req, res) => {
  const user = req.user;

  if (user) {
    const token = generateToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id, role: user.role });
    await User.findOneAndUpdate({ _id: user._id }, { refreshToken: refreshToken });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'strict',
    });
    return res.json({
      user: {
        _id: user?._id,
        username: user?.username,
        slug: user?.slug,
        account: user?.account,
        address: user.address,
        avatar: user.avatar,
        role: user.role,
        gender: user.gender,
        birthday: user.birthday,
        accessToken: token,
        refreshToken,
      },
    });
  }
  return res.json({});
});

PassportRoutes.post('/logout', (req, res) => {
  req.logout(function (err) {
    res.clearCookie('refreshToken');
    if (err) {
      return res.status(400).json({ message: 'fail', err: err });
    }
    res.status(200).json({ status: true });
  });
});

export default PassportRoutes;
