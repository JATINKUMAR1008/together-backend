import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/app.config';
import { UnauthorizedException } from './apiErrors';

export interface TokenPayload {
  userId: string;
  workspaceId?: string;
  email?: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload,
    config.JWT_SECRET as jwt.Secret,
    { expiresIn: config.JWT_EXPIRES_IN } as SignOptions
  );
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload,
    config.JWT_REFRESH_SECRET as jwt.Secret,
    { expiresIn: config.JWT_REFRESH_EXPIRES_IN } as SignOptions
  );
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET as jwt.Secret) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new UnauthorizedException('Invalid or expired token');
  }
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, config.JWT_REFRESH_SECRET as jwt.Secret) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new UnauthorizedException('Invalid or expired refresh token');
  }
};
