import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import logRoutes from './app/apis/logs.js';
import db from './config/db.js';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

global.__basedir = __dirname;


// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl || req.url;
    const clientIP = req.ip || req.connection.remoteAddress || 'Unknown IP';
    
    // Log the incoming request
    console.log(`📥 [${timestamp}] ${method} ${url} - ${clientIP}`);
    
    // Capture the start time for response duration
    const startTime = Date.now();
    
    // Override res.end to log the response
    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;
        
        // Choose appropriate emoji based on status code
        let emoji = '📤';
        if (statusCode >= 200 && statusCode < 300) emoji = '✅';
        else if (statusCode >= 300 && statusCode < 400) emoji = '↩️';
        else if (statusCode >= 400 && statusCode < 500) emoji = '⚠️';
        else if (statusCode >= 500) emoji = '❌';
        
        // Log the response
        console.log(`${emoji} [${timestamp}] ${method} ${url} - ${statusCode} - ${duration}ms`);
        
        // Call the original end method
        originalEnd.call(this, chunk, encoding);
    };
    
    next();
});

// Middleware
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors());

// Serve static files in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/front-end/dist")));
}

// Routes
app.use('/logs', logRoutes);

// Health check endpoint
app.get('/ping', (req, res) => {
    res.json({
        message: "Hey there! I'm alive",
        timestamp: new Date().toISOString(),
        status: "healthy"
    });
});

// Database health check endpoint
app.get('/health', async (req, res) => {
    try {
        const dbHealth = await db.healthCheck();
        
        // Check overall health status
        const isHealthy = dbHealth.status === 'healthy';
        const statusCode = isHealthy ? 200 : 503;
        
        res.status(statusCode).json({
            message: isHealthy ? "System health check passed" : "System health check failed",
            timestamp: new Date().toISOString(),
            database: dbHealth,
            server: { status: 'healthy' }
        });
    } catch (error) {
        console.error('Health check error:', error);
        res.status(503).json({
            message: "System health check failed",
            timestamp: new Date().toISOString(),
            database: { status: 'unhealthy', error: error.message },
            server: { status: 'healthy' }
        });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Log Ingestion and Querying System API',
        version: '1.0.0',
        endpoints: {
            'POST /logs': 'Ingest a single log entry',
            'POST /logs/bulk': 'Ingest multiple log entries (up to 10,000)',
            'GET /logs': 'Query logs with filtering and pagination',
            'GET /logs/all': 'Get all logs (for debugging)',
            'GET /ping': 'Basic health check',
            'GET /health': 'Detailed system health check'
        },
        documentation: {
            'GitHub': 'https://github.com/yourusername/evallo',
            'API Docs': 'See README.md for detailed API documentation'
        }
    });
});

// Catch-all route for frontend (must come after all API routes)
if (process.env.NODE_ENV === "production") {
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "front-end", "dist", "index.html"));
    });
}

// Global error handler
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
    });
});

app.listen(port, () => {
    console.log(`🚀 Log Ingestion and Querying System running on port ${port}`);
    console.log(`📍 API Documentation available at: http://localhost:${port}/`);
    console.log(`🔍 Basic health check: http://localhost:${port}/ping`);
    console.log(`🏥 Detailed health check: http://localhost:${port}/health`);
    console.log(`📝 Logs endpoint: http://localhost:${port}/logs`);
});