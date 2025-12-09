import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/users';
import { verifyPassword, createToken, cookieOptions } from '@/lib/auth';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await findUserByEmail(email);
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.passwordHash);
        if (!isValidPassword) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Create JWT token
        const token = createToken(user);

        // Create response with user data (without password)
        const { passwordHash: _, ...userWithoutPassword } = user;

        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            user: userWithoutPassword,
        });

        // Set auth cookie
        response.cookies.set('auth_token', token, cookieOptions);

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to login' },
            { status: 500 }
        );
    }
}
