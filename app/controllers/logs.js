import { createLog, createBulkLogs, getLogs, getAllLogs, VALID_LOG_LEVELS } from '../models/logs.js';

// Ingest a single log entry
const ingestLog = async (req, res) => {
    try {
        const logData = req.body;
        
        // Validate request body
        if (!logData || typeof logData !== 'object') {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Request body must be a valid JSON object'
            });
        }
        
        // Create log entry
        const logEntry = await createLog(logData);
        
        // Return success response
        res.status(201).json({
            message: 'Log entry created successfully',
            data: logEntry
        });
        
    } catch (error) {
        console.error('Error in ingestLog:', error);
        
        // Handle validation errors
        if (error.message.includes('Validation failed')) {
            return res.status(400).json({
                error: 'Bad Request',
                message: error.message
            });
        }
        
        // Handle other errors
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to create log entry'
        });
    }
};

// Ingest multiple log entries (bulk operation)
const ingestBulkLogs = async (req, res) => {
    try {
        const logsData = req.body;
        
        // Validate request body
        if (!Array.isArray(logsData)) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Request body must be an array of log entries'
            });
        }
        
        if (logsData.length === 0) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'At least one log entry is required'
            });
        }
        
        if (logsData.length > 10000) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Cannot process more than 10,000 log entries at once'
            });
        }
        
        // Create bulk log entries
        const result = await createBulkLogs(logsData);
        
        // Return success response
        res.status(201).json({
            message: `Successfully created ${result.count} log entries`,
            data: {
                count: result.count,
                logs: result.logs
            }
        });
        
    } catch (error) {
        console.error('Error in ingestBulkLogs:', error);
        
        // Handle validation errors
        if (error.message.includes('Validation failed')) {
            return res.status(400).json({
                error: 'Bad Request',
                message: error.message
            });
        }
        
        // Handle other errors
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to create bulk log entries'
        });
    }
};

// Query logs with filtering and pagination
const queryLogs = async (req, res) => {
    try {
        const {
            level,
            message,
            resourceId,
            startTime,
            endTime,
            traceId,
            spanId,
            commit,
            page = 1,
            limit = 50
        } = req.query;
        
        // Validate query parameters
        if (level && !VALID_LOG_LEVELS.includes(level.toLowerCase())) {
            return res.status(400).json({
                error: 'Bad Request',
                message: `Invalid log level. Must be one of: ${VALID_LOG_LEVELS.join(', ')}`
            });
        }
        
        // Validate timestamp formats
        if (startTime) {
            const startDate = new Date(startTime);
            if (isNaN(startDate.getTime())) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'startTime must be a valid ISO 8601 date string'
                });
            }
        }
        
        if (endTime) {
            const endDate = new Date(endTime);
            if (isNaN(endDate.getTime())) {
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'endTime must be a valid ISO 8601 date string'
                });
            }
        }
        
        // Validate pagination parameters
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        
        if (isNaN(pageNum) || pageNum < 1) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Page number must be a positive integer'
            });
        }
        
        if (isNaN(limitNum) || limitNum < 1 || limitNum > 1000) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Limit must be between 1 and 1000'
            });
        }
        
        // Build filters object
        const filters = {};
        if (level) filters.level = level;
        if (message) filters.message = message;
        if (resourceId) filters.resourceId = resourceId;
        if (startTime) filters.startTime = startTime;
        if (endTime) filters.endTime = endTime;
        if (traceId) filters.traceId = traceId;
        if (spanId) filters.spanId = spanId;
        if (commit) filters.commit = commit;
        
        // Build pagination object
        const pagination = {
            page: pageNum,
            limit: limitNum
        };
        
        // Get logs with filters and pagination
        const result = await getLogs(filters, pagination);
        // Return success response with a delay to simulate a real-time response and to show UI loading state and UI features
        setTimeout(() => {
            res.status(200).json({
                message: 'Logs retrieved successfully',
                data: result.logs || [],
                pagination: result.pagination,
                filters: filters
            });
        }, 1000);
    } catch (error) {
        console.error('Error in queryLogs:', error);
        
        // Handle validation errors
        if (error.message.includes('must be') || error.message.includes('required')) {
            return res.status(400).json({
                error: 'Bad Request',
                message: error.message
            });
        }
        
        // Handle other errors
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to retrieve logs'
        });
    }
};

// Get all logs (for debugging)
const getAllLogsController = async (req, res) => {
    try {
        const allLogs = await getAllLogs();
        
        res.status(200).json({
            message: 'All logs retrieved successfully',
            data: allLogs,
            count: allLogs.length
        });
        
    } catch (error) {
        console.error('Error in getAllLogsController:', error);
        
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to retrieve all logs'
        });
    }
};

export {
    ingestLog,
    ingestBulkLogs,
    queryLogs,
    getAllLogsController
};
