import { NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/users';

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, password, confirmPassword } = body;

        // Validation
        const errors = {};

        if (!name || name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters';
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!password || password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(errors).length > 0) {
            return NextResponse.json(
                { success: false, errors },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                { success: false, errors: { email: 'Email already registered' } },
                { status: 400 }
            );
        }

        // Create user
        const user = await createUser({
            name: name.trim(),
            email: email.trim(),
            password,
        });

        return NextResponse.json({
            success: true,
            message: 'Account created successfully',
            user,
        });

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create account' },
            { status: 500 }
        );
    }
}
