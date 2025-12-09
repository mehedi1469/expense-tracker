"use client"

import React, { useEffect } from 'react'
import Image from "next/image"
import { LayoutGrid, PiggyBank, ReceiptText, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

function SideNav() {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  const menuList = [
    { id: 1, name: 'Dashboard', icon: LayoutGrid, path: '/dashboard' },
    { id: 2, name: 'Budgets', icon: PiggyBank, path: '/dashboard/budgets' },
    { id: 3, name: 'Expenses', icon: ReceiptText, path: '/dashboard/expenses' },
  ];

  useEffect(() => {
    console.log('Path changed:', pathname);
  }, [pathname]);

  // Get user initials
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className='premium-sidebar animate-slide-in-left'>
      {/* Logo Section */}
      <div className='sidebar-logo'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center'>
            <span className='text-xl'>💰</span>
          </div>
          <div>
            <h1 className='text-lg font-bold text-white'>ExpenseTrack</h1>
            <p className='text-xs text-white/50'>Manage finances</p>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <nav className='mt-2'>
        <p className='text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 px-1'>
          Main Menu
        </p>
        <ul className='space-y-1'>
          {menuList.map((menu, index) => (
            <li key={menu.id} className={`animate-fade-in stagger-${index + 1}`}>
              <Link href={menu.path}>
                <div className={`sidebar-menu-item ${pathname === menu.path ? 'active' : ''}`}>
                  <div className='icon-wrapper'>
                    <menu.icon className='w-5 h-5' />
                  </div>
                  {menu.name}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section - User Info */}
      <div className='absolute bottom-6 left-6 right-6'>
        <div className='bg-white/5 rounded-2xl p-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm'>
              {loading ? '...' : getInitials(user?.name)}
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-white truncate'>
                {loading ? 'Loading...' : user?.name || 'Guest'}
              </p>
              <p className='text-xs text-white/50 truncate'>
                {loading ? '' : user?.email || 'Not logged in'}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className='mt-3 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm font-medium transition-all duration-200'
          >
            <LogOut className='w-4 h-4' />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default SideNav;


