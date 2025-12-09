import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { findUserById } from '@/lib/users';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, user: null },
                { status: 401 }
            );
        }

        // Verify token
        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { success: false, user: null },
                { status: 401 }
            );
        }

        // Get fresh user data
        const user = await findUserById(decoded.id);
        if (!user) {
            return NextResponse.json(
                { success: false, user: null },
                { status: 401 }
            );
        }

        // Return user without password
        const { passwordHash: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            success: true,
            user: userWithoutPassword,
        });

    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { success: false, user: null },
            { status: 500 }
        );
    }
}
