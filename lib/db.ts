
// Simple in-memory store for this ephemeral container
// In a real app this would be a DB.
// Since the container restarts fresh, this is fine.
// File: data/users.json will be used if we need persistence across hot-reloads, 
// but for now memory is easiest for a stateless container challenge.
// ACTUALLY: Next.js API routes are serverless/stateless lambda-like. 
// We NEED a file to persist users between requests.

import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'users.json');

// Ensure directory exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

export function getUsers() {
    if (!fs.existsSync(DB_PATH)) return [];
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export function addUser(user: any) {
    const users = getUsers();
    users.push(user);
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}
