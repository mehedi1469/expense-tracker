import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import { verifyToken } from '@/lib/auth';

const DATA_FILE = path.join(process.cwd(), 'data', 'expenses.json');

// Helper function to get current user ID from session
async function getCurrentUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    const decoded = verifyToken(token);
    return decoded?.id || null;
}

// Helper function to read data
async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { budgets: [], expenses: [] };
    }
}

// Helper function to write data
async function writeData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET all budgets for current user
export async function GET() {
    const userId = await getCurrentUserId();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await readData();

    // Filter budgets by userId
    const userBudgets = data.budgets.filter(b => b.userId === userId);

    // Calculate totals for each budget (only from user's expenses)
    const userExpenses = data.expenses.filter(e => e.userId === userId);

    const budgetsWithTotals = userBudgets.map(budget => {
        const budgetExpenses = userExpenses.filter(exp => exp.budgetId === budget.id);
        const totalSpend = budgetExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
        const totalItem = budgetExpenses.length;

        return {
            ...budget,
            totalSpend,
            totalItem
        };
    });

    return NextResponse.json(budgetsWithTotals);
}

// POST new budget for current user
export async function POST(request) {
    const userId = await getCurrentUserId();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await readData();
    const body = await request.json();

    const newBudget = {
        id: data.budgets.length > 0 ? Math.max(...data.budgets.map(b => b.id)) + 1 : 1,
        name: body.name,
        amount: body.amount,
        icon: body.icon,
        userId: userId, // Link budget to user
        createdAt: new Date().toISOString()
    };

    data.budgets.push(newBudget);
    await writeData(data);

    return NextResponse.json(newBudget);
}

// DELETE budget (only if owned by current user)
export async function DELETE(request) {
    const userId = await getCurrentUserId();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await readData();
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));

    // Check if budget belongs to user
    const budget = data.budgets.find(b => b.id === id && b.userId === userId);
    if (!budget) {
        return NextResponse.json({ error: 'Budget not found or not authorized' }, { status: 404 });
    }

    // Remove budget and its expenses (only for this user)
    data.budgets = data.budgets.filter(b => !(b.id === id && b.userId === userId));
    data.expenses = data.expenses.filter(e => !(e.budgetId === id && e.userId === userId));

    await writeData(data);

    return NextResponse.json({ success: true });
}

// PUT update budget (only if owned by current user)
export async function PUT(request) {
    const userId = await getCurrentUserId();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await readData();
    const body = await request.json();

    // Find budget that belongs to this user
    const index = data.budgets.findIndex(b => b.id === body.id && b.userId === userId);
    if (index !== -1) {
        data.budgets[index] = { ...data.budgets[index], ...body, userId }; // Ensure userId stays
        await writeData(data);
        return NextResponse.json(data.budgets[index]);
    }

    return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
}

