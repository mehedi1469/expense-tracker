"use client"
import { PiggyBank, ReceiptText, Wallet } from 'lucide-react';
import React, { useEffect } from 'react';
import { useState } from 'react';

function CardInfo({ budgetList }) {


    const [totalBudget, setTotalBudget] = useState(0);
    const [totalSpend, setTotalSpend] = useState(0);
    useEffect(() => {
        budgetList && calculateCardInfo();
    }, [budgetList]);
    const calculateCardInfo = () => {
        console.log(budgetList);
        let totalBudget_ = 0;
        let totalSpend_ = 0;

        budgetList.forEach(element => {
            totalBudget_ = totalBudget_ + Number(element.amount);
            totalSpend_ = totalSpend_ + element.totalSpend;
        });
        setTotalBudget(totalBudget_);
        setTotalSpend(totalSpend_);
        console.log(totalBudget_, totalSpend_);

    }
    return (
        <div>
            {budgetList?.length > 0 ?
                <div className='mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                    {/* Total Budget Card */}
                    <div className='stat-card animate-fade-in'>
                        <div>
                            <p className='stat-label'>Total Budget</p>
                            <h2 className='stat-value'>Tk. {totalBudget.toLocaleString()}</h2>
                        </div>
                        <div className='gradient-icon primary'>
                            <PiggyBank className='w-6 h-6' />
                        </div>
                    </div>

                    {/* Total Spend Card */}
                    <div className='stat-card animate-fade-in stagger-1'>
                        <div>
                            <p className='stat-label'>Total Spent</p>
                            <h2 className='stat-value'>Tk. {totalSpend.toLocaleString()}</h2>
                        </div>
                        <div className='gradient-icon success'>
                            <ReceiptText className='w-6 h-6' />
                        </div>
                    </div>

                    {/* Number of Budgets Card */}
                    <div className='stat-card animate-fade-in stagger-2'>
                        <div>
                            <p className='stat-label'>Active Budgets</p>
                            <h2 className='stat-value'>{budgetList?.length}</h2>
                        </div>
                        <div className='gradient-icon info'>
                            <Wallet className='w-6 h-6' />
                        </div>
                    </div>
                </div>
                :
                <div className='mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                    {[1, 2, 3].map((item, index) => (
                        <div key={index} className='skeleton h-[100px] w-full'></div>
                    ))}
                </div>
            }
        </div>
    )
}

export default CardInfo