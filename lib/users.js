import fs from 'fs/promises';
import path from 'path';
import { hashPassword } from './auth';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

// Read users from file
export async function getUsers() {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return empty structure
        return { users: [] };
    }
}

// Save users to file
export async function saveUsers(data) {
    await fs.writeFile(USERS_FILE, JSON.stringify(data, null, 2));
}

// Find user by email
export async function findUserByEmail(email) {
    const data = await getUsers();
    return data.users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

// Find user by ID
export async function findUserById(id) {
    const data = await getUsers();
    return data.users.find(user => user.id === id);
}

// Create a new user
export async function createUser({ name, email, password }) {
    const data = await getUsers();

    // Check if email already exists
    const existingUser = data.users.find(
        user => user.email.toLowerCase() === email.toLowerCase()
    );
    if (existingUser) {
        throw new Error('Email already exists');
    }

    // Generate new ID
    const id = data.users.length > 0
        ? Math.max(...data.users.map(u => u.id)) + 1
        : 1;

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user object
    const newUser = {
        id,
        name,
        email: email.toLowerCase(),
        passwordHash,
        createdAt: new Date().toISOString(),
    };

    // Save to file
    data.users.push(newUser);
    await saveUsers(data);

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
}
