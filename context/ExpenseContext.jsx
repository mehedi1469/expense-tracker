"use client"
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

const ExpenseContext = createContext();

export const useExpense = () => {
    const context = useContext(ExpenseContext);
    if (!context) {
        throw new Error('useExpense must be used within an ExpenseProvider');
    }
    return context;
};

export function ExpenseProvider({ children }) {
    const [budgets, setBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all budgets
    const fetchBudgets = useCallback(async () => {
        try {
            const response = await fetch('/api/budgets');
            const result = await response.json();
            setBudgets(result);
        } catch (error) {
            console.error('Error fetching budgets:', error);
        }
    }, []);

    // Fetch all expenses
    const fetchExpenses = useCallback(async () => {
        try {
            const response = await fetch('/api/expenses');
            const result = await response.json();
            setExpenses(result);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    }, []);

    // Refresh all data
    const refreshData = useCallback(async () => {
        setLoading(true);
        await Promise.all([fetchBudgets(), fetchExpenses()]);
        setLoading(false);
    }, [fetchBudgets, fetchExpenses]);

    // Add new expense
    const addExpense = async (expenseData) => {
        try {
            const response = await fetch('/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expenseData),
            });

            const result = await response.json();

            if (result) {
                toast.success('Expense added successfully!');
                await refreshData();
                return result;
            }
        } catch (error) {
            console.error('Error adding expense:', error);
            toast.error('Failed to add expense');
            throw error;
        }
    };

    // Delete expense
    const deleteExpense = async (id) => {
        try {
            const response = await fetch(`/api/expenses?id=${id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Expense deleted!');
                await refreshData();
                return true;
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
            toast.error('Failed to delete expense');
            throw error;
        }
    };

    // Initial data load
    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const value = {
        budgets,
        expenses,
        loading,
        addExpense,
        deleteExpense,
        refreshData,
    };

    return (
        <ExpenseContext.Provider value={value}>
            {children}
        </ExpenseContext.Provider>
    );
}

export default ExpenseContext;
