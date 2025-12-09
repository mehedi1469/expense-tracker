import Link from 'next/link'
import React from 'react'

function BudgetItem({ budget }) {

    const calculateProgressPercentage = () => {
        //(spend / total) * 100
        const percentage = (budget.totalSpend / budget.amount) * 100;
        return percentage.toFixed(2); // Returns percentage with two decimal places
    };

    return (
        <Link href={'/dashboard/expenses/' + budget?.id} >
            <div className='budget-card animate-scale-in'>
                {/* Header */}
                <div className='flex gap-3 items-center justify-between'>
                    <div className='flex gap-3 items-center'>
                        <div className='budget-icon'>
                            {budget?.icon}
                        </div>
                        <div>
                            <h3 className='font-semibold text-slate-800'>{budget.name}</h3>
                            <p className='text-xs text-slate-500'>{budget?.totalItem} {budget?.totalItem === 1 ? 'item' : 'items'}</p>
                        </div>
                    </div>
                    <h3 className='font-bold text-primary text-lg'>Tk. {Number(budget?.amount).toLocaleString()}</h3>
                </div>

                {/* Progress Section */}
                <div className='mt-5'>
                    <div className='flex items-center justify-between mb-2'>
                        <p className='text-xs font-medium text-slate-500'>
                            Tk. {budget.totalSpend ? budget?.totalSpend.toLocaleString() : 0} spent
                        </p>
                        <p className='text-xs font-medium text-slate-500'>
                            Tk. {(budget.amount - budget?.totalSpend).toLocaleString()} left
                        </p>
                    </div>

                    <div className='budget-progress-bar'>
                        <div className='budget-progress-fill'
                            style={{
                                width: `${calculateProgressPercentage()}%`
                            }}
                        >
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default BudgetItem