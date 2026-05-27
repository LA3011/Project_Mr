import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendRecoveryEmail } from '../utils/mailer.js';
import type { Secret, SignOptions } from 'jsonwebtoken';
import type { UserPayload } from '../interfaces/UserPayload.interface.js';
import dotenv from 'dotenv';
import { UserRepository } from '../repositories/user.repository.js';

dotenv.config();

const SECRET: Secret = process.env.JWT_SECRET || 'default_secret_fallback';
const REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET || 'refresh_fallback';

export const generateToken = (payload: object) => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '1h'
  };

  return jwt.sign(payload, SECRET, options);
};

export const verifyToken = (token: string): UserPayload => {
  return jwt.verify(token, SECRET) as UserPayload;
};

export const generateRefreshToken = (payload: object) => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '7d'
  };

  return jwt.sign(payload, REFRESH_SECRET, options);
};

export const verifyRefreshToken = (token: string): UserPayload => {
  return jwt.verify(token, REFRESH_SECRET) as UserPayload;
};

export const handleForgotPassword = async (email: string): Promise<void> => {

  const TIME_EXPIRE = Number(process.env.TIME_EXPIRE_TOKEN) || 15;
  
  const user = await UserRepository.findByEmail(email);
  if (!user) return;

  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  const tokenExpires = new Date(Date.now() + TIME_EXPIRE * 60 * 1000);

  await UserRepository.saveRecoveryToken(user.id_usuario, hashedToken, tokenExpires);
  await sendRecoveryEmail(email, rawToken);
};

export const handleResetPassword = async (token: string, newPassword: string): Promise<void> => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await UserRepository.findByResetToken(hashedToken);
  if (!user) throw new Error('INVALID_TOKEN');

  const now = new Date();
  if (now > new Date(user.token_recuperacion_expira)) {
    throw new Error('EXPIRED_TOKEN');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await UserRepository.updatePasswordAndClearToken(user.id_usuario, hashedPassword);
};