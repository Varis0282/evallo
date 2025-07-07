import db from '../../config/db.js';
import { v4 as uuidv4 } from 'uuid';

// Valid log levels
const VALID_LOG_LEVELS = ['error', 'warn', 'info', 'debug'];

// Log schema validation
const validateLogSchema = (log) => {
    const errors = [];
    
    // Required fields
    if (!log.level || typeof log.level !== 'string') {
        errors.push('level is required and must be a string');
    } else if (!VALID_LOG_LEVELS.includes(log.level.toLowerCase())) {
        errors.push(`level must be one of: ${VALID_LOG_LEVELS.join(', ')}`);
    }
    
    if (!log.message || typeof log.message !== 'string') {
        errors.push('message is required and must be a string');
    }
    
    if (!log.resourceId || typeof log.resourceId !== 'string') {
        errors.push('resourceId is required and must be a string');
    }
    
    if (!log.timestamp) {
        errors.push('timestamp is required');
    } else {
        // Validate timestamp format
        const timestamp = new Date(log.timestamp);
        if (isNaN(timestamp.getTime())) {
            errors.push('timestamp must be a valid ISO 8601 date string');
        }
    }
    
    if (!log.traceId || typeof log.traceId !== 'string') {
        errors.push('traceId is required and must be a string');
    }
    
    if (!log.spanId || typeof log.spanId !== 'string') {
        errors.push('spanId is required and must be a string');
    }
    
    if (!log.commit || typeof log.commit !== 'string') {
        errors.push('commit is required and must be a string');
    }
    
    if (!log.metadata || typeof log.metadata !== 'object') {
        errors.push('metadata is required and must be an object');
    }
    
    return errors;
};

// Create a single log entry
const createLog = async (logData) => {
    try {
        // Validate log data
        const validationErrors = validateLogSchema(logData);
        if (validationErrors.length > 0) {
            throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
        }
        
        // Generate unique ID
        const logId = uuidv4();
        
        // Create log entry with normalized level
        const logEntry = {
            id: logId,
            level: logData.level.toLowerCase(),
            message: logData.message,
            resourceId: logData.resourceId,
            timestamp: new Date(logData.timestamp).toISOString(),
            traceId: logData.traceId,
            spanId: logData.spanId,
            commit: logData.commit,
            metadata: logData.metadata
        };
        
        // Get existing logs
        const existingLogs = await db.safeGetData("/logs");
        
        // Add new log to the beginning of the array (most recent first)
        const updatedLogs = [logEntry, ...existingLogs];
        
        // Save updated logs
        await db.safePush("/logs", updatedLogs);
        
        return logEntry;
    } catch (error) {
        console.error('Error creating log:', error);
        throw error;
    }
};

// Create multiple log entries (bulk operation)
const createBulkLogs = async (logsData) => {
    try {
        // Validate input
        if (!Array.isArray(logsData)) {
            throw new Error('Bulk logs data must be an array');
        }
        
        if (logsData.length === 0) {
            throw new Error('At least one log entry is required');
        }
        
        if (logsData.length > 10000) {
            throw new Error('Cannot process more than 10,000 log entries at once');
        }
        
        // Validate all logs before processing
        const validationErrors = [];
        logsData.forEach((log, index) => {
            const errors = validateLogSchema(log);
            if (errors.length > 0) {
                validationErrors.push(`Log ${index + 1}: ${errors.join(', ')}`);
            }
        });
        
        if (validationErrors.length > 0) {
            throw new Error(`Validation failed: ${validationErrors.join('; ')}`);
        }
        
        // Process all logs
        const processedLogs = logsData.map(log => ({
            id: uuidv4(),
            level: log.level.toLowerCase(),
            message: log.message,
            resourceId: log.resourceId,
            timestamp: new Date(log.timestamp).toISOString(),
            traceId: log.traceId,
            spanId: log.spanId,
            commit: log.commit,
            metadata: log.metadata
        }));
        
        // Get existing logs
        const existingLogs = await db.safeGetData("/logs");
        
        // Add new logs to the beginning of the array (most recent first)
        const updatedLogs = [...processedLogs, ...existingLogs];
        
        // Save updated logs
        await db.safePush("/logs", updatedLogs);
        
        return {
            success: true,
            count: processedLogs.length,
            logs: processedLogs
        };
    } catch (error) {
        console.error('Error creating bulk logs:', error);
        throw error;
    }
};

// Get logs with filtering and pagination
const getLogs = async (filters = {}, pagination = {}) => {
    try {
        // Get all logs
        const allLogs = await db.safeGetData("/logs");
        
        // Apply filters
        let filteredLogs = allLogs;
        
        // Filter by level
        if (filters.level) {
            filteredLogs = filteredLogs.filter(log => 
                log.level === filters.level.toLowerCase()
            );
        }
        
        // Filter by message (case-insensitive partial match)
        if (filters.message) {
            const searchTerm = filters.message.toLowerCase();
            filteredLogs = filteredLogs.filter(log => 
                log.message.toLowerCase().includes(searchTerm)
            );
        }
        
        // Filter by resourceId
        if (filters.resourceId) {
            const searchTerm = filters.resourceId.toLowerCase();
            filteredLogs = filteredLogs.filter(log => 
                log.resourceId.toLowerCase().includes(searchTerm)
            );
        }
        
        // Filter by timestamp range
        if (filters.timestamp_start) {
            const startTime = new Date(filters.timestamp_start);
            filteredLogs = filteredLogs.filter(log => 
                new Date(log.timestamp) >= startTime
            );
        }
        
        if (filters.timestamp_end) {
            const endTime = new Date(filters.timestamp_end);
            filteredLogs = filteredLogs.filter(log => 
                new Date(log.timestamp) <= endTime
            );
        }
        
        // Filter by traceId
        if (filters.traceId) {
            const searchTerm = filters.traceId.toLowerCase();
            filteredLogs = filteredLogs.filter(log => 
                log.traceId.toLowerCase().includes(searchTerm)
            );
        }
        
        // Filter by spanId
        if (filters.spanId) {
            const searchTerm = filters.spanId.toLowerCase();
            filteredLogs = filteredLogs.filter(log => 
                log.spanId.toLowerCase().includes(searchTerm)
            );
        }
        
        // Filter by commit
        if (filters.commit) {
            const searchTerm = filters.commit.toLowerCase();
            filteredLogs = filteredLogs.filter(log => 
                log.commit.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply pagination
        const page = parseInt(pagination.page) || 1;
        const limit = parseInt(pagination.limit) || 50;
        
        // Validate pagination parameters
        if (page < 1) {
            throw new Error('Page number must be greater than 0');
        }
        
        if (limit < 1 || limit > 1000) {
            throw new Error('Limit must be between 1 and 1000');
        }
        
        const totalCount = filteredLogs.length;
        const totalPages = Math.ceil(totalCount / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        
        const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

        const sortedLogs = paginatedLogs.sort((a, b) => {
            return new Date(b.timestamp) - new Date(a.timestamp);
        });
        
        return {
            logs: sortedLogs,
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalCount,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
                startIndex: startIndex + 1,
                endIndex: Math.min(endIndex, totalCount)
            }
        };
    } catch (error) {
        console.error('Error getting logs:', error);
        throw error;
    }
};

// Get all logs (for debugging)
const getAllLogs = async () => {
    try {
        const allLogs = await db.safeGetData("/logs");
        return allLogs;
    } catch (error) {
        console.error('Error getting all logs:', error);
        throw error;
    }
};

export {
    createLog,
    createBulkLogs,
    getLogs,
    getAllLogs,
    validateLogSchema,
    VALID_LOG_LEVELS
};
