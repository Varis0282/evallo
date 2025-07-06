import express from 'express';
import { ingestLog, ingestBulkLogs, queryLogs, getAllLogsController } from '../controllers/logs.js';

const router = express.Router();

// POST /logs - Ingest a single log entry
router.post('/', ingestLog);

// POST /logs/bulk - Ingest multiple log entries (bulk operation)
router.post('/bulk', ingestBulkLogs);

// GET /logs - Query logs with filtering and pagination
router.get('/', queryLogs);

// GET /logs/all - Get all logs (for debugging)
router.get('/all', getAllLogsController);

export default router;
