"use client"
import EmojiPicker from 'emoji-picker-react'
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { DialogClose } from '@radix-ui/react-dialog';
import { Plus } from 'lucide-react';

function CreateBudget({ refreshData }) {

    const [emojiIcon, setEmojiIcon] = useState('😀');
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

    const [name, setName] = useState();
    const [amount, setAmount] = useState();

    const onCreateBudget = async () => {
        try {
            const response = await fetch('/api/budgets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    amount: amount,
                    icon: emojiIcon
                }),
            });

            const result = await response.json();

            if (result) {
                refreshData();
                toast('New Budget Created!');
            }
        } catch (error) {
            console.error('Error creating budget:', error);
            toast('Error creating budget');
        }
    }

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <div className='create-budget-card'>
                        <div className='create-budget-icon'>
                            <Plus className='w-6 h-6' />
                        </div>
                        <h3 className='font-semibold text-slate-700'>Create New Budget</h3>
                        <p className='text-sm text-slate-500'>Set up a spending category</p>
                    </div>
                </DialogTrigger>
                <DialogContent className='rounded-2xl'>
                    <DialogHeader>
                        <DialogTitle className='text-xl font-bold'>Create New Budget</DialogTitle>
                        <DialogDescription>
                            <div className='mt-5'>
                                <Button variant="outline"
                                    size='lg'
                                    className='text-2xl h-14 w-14 rounded-xl'
                                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                                >{emojiIcon}</Button>
                                <div className="absolute z-20">
                                    <EmojiPicker
                                        open={openEmojiPicker}
                                        onEmojiClick={(e) => {
                                            setEmojiIcon(e.emoji);
                                            setOpenEmojiPicker(false);
                                        }}
                                    />
                                </div>
                                <div className='mt-4'>
                                    <label className='text-sm font-medium text-slate-700'>Budget Name</label>
                                    <Input
                                        className='mt-1.5 expense-input'
                                        placeholder="e.g. Groceries, Transport"
                                        onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className='mt-4'>
                                    <label className='text-sm font-medium text-slate-700'>Budget Amount (Tk)</label>
                                    <Input
                                        className='mt-1.5 expense-input'
                                        type="number"
                                        placeholder="e.g. 5000"
                                        onChange={(e) => setAmount(e.target.value)} />
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button
                                disabled={!(name && amount)}
                                onClick={() => onCreateBudget()}
                                className='mt-4 w-full h-11 text-base font-semibold bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90'>
                                Create Budget
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreateBudget