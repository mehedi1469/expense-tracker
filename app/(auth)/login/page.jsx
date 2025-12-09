"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader, LogIn, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Failed to login');
                return;
            }

            toast.success('Welcome back!');
            router.push('/dashboard');
            router.refresh();

        } catch (error) {
            console.error('Login error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='premium-card animate-fade-in'>
            {/* Header */}
            <div className='p-6 pb-0 text-center'>
                <div className='w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center'>
                    <LogIn className='w-8 h-8 text-white' />
                </div>
                <h1 className='text-2xl font-bold text-slate-800'>Welcome Back</h1>
                <p className='text-slate-500 mt-1'>Sign in to continue tracking expenses</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='p-6 space-y-4'>
                {/* Error Message */}
                {error && (
                    <div className='p-3 rounded-lg bg-red-50 border border-red-200'>
                        <p className='text-sm text-red-600'>{error}</p>
                    </div>
                )}

                {/* Email */}
                <div className='space-y-1.5'>
                    <label className='text-sm font-medium text-slate-700 flex items-center gap-2'>
                        <Mail className='w-4 h-4' />
                        Email Address
                    </label>
                    <Input
                        name='email'
                        type='email'
                        placeholder='you@example.com'
                        value={formData.email}
                        onChange={handleChange}
                        className='expense-input'
                    />
                </div>

                {/* Password */}
                <div className='space-y-1.5'>
                    <label className='text-sm font-medium text-slate-700 flex items-center gap-2'>
                        <Lock className='w-4 h-4' />
                        Password
                    </label>
                    <Input
                        name='password'
                        type='password'
                        placeholder='••••••••'
                        value={formData.password}
                        onChange={handleChange}
                        className='expense-input'
                    />
                </div>

                {/* Submit Button */}
                <Button
                    type='submit'
                    disabled={loading}
                    className='w-full h-11 text-base font-semibold bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90'
                >
                    {loading ? (
                        <span className='flex items-center gap-2'>
                            <Loader className='w-5 h-5 animate-spin' />
                            Signing in...
                        </span>
                    ) : (
                        'Sign In'
                    )}
                </Button>

                {/* Signup Link */}
                <p className='text-center text-sm text-slate-500'>
                    Don't have an account?{' '}
                    <Link href='/signup' className='text-primary font-medium hover:underline'>
                        Create one
                    </Link>
                </p>
            </form>
        </div>
    );
}
