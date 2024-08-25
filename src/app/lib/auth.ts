// import jwt from 'jsonwebtoken';
import { getRequestContext } from '@cloudflare/next-on-pages';
import * as jose from 'jose'

export async function login(password: string) {
  const context =  getRequestContext();
  if(password === context.env.PASSWORD) {
    return genToken(password, "7d");
  }
  return null;
}

async function genToken(password: string, expiresIn: number | string) {
  const alg = 'HS256'

  const jwt = await new jose.SignJWT({ 'pass': true })
    .setProtectedHeader({ alg })
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(
      password,
    ))
  return jwt;
}

export async function checkToken(token: string): Promise<boolean> {
  const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(getRequestContext().env.PASSWORD))
  return payload ? (payload.pass as boolean) : false;
}

export async function checkAuth(token: string | undefined) {
  const password = getRequestContext().env.PASSWORD;
  if(!password) {
    return true;
  }
  if(!token) {
    return false;
  }
  return checkToken(token);
}