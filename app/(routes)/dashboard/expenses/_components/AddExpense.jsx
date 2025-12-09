import React, { useState } from 'react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import moment from 'moment';
import { toast } from "sonner";
import { Loader } from 'lucide-react';

function AddExpense({ budgetId, refreshData }) {

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const addNewExpense = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    amount: amount,
                    budgetId: Number(budgetId),
                    createdAt: moment().format('DD/MM/YYYY'),
                }),
            });

            const result = await response.json();

            if (result) {
                setAmount('');
                setName('');
                refreshData();
                toast('New Expense Added!');
            }
        } catch (error) {
            console.error('Error adding expense:', error);
            toast('Error adding expense');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='border p-5 rounded-lg'>
            <h2 className='text-lg font-bold'>Add New Expense</h2>
            <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Expense Name</h2>
                <Input placeholder="e.g. Eggs"
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
            </div>
            <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Expense Amount</h2>
                <Input type="number" placeholder="e.g. 160"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)} />
            </div>
            <Button disabled={!(name && amount)}
                onClick={() => addNewExpense()}
                className='mt-3 w-full'>
                {
                    loading ?
                        <Loader className="animate-spin" /> : 'Add New Expense'
                }
            </Button>
        </div>
    )
}

export default AddExpense