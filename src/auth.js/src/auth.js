import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

const ADMIN_COOKIE = 'hltv_admin';
const MAX_AGE = 60 * 60 * 8;

function sign(value, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(value)
    .digest('hex');
}

export function createAdminToken(secret) {
  const expires = Date.now() + MAX_AGE * 1000;
  const payload = `admin.${expires}`;
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyAdminToken(token, secret) {
  if (!token) return false;

  const parts = token.split('.');
  const role = parts[0];
  const expires = parts[1];
  const signature = parts[2];

  if (role !== 'admin' || !expires || !signature) return false;
  if (Number(expires) < Date.now()) return false;

  const expected = sign(`${role}.${expires}`, secret);

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

export async function checkAdminPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export { ADMIN_COOKIE, MAX_AGE };
