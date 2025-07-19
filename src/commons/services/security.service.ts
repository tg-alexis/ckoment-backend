import { Injectable } from '@nestjs/common';
import { SignJWT, jwtVerify } from 'jose';

@Injectable()
export class SecurityService {
  constructor() {}

  /**
   * Signs a JSON Web Token (JWT) with the given data and secret.
   *
   * @param payload - The payload to sign (object).
   * @param secret - The secret key to sign the token with.
   * @param expiresIn - The expiration time of the token (default is '1d').
   * @returns Promise<string> The signed JWT.
   */
  async signJwt(
    payload: Record<string, any>,
    secret: string,
    expiresIn: string = '1d',
  ): Promise<string> {
    const secretKey = new TextEncoder().encode(secret);

    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(secretKey);

    return jwt;
  }

  /**
   * Verifies a JSON Web Token (JWT) with the given secret.
   *
   * @param token - The JWT to verify.
   * @param secret - The secret key to verify the token with.
   * @returns Promise<any> The decoded payload if the token is valid, or null if invalid.
   */
  async verifyJwt(token: string, secret: string): Promise<any> {
    try {
      const secretKey = new TextEncoder().encode(secret);

      const { payload } = await jwtVerify(token, secretKey);
      return payload;
    } catch (error) {
      console.log('JWT verification error:', error.message);
      return null;
    }
  }
}
