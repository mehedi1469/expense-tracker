"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader, UserPlus, Mail, Lock, User } from 'lucide-react';

export default function SignUpPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    toast.error(data.message || 'Failed to create account');
                }
                return;
            }

            toast.success('Account created successfully! Please login.');
            router.push('/login');

        } catch (error) {
            console.error('Signup error:', error);
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
                    <UserPlus className='w-8 h-8 text-white' />
                </div>
                <h1 className='text-2xl font-bold text-slate-800'>Create Account</h1>
                <p className='text-slate-500 mt-1'>Start tracking your expenses today</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='p-6 space-y-4'>
                {/* Name */}
                <div className='space-y-1.5'>
                    <label className='text-sm font-medium text-slate-700 flex items-center gap-2'>
                        <User className='w-4 h-4' />
                        Full Name
                    </label>
                    <Input
                        name='name'
                        type='text'
                        placeholder='Mehdi Hasan'
                        value={formData.name}
                        onChange={handleChange}
                        className={`expense-input ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && (
                        <p className='text-xs text-red-500'>{errors.name}</p>
                    )}
                </div>

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
                        className={`expense-input ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && (
                        <p className='text-xs text-red-500'>{errors.email}</p>
                    )}
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
                        className={`expense-input ${errors.password ? 'border-red-500' : ''}`}
                    />
                    {errors.password && (
                        <p className='text-xs text-red-500'>{errors.password}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className='space-y-1.5'>
                    <label className='text-sm font-medium text-slate-700 flex items-center gap-2'>
                        <Lock className='w-4 h-4' />
                        Confirm Password
                    </label>
                    <Input
                        name='confirmPassword'
                        type='password'
                        placeholder='••••••••'
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`expense-input ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    {errors.confirmPassword && (
                        <p className='text-xs text-red-500'>{errors.confirmPassword}</p>
                    )}
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
                            Creating Account...
                        </span>
                    ) : (
                        'Create Account'
                    )}
                </Button>

                {/* Login Link */}
                <p className='text-center text-sm text-slate-500'>
                    Already have an account?{' '}
                    <Link href='/login' className='text-primary font-medium hover:underline'>
                        Sign in
                    </Link>
                </p>
            </form>
        </div>
    );
}
