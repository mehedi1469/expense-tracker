import { Trash } from 'lucide-react'
import React from 'react'
import { useExpense } from '@/context/ExpenseContext';

function ExpenseListTable() {
  const { expenses, budgets, deleteExpense } = useExpense();

  const handleDelete = async (expense) => {
    try {
      await deleteExpense(expense.id);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  // Get budget info for an expense
  const getBudgetInfo = (budgetId) => {
    return budgets.find(b => b.id === budgetId);
  };

  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className='animate-fade-in'>
      {/* Table Header */}
      <div className='grid grid-cols-5 gap-2 bg-gradient-to-r from-slate-100 to-slate-50 p-4 rounded-xl font-semibold text-gray-700 text-sm'>
        <h2>Name</h2>
        <h2>Budget</h2>
        <h2>Amount</h2>
        <h2>Date</h2>
        <h2>Action</h2>
      </div>

      {/* Table Rows */}
      <div className='divide-y divide-slate-100'>
        {sortedExpenses.map((expense, index) => {
          const budget = getBudgetInfo(expense.budgetId);
          return (
            <div
              key={expense.id || index}
              className={`grid grid-cols-5 gap-2 p-4 items-center hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200 rounded-lg animate-fade-in`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Name */}
              <div>
                <h2 className='font-medium text-gray-800'>{expense.name}</h2>
                {expense.note && (
                  <p className='text-xs text-gray-400 mt-0.5 truncate max-w-[150px]'>{expense.note}</p>
                )}
              </div>

              {/* Budget */}
              <div className='flex items-center gap-2'>
                <span className='text-lg'>{budget?.icon || '📁'}</span>
                <span className='text-sm text-gray-600 truncate'>{budget?.name || 'Unknown'}</span>
              </div>

              {/* Amount */}
              <h2 className='font-bold text-primary'>Tk. {expense.amount}</h2>

              {/* Date */}
              <h2 className='text-sm text-gray-500'>
                {new Date(expense.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </h2>

              {/* Action */}
              <div>
                <button
                  onClick={() => handleDelete(expense)}
                  className='p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group'
                  title="Delete expense"
                >
                  <Trash className='w-4 h-4 group-hover:scale-110 transition-transform duration-200' />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default ExpenseListTable