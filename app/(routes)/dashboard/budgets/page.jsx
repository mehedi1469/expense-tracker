import React from 'react'
import BudgetList from './_components/BudgetList'

function Budget() {
  return (
    <div className='p-6 md:p-8 min-h-screen'>
      <div className='page-header animate-fade-in'>
        <h1 className='page-title'>My Budgets</h1>
        <p className='page-subtitle'>Create and manage your spending categories</p>
      </div>
      <BudgetList />
    </div>
  )
}

export default Budget