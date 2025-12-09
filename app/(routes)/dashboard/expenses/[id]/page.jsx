"use client"
import React, { useEffect, useState } from 'react'
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from '../_components/AddExpense';
import ExpenseListTable from '../_components/ExpenseListTable';
import { ArrowLeft, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import EditBudget from '../_components/EditBudget';

function ExpensesScreen({ params }) {
  const resolvedParams = React.use(params);
  const itemId = resolvedParams.id;

  const [budgetInfo, setbudgetInfo] = useState();
  const [expensesList, setExpensesList] = useState([]);
  const route = useRouter();

  useEffect(() => {
    getBudgetInfo();
    getExpensesList();
  }, []);

  // Get Budget Information
  const getBudgetInfo = async () => {
    try {
      const response = await fetch('/api/budgets');
      const result = await response.json();
      const budget = result.find(b => b.id === Number(itemId));
      setbudgetInfo(budget);
      getExpensesList();
    } catch (error) {
      console.error('Error fetching budget:', error);
    }
  }

  // get latest expense
  const getExpensesList = async () => {
    try {
      const response = await fetch(`/api/expenses?budgetId=${itemId}`);
      const result = await response.json();
      setExpensesList(result);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  }

  // Delete Budget
  const deleteBudget = async () => {
    try {
      const response = await fetch(`/api/budgets?id=${itemId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast('Budget Deleted!');
        route.push('/dashboard/budgets');
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast('Error deleting budget');
    }
  }

  return (
    <div className='p-10'>
      <h2 className='text-2xl font-bold flex justify-between items-center'>
        <span className='flex items-center gap-2'>
          <ArrowLeft onClick={() => route.back()} className='cursor-pointer' />
          My Expenses
        </span>
        <div className='flex gap-2 items-center'>
          <EditBudget budgetInfo={budgetInfo}
            refreshData={() => getBudgetInfo()} />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className='flex gap-5' variant="destructive">
                <Trash /> Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your current budget along with your expenses.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteBudget()}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
        {budgetInfo ? <BudgetItem
          budget={budgetInfo}
        /> :
          <div className='h-[150px] w-full bg-slate-200 
          rounded-lg animate-pulse'>
          </div>}
        <AddExpense budgetId={itemId}
          refreshData={() => getBudgetInfo()}
        />

      </div>
      <div className='mt-4'>

        <ExpenseListTable expensesList={expensesList}
          refreshData={() => getBudgetInfo()}
        />
      </div>
    </div>
  )
}

export default ExpensesScreen

