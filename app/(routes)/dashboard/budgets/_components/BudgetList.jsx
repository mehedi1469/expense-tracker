"use client"
import React, { useEffect, useState } from 'react'
import CreateBudget from './CreateBudget'
import BudgetItem from './BudgetItem';

function BudgetList() {

  const [budgetList, setBudgetList] = useState([]);

  useEffect(() => {
    getBudgetList();
  }, [])

  // Get budgetlist
  const getBudgetList = async () => {
    try {
      const response = await fetch('/api/budgets');
      const result = await response.json();
      setBudgetList(result);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  return (
    <div className='mt-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <CreateBudget
          refreshData={() => getBudgetList()} />
        {budgetList?.length > 0 ? budgetList.map((budget, index) => (
          <BudgetItem budget={budget} key={budget.id || index} />
        ))
          : [1, 2, 3, 4].map((item, index) => (
            <div key={index} className='skeleton h-[180px] w-full'></div>
          ))
        }
      </div>
    </div>
  )
}

export default BudgetList