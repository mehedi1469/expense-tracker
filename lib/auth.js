import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'expense-tracker-dev-secret-2024';
const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '7d';

// Hash a password
export async function hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

// Verify a password against a hash
export async function verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

// Create a JWT token for a user
export function createToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

// Verify and decode a JWT token
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

// Get user session from cookies
export function getSession(cookies) {
    const token = cookies.get('auth_token')?.value;
    if (!token) return null;
    return verifyToken(token);
}

// Cookie options for auth token
export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
};
