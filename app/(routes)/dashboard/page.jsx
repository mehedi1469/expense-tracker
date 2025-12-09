"use client"
import React from 'react'
import { useExpense } from '@/context/ExpenseContext';
import CardInfo from './_components/CardInfo';
import BarChartDashboard from './_components/BarChartDashboard';
import BudgetItem from './budgets/_components/BudgetItem';
import ExpensesListTable from './expenses/_components/ExpenseListTable';


function Dashboard() {
  const { budgets, expenses, loading, refreshData } = useExpense();

  if (loading) {
    return (
      <div className='p-8 flex items-center justify-center min-h-[400px]'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    );
  }

  return (
    <div className='p-6 md:p-8 min-h-screen'>
      {/* Page Header */}
      <div className='page-header animate-fade-in'>
        <h1 className='page-title'>Welcome back! 👋</h1>
        <p className='page-subtitle'>Here's what's happening with your finances today.</p>
      </div>

      {/* Stats Cards */}
      <div className='animate-slide-in-right stagger-1'>
        <CardInfo budgetList={budgets} />
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 mt-8 gap-6'>
        {/* Left Column - Chart & Expenses */}
        <div className='lg:col-span-2 space-y-6 animate-fade-in stagger-2'>
          <BarChartDashboard
            budgetList={budgets}
          />

          <div className='premium-card'>
            <div className='premium-card-header'>
              <h3 className='section-header mb-0'>Recent Transactions</h3>
            </div>
            <div className='premium-card-body'>
              <ExpensesListTable />
            </div>
          </div>
        </div>

        {/* Right Column - Budgets */}
        <div className='space-y-4 animate-fade-in stagger-3'>
          <h3 className='section-header'>Your Budgets</h3>
          {budgets.length > 0 ? (
            budgets.map((budget, index) => (
              <BudgetItem budget={budget} key={budget.id || index} />
            ))
          ) : (
            <div className='premium-card p-6 text-center'>
              <p className='text-slate-500'>No budgets yet. Create one to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard