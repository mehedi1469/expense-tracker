"use client"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React from 'react';

function BarChartDashboard({ budgetList }) {
  return (
    <div className='chart-card'>
      <div className='chart-card-header'>
        <h3 className='section-header mb-0'>Budget Activity</h3>
        <p className='text-sm text-slate-500 mt-1'>Spending vs Budget allocation</p>
      </div>
      <div className='chart-card-body'>
        <ResponsiveContainer width={'100%'} height={300}>
          <BarChart
            data={budgetList}
            margin={{
              top: 7
            }}

          >
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='totalSpend' name='Spent' stackId="a" fill='#4845d2' radius={[4, 4, 0, 0]} />
            <Bar dataKey='amount' name='Budget' stackId="a" fill='#C3C2FF' radius={[4, 4, 0, 0]} />


          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default BarChartDashboard

