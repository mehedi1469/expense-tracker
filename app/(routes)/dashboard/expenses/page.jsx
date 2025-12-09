"use client"

import React from 'react';
import { useExpense } from '@/context/ExpenseContext';
import ExpenseListTable from './_components/ExpenseListTable';
import AddExpenseCard from './_components/AddExpenseCard';
import { Wallet, TrendingDown } from 'lucide-react';

function AllExpensesPage() {
  const { expenses, budgets, loading } = useExpense();

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

  // Get expenses count this month
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.createdAt);
    return expDate.getMonth() === thisMonth && expDate.getFullYear() === thisYear;
  });

  return (
    <div className='p-6 md:p-10 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
      {/* Page Header */}
      <div className='animate-fade-in mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>My Expenses</h1>
        <p className='text-gray-500 mt-1'>Manage and track all your expenses in one place</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fade-in stagger-1'>
        <div className='stats-card'>
          <div className='flex items-center gap-3'>
            <div className='p-3 bg-primary/10 rounded-xl'>
              <Wallet className='w-6 h-6 text-primary' />
            </div>
            <div>
              <p className='text-sm text-gray-500'>Total Expenses</p>
              <p className='text-2xl font-bold text-gray-800'>Tk. {totalExpenses.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className='stats-card'>
          <div className='flex items-center gap-3'>
            <div className='p-3 bg-green-100 rounded-xl'>
              <TrendingDown className='w-6 h-6 text-green-600' />
            </div>
            <div>
              <p className='text-sm text-gray-500'>This Month</p>
              <p className='text-2xl font-bold text-gray-800'>{monthlyExpenses.length} expenses</p>
            </div>
          </div>
        </div>
        <div className='stats-card'>
          <div className='flex items-center gap-3'>
            <div className='p-3 bg-indigo-100 rounded-xl'>
              <Wallet className='w-6 h-6 text-indigo-600' />
            </div>
            <div>
              <p className='text-sm text-gray-500'>Active Budgets</p>
              <p className='text-2xl font-bold text-gray-800'>{budgets.length} budgets</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Add Expense Form */}
        <div className='lg:col-span-1 animate-fade-in stagger-2'>
          <AddExpenseCard />
        </div>

        {/* Expenses Table */}
        <div className='lg:col-span-2 animate-fade-in stagger-3'>
          <div className='expense-card'>
            <div className='expense-card-header'>
              <h2 className='text-xl font-bold text-gray-800'>All Expenses</h2>
              <p className='text-sm text-gray-500'>{expenses.length} total expenses</p>
            </div>
            <div className='p-6'>
              {loading ? (
                <div className='flex items-center justify-center py-12'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
                </div>
              ) : expenses.length > 0 ? (
                <ExpenseListTable />
              ) : (
                <div className='text-center py-12'>
                  <Wallet className='w-12 h-12 text-gray-300 mx-auto mb-3' />
                  <p className='text-gray-500'>No expenses found. Add your first expense!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllExpensesPage;
