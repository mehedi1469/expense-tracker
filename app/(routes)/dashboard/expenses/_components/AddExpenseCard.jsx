"use client"
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useExpense } from '@/context/ExpenseContext';
import { Loader, Plus, Calendar, FileText, Wallet, DollarSign } from 'lucide-react';

function AddExpenseCard() {
    const { budgets, addExpense, loading: contextLoading } = useExpense();

    const [selectedBudget, setSelectedBudget] = useState('');
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const isFormValid = selectedBudget && name.trim() && amount && parseFloat(amount) > 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        setSubmitting(true);
        try {
            await addExpense({
                name: name.trim(),
                amount: amount,
                budgetId: Number(selectedBudget),
                note: note.trim() || undefined,
                createdAt: new Date(date).toISOString(),
            });

            // Reset form
            setName('');
            setAmount('');
            setNote('');
            setDate(new Date().toISOString().split('T')[0]);
            setSelectedBudget('');
        } catch (error) {
            console.error('Failed to add expense:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const selectedBudgetData = budgets.find(b => b.id === Number(selectedBudget));

    return (
        <div className="expense-card animate-fade-in">
            {/* Card Header */}
            <div className="expense-card-header">
                <div className="flex items-center gap-3">
                    <div className="expense-card-icon">
                        <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Add New Expense</h2>
                        <p className="text-sm text-gray-500">Track your spending efficiently</p>
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Budget Selection */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Wallet className="w-4 h-4 text-primary" />
                        Select Budget
                    </label>
                    <select
                        value={selectedBudget}
                        onChange={(e) => setSelectedBudget(e.target.value)}
                        className="expense-input w-full"
                        disabled={contextLoading}
                    >
                        <option value="">Choose a budget...</option>
                        {budgets.map((budget) => (
                            <option key={budget.id} value={budget.id}>
                                {budget.icon} {budget.name} (Tk. {budget.amount - (budget.totalSpend || 0)} remaining)
                            </option>
                        ))}
                    </select>
                    {selectedBudgetData && (
                        <div className="flex items-center gap-2 mt-2 p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
                            <span className="text-2xl">{selectedBudgetData.icon}</span>
                            <div>
                                <p className="font-semibold text-gray-800">{selectedBudgetData.name}</p>
                                <p className="text-xs text-gray-500">
                                    Budget: Tk. {selectedBudgetData.amount} | Spent: Tk. {selectedBudgetData.totalSpend || 0}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Expense Name & Amount Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <FileText className="w-4 h-4 text-primary" />
                            Expense Name
                        </label>
                        <Input
                            type="text"
                            placeholder="e.g. Groceries, Transport"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="expense-input"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <DollarSign className="w-4 h-4 text-primary" />
                            Amount (Tk)
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Tk.</span>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="expense-input pl-10"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>
                </div>

                {/* Date Picker */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Calendar className="w-4 h-4 text-primary" />
                        Date
                    </label>
                    <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="expense-input"
                        max={new Date().toISOString().split('T')[0]}
                    />
                </div>

                {/* Optional Note */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <FileText className="w-4 h-4 text-primary" />
                        Note <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                        placeholder="Add any additional details..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="expense-input w-full min-h-[80px] resize-none"
                        rows={3}
                    />
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={!isFormValid || submitting}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                    {submitting ? (
                        <span className="flex items-center gap-2">
                            <Loader className="w-5 h-5 animate-spin" />
                            Adding Expense...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Add Expense
                        </span>
                    )}
                </Button>
            </form>
        </div>
    );
}

export default AddExpenseCard;
