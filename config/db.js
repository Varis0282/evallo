import { JsonDB, Config } from 'node-json-db';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';

// Create a database instance for logs
const db = new JsonDB(new Config("data/logs", true, false, '/'));

// Mutex for preventing race conditions during writes
class DatabaseMutex {
    constructor() {
        this.locked = false;
        this.queue = [];
    }

    async acquire() {
        return new Promise((resolve) => {
            if (!this.locked) {
                this.locked = true;
                resolve();
            } else {
                this.queue.push(resolve);
            }
        });
    }

    release() {
        this.locked = false;
        if (this.queue.length > 0) {
            const next = this.queue.shift();
            this.locked = true;
            next();
        }
    }
}

const dbMutex = new DatabaseMutex();

// Enhanced database operations with retry logic and error handling
const withRetry = async (operation, maxRetries = 3, delay = 100) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            if (attempt === maxRetries) {
                throw error;
            }
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
        }
    }
};

// Safe write operation with backup
const safeWrite = async (path, data) => {
    await dbMutex.acquire();
    try {
        // Create backup before writing
        const backupPath = `data/logs.backup.${Date.now()}.json`;
        if (existsSync('data/logs.json')) {
            await fs.copyFile('data/logs.json', backupPath);
        }

        // Perform the write operation
        await withRetry(async () => {
            await db.push(path, data);
        });

        // Clean up old backups (keep only last 5)
        await cleanupBackups();
    } finally {
        dbMutex.release();
    }
};

// Safe read operation with retry
const safeRead = async (path) => {
    return await withRetry(async () => {
        return await db.getData(path);
    });
};

// Cleanup old backup files
const cleanupBackups = async () => {
    try {
        const files = await fs.readdir('data');
        const backups = files
            .filter(file => file.startsWith('logs.backup.'))
            .sort((a, b) => b.localeCompare(a)) // Sort by timestamp descending
            .slice(5); // Keep only the newest 5 backups

        for (const backup of backups) {
            await fs.unlink(`data/${backup}`);
        }
    } catch (error) {
        console.warn('Failed to cleanup old backups:', error.message);
    }
};

// Initialize the database structure if it doesn't exist
const initializeDatabase = async () => {
    try {
        // Ensure data directory exists
        await fs.mkdir('data', { recursive: true });
        
        // Check if logs array exists, if not create it
        await safeRead("/logs");
        console.log("Database connection established successfully");
    } catch (error) {
        console.log("Initializing database with empty logs array...");
        try {
            // If data doesn't exist, create empty logs array
            await safeWrite("/logs", []);
            console.log("Database initialized successfully");
        } catch (initError) {
            console.error("Failed to initialize database:", initError.message);
            throw initError;
        }
    }
};

// Enhanced database interface
const enhancedDb = {
    ...db,
    safeWrite,
    safeRead,
    mutex: dbMutex,
    
    // Enhanced push method with safety features
    async safePush(path, data) {
        await safeWrite(path, data);
    },
    
    // Enhanced getData method with retry
    async safeGetData(path) {
        return await safeRead(path);
    },
    
    // Health check method
    async healthCheck() {
        try {
            await safeRead("/logs");
            return { status: 'healthy', timestamp: new Date().toISOString() };
        } catch (error) {
            return { status: 'unhealthy', error: error.message, timestamp: new Date().toISOString() };
        }
    }
};

// Initialize database on module load
await initializeDatabase();

export default enhancedDb;
