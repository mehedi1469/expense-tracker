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

// GET all expenses for current user (or by budget)
export async function GET(request) {
    const userId = await getCurrentUserId();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await readData();
    const { searchParams } = new URL(request.url);
    const budgetId = searchParams.get('budgetId');

    // Filter by userId first
    let userExpenses = data.expenses.filter(e => e.userId === userId);

    // Then filter by budgetId if provided
    if (budgetId) {
        userExpenses = userExpenses.filter(exp => exp.budgetId === parseInt(budgetId));
    }

    return NextResponse.json(userExpenses);
}

// POST new expense for current user
export async function POST(request) {
    const userId = await getCurrentUserId();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await readData();
    const body = await request.json();

    // Verify the budget belongs to this user
    const budget = data.budgets.find(b => b.id === body.budgetId && b.userId === userId);
    if (!budget) {
        return NextResponse.json({ error: 'Budget not found or not authorized' }, { status: 404 });
    }

    const newExpense = {
        id: data.expenses.length > 0 ? Math.max(...data.expenses.map(e => e.id)) + 1 : 1,
        name: body.name,
        amount: body.amount,
        budgetId: body.budgetId,
        userId: userId, // Link expense to user
        createdAt: new Date().toISOString()
    };

    data.expenses.push(newExpense);
    await writeData(data);

    return NextResponse.json(newExpense);
}

// DELETE expense (only if owned by current user)
export async function DELETE(request) {
    const userId = await getCurrentUserId();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await readData();
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));

    // Check if expense belongs to user
    const expense = data.expenses.find(e => e.id === id && e.userId === userId);
    if (!expense) {
        return NextResponse.json({ error: 'Expense not found or not authorized' }, { status: 404 });
    }

    data.expenses = data.expenses.filter(e => !(e.id === id && e.userId === userId));
    await writeData(data);

    return NextResponse.json({ success: true });
}

// PUT update expense (only if owned by current user)
export async function PUT(request) {
    const userId = await getCurrentUserId();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await readData();
    const body = await request.json();

    // Find expense that belongs to this user
    const index = data.expenses.findIndex(e => e.id === body.id && e.userId === userId);
    if (index !== -1) {
        data.expenses[index] = { ...data.expenses[index], ...body, userId }; // Ensure userId stays
        await writeData(data);
        return NextResponse.json(data.expenses[index]);
    }

    return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
}

