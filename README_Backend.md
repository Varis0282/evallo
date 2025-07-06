# Log Ingestion and Querying System

A full-stack log ingestion and querying system built with Node.js/Express.js backend and React frontend. This system provides comprehensive log management capabilities with advanced filtering, pagination, and lazy loading support.

## Overview

This system implements a complete log management solution with the following key features:

### Backend Features
- **Log Ingestion**: Accept structured log entries via REST API
- **Advanced Querying**: Filter logs by level, message content, resource ID, timestamps, and more
- **Pagination Support**: Optimized for frontend lazy loading with configurable page size
- **JSON File Storage**: Uses a single JSON file as the database (as per requirement)
- **Schema Validation**: Strict validation of log entry structure
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
- **CORS Support**: Proper CORS configuration using the cors library
- **Request Logging**: Console logging of all API requests with timestamps and performance metrics

### Frontend Features
- **Modern React UI**: Built with React and modern UI components
- **Lazy Loading**: Efficient pagination for handling large datasets
- **Real-time Filtering**: Dynamic filtering with combined criteria
- **Responsive Design**: Clean, intuitive interface for log analysis
- **Visual Log Levels**: Color-coded log levels for quick identification

## Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository and navigate to the project directory:
```bash
git clone <repository-url>
cd evallo
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd evallo
npm install
cd ..
```

4. Create the data directory for the backend:
```bash
mkdir -p data
```

5. (Optional) Generate test data for development and testing:
```bash
node generate-test-data.js
```
This creates `test-data-10k.json` with 10,000 realistic log entries for testing.

### Running the Application

#### Backend Server

**Development Mode (with auto-restart):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The backend server will start on port 4000 by default. The server will log all API requests to the console with timestamps, status codes, and response times.

**Note**: The server uses `nodemon.json` configuration to ignore data files (like `data/logs.json` and `test-data*.json`) to prevent unnecessary server restarts when log data is saved.

#### Frontend Application

In a separate terminal:
```bash
cd evallo
npm run dev
```

The frontend will start on port 3000 by default.

### Full Application URLs

- **Backend API**: `http://localhost:4000`
- **Frontend UI**: `http://localhost:3000`

## Console Logging

The server includes comprehensive request logging that displays in the console:

### Log Format
```
📥 [2024-01-15T08:00:00.123Z] POST /logs - 127.0.0.1
✅ [2024-01-15T08:00:00.123Z] POST /logs - 201 - 45ms
```

### Log Components
- **📥 Incoming Request**: Shows timestamp, HTTP method, endpoint, and client IP
- **📤 Response**: Shows timestamp, method, endpoint, status code, and response time
- **Status Indicators**:
  - ✅ Success (200-299)
  - ↩️ Redirect (300-399) 
  - ⚠️ Client Error (400-499)
  - ❌ Server Error (500+)

### Example Console Output
```
🚀 Log Ingestion and Querying System running on port 4000
📍 API Documentation available at: http://localhost:4000/
🔍 Health check: http://localhost:4000/ping
📝 Logs endpoint: http://localhost:4000/logs

📥 [2024-01-15T08:00:00.123Z] GET /ping - 127.0.0.1
✅ [2024-01-15T08:00:00.125Z] GET /ping - 200 - 2ms

📥 [2024-01-15T08:01:00.456Z] POST /logs/bulk - 127.0.0.1
✅ [2024-01-15T08:01:00.498Z] POST /logs/bulk - 201 - 42ms

📥 [2024-01-15T08:02:00.789Z] GET /logs?level=error&page=1&limit=50 - 127.0.0.1
✅ [2024-01-15T08:02:00.795Z] GET /logs?level=error&page=1&limit=50 - 200 - 6ms
```

### Database Modification Monitoring
The console logging helps track database operations:

**Log Ingestion Operations:**
```
📥 [2024-01-15T08:01:00.456Z] POST /logs - 127.0.0.1
✅ [2024-01-15T08:01:00.498Z] POST /logs - 201 - 42ms
```

**Bulk Upload Operations:**
```
📥 [2024-01-15T08:03:00.123Z] POST /logs/bulk - 127.0.0.1
✅ [2024-01-15T08:03:02.456Z] POST /logs/bulk - 201 - 2333ms
```
*Note: Bulk operations may take longer depending on the number of entries*

**Database File Changes:**
- File modifications are atomic and don't trigger server restarts
- Each successful write operation is logged with response time
- Failed operations show error status codes (400/500)
- No manual database monitoring required - all changes are API-driven

## API Documentation

### Base URL
```
http://localhost:4000
```

### Endpoints

#### 1. Health Check
```
GET /ping
```
Returns server status and timestamp.

**Response:**
```json
{
  "message": "Hey there! I'm alive",
  "timestamp": "2023-09-15T08:00:00.000Z",
  "status": "healthy"
}
```

#### 2. Root Endpoint
```
GET /
```
Returns API information and available endpoints.

#### 3. Ingest Log Entry
```
POST /logs
```

Accepts a single log entry and stores it in the JSON database.

#### 4. Bulk Ingest Log Entries
```
POST /logs/bulk
```

Accepts multiple log entries and stores them in the JSON database. Maximum 10,000 entries per request.

**Request Body (Array of log entries):**
```json
[
  {
    "level": "error",
    "message": "Failed to connect to database",
    "resourceId": "server-1234",
    "timestamp": "2023-09-15T08:00:00Z",
    "traceId": "abc-xyz-123",
    "spanId": "span-456",
    "commit": "5e5342f",
    "metadata": {
      "parentResourceId": "server-5678"
    }
  },
  {
    "level": "info",
    "message": "User login successful",
    "resourceId": "auth-service-001",
    "timestamp": "2023-09-15T08:01:00Z",
    "traceId": "abc-xyz-124",
    "spanId": "span-457",
    "commit": "5e5342f",
    "metadata": {
      "userId": "user123"
    }
  }
]
```

**Success Response (201 Created):**
```json
{
  "message": "Bulk logs ingested successfully",
  "success": true,
  "inserted": 2,
  "logs": [
    {
      "level": "error",
      "message": "Failed to connect to database",
      "resourceId": "server-1234",
      "timestamp": "2023-09-15T08:00:00Z",
      "traceId": "abc-xyz-123",
      "spanId": "span-456",
      "commit": "5e5342f",
      "metadata": {
        "parentResourceId": "server-5678"
      },
      "id": "1694764800000abc123def0"
    },
    {
      "level": "info",
      "message": "User login successful",
      "resourceId": "auth-service-001",
      "timestamp": "2023-09-15T08:01:00Z",
      "traceId": "abc-xyz-124",
      "spanId": "span-457",
      "commit": "5e5342f",
      "metadata": {
        "userId": "user123"
      },
      "id": "1694764800000abc123def1"
    }
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Validation Error",
  "message": "Validation failed for 1 logs: Log 1: Missing required field: level"
}
```

#### 5. Single Log Entry Request Body
For the single log endpoint (POST /logs), use this format:

**Request Body:**
```json
{
  "level": "error",
  "message": "Failed to connect to database",
  "resourceId": "server-1234",
  "timestamp": "2023-09-15T08:00:00Z",
  "traceId": "abc-xyz-123",
  "spanId": "span-456",
  "commit": "5e5342f",
  "metadata": {
    "parentResourceId": "server-5678"
  }
}
```

**Success Response (201 Created):**
```json
{
  "level": "error",
  "message": "Failed to connect to database",
  "resourceId": "server-1234",
  "timestamp": "2023-09-15T08:00:00Z",
  "traceId": "abc-xyz-123",
  "spanId": "span-456",
  "commit": "5e5342f",
  "metadata": {
    "parentResourceId": "server-5678"
  },
  "id": "1694764800000"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Validation Error",
  "message": "Validation failed: Missing required field: level, Invalid log level. Must be one of: error, warn, info, debug"
}
```

#### 6. Query Logs with Pagination
```
GET /logs
```

Retrieves logs with optional filtering and pagination support optimized for lazy loading.

**Query Parameters:**

*Filter Parameters:*
- `level` (string): Filter by log level (error, warn, info, debug)
- `message` (string): Case-insensitive full-text search in message field
- `resourceId` (string): Filter by resource ID
- `traceId` (string): Filter by trace ID
- `spanId` (string): Filter by span ID
- `commit` (string): Filter by commit hash
- `timestamp_start` (string): ISO 8601 timestamp for start of range
- `timestamp_end` (string): ISO 8601 timestamp for end of range

*Pagination Parameters:*
- `page` (number): Page number (default: 1)
- `limit` (number): Number of logs per page (default: 50, max: 1000)

**Example Requests:**
```bash
# Get first page of error logs (default 50 items)
GET /logs?level=error&page=1&limit=50

# Search for database-related logs with pagination
GET /logs?message=database&page=1&limit=20

# Get logs from specific resource with custom page size
GET /logs?resourceId=server-1234&page=2&limit=25

# Get logs within time range
GET /logs?timestamp_start=2023-09-15T07:00:00Z&timestamp_end=2023-09-15T09:00:00Z&page=1&limit=100

# Combined filtering with pagination
GET /logs?level=error&message=database&resourceId=server-1234&page=1&limit=10
```

**Success Response (200 OK):**
```json
{
  "logs": [
    {
      "level": "error",
      "message": "Failed to connect to database",
      "resourceId": "server-1234",
      "timestamp": "2023-09-15T08:00:00Z",
      "traceId": "abc-xyz-123",
      "spanId": "span-456",
      "commit": "5e5342f",
      "metadata": {
        "parentResourceId": "server-5678"
      },
      "id": "1694764800000"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalLogs": 250,
    "limit": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**Pagination Metadata:**
- `currentPage`: Current page number
- `totalPages`: Total number of pages
- `totalLogs`: Total number of logs matching the filter criteria
- `limit`: Number of logs per page
- `hasNextPage`: Boolean indicating if there are more pages
- `hasPrevPage`: Boolean indicating if there are previous pages

## Database Operations

### JSON File Database
The system uses a single JSON file (`data/logs.json`) as its database, implemented with the `node-json-db` library.

#### Database Structure
```json
{
  "logs": [
    {
      "level": "error",
      "message": "Database connection failed",
      "resourceId": "server-001",
      "timestamp": "2024-01-15T08:00:00Z",
      "traceId": "trace-001",
      "spanId": "span-001", 
      "commit": "abc123f",
      "metadata": {
        "service": "database",
        "environment": "production"
      },
      "id": "1705305600000abc123def0"
    }
  ]
}
```

#### Database Initialization
- Database file is automatically created if it doesn't exist
- Initial structure with empty logs array is set up on first run
- Located in `data/logs.json` (directory created automatically)

#### Data Persistence Operations

**Single Log Ingestion:**
- Validates log entry against schema
- Generates unique ID using timestamp + random string
- Appends to existing logs array
- Saves entire file atomically

**Bulk Log Ingestion:**
- Validates all entries before processing
- Generates unique IDs for each entry
- Appends all valid entries in a single operation
- Atomic write ensures data consistency
- Supports up to 10,000 entries per request

**Log Retrieval:**
- Reads entire file into memory
- Applies filters in JavaScript using Array methods
- Sorts by timestamp (newest first)
- Applies pagination to results
- Returns paginated data with metadata

#### Performance Characteristics
- **Read Operations**: O(n) - entire file loaded into memory
- **Write Operations**: O(n) - entire file rewritten
- **Filter Operations**: O(n) - in-memory JavaScript filtering
- **Memory Usage**: Proportional to total log count
- **Concurrency**: Single-threaded, atomic operations

#### Data Consistency
- **Atomic Writes**: node-json-db ensures atomic file operations
- **Validation**: All entries validated before database modification
- **Error Handling**: Failed operations don't corrupt existing data
- **Backup**: Consider implementing backup strategy for production

#### File Management
- **Location**: `data/logs.json`
- **Format**: Pretty-printed JSON for readability
- **Encoding**: UTF-8
- **Permissions**: Read/write access required for application user

#### Database Maintenance

**File Size Management:**
```bash
# Check current database size
ls -lh data/logs.json

# Count total log entries
grep -o '"id":' data/logs.json | wc -l
```

**Backup Operations:**
```bash
# Create backup before bulk operations
cp data/logs.json data/logs-backup-$(date +%Y%m%d).json

# Restore from backup if needed
cp data/logs-backup-20240115.json data/logs.json
```

**Performance Monitoring:**
- Monitor API response times for bulk operations
- Watch memory usage during large dataset operations
- Consider pagination with smaller limits for better performance
- Response times > 5 seconds indicate need for optimization

**Data Migration:**
```javascript
// Export logs to external database
const logs = await getAllLogs();
// Process logs for external database format
// Import to PostgreSQL, MongoDB, etc.
```

**Recommended Limits:**
- **Development**: Up to 50,000 entries (~20MB file)
- **Testing**: Up to 100,000 entries (~40MB file)  
- **Production**: Consider external database for larger datasets

## Log Schema

All log entries must conform to this schema:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| level | String | Yes | Log level (error, warn, info, debug) |
| message | String | Yes | Primary log message |
| resourceId | String | Yes | Resource identifier |
| timestamp | String | Yes | ISO 8601 timestamp |
| traceId | String | Yes | Trace identifier |
| spanId | String | Yes | Span identifier |
| commit | String | Yes | Git commit hash |
| metadata | Object | Yes | Additional context |

## Project Structure

```
evallo/
├── app/                     # Backend application
│   ├── apis/
│   │   └── logs.js          # API routes definition
│   ├── controllers/
│   │   └── logs.js          # Business logic and request handling
│   └── models/
│       └── logs.js          # Data models and database operations
├── config/
│   └── db.js                # Database configuration
├── data/
│   └── logs.json            # JSON database file (auto-created)
├── evallo/                  # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API service functions
│   │   └── App.jsx          # Main application component
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
├── generate-test-data.js     # Script to generate 10k test log entries
├── test-data-10k.json       # Generated test data (created by script)
├── nodemon.json             # Nodemon configuration (ignores data files)
├── server.js                # Backend server file
├── package.json             # Backend dependencies and scripts
└── README.md               # This file
```

## Frontend Integration

### Lazy Loading Implementation

The API is optimized for lazy loading with the following features:

1. **Pagination Support**: Use `page` and `limit` parameters to load data in chunks
2. **Efficient Filtering**: Combine filters with pagination for targeted data loading
3. **Metadata Response**: Pagination metadata helps implement infinite scroll or pagination UI
4. **Configurable Page Size**: Adjust `limit` based on UI requirements (default: 50, max: 1000)

### Example Frontend Usage

```javascript
// Fetch logs with pagination
const fetchLogs = async (filters = {}, page = 1, limit = 50) => {
  const params = new URLSearchParams({
    ...filters,
    page: page.toString(),
    limit: limit.toString()
  });
  
  const response = await fetch(`http://localhost:4000/logs?${params}`);
  const data = await response.json();
  
  return data; // { logs: [...], pagination: {...} }
};

// Example: Implementing infinite scroll
const loadMoreLogs = async () => {
  const nextPage = currentPage + 1;
  const result = await fetchLogs(currentFilters, nextPage);
  
  setLogs(prevLogs => [...prevLogs, ...result.logs]);
  setCurrentPage(nextPage);
  setHasMore(result.pagination.hasNextPage);
};
```

## Design Decisions and Trade-offs

### 1. JSON File Database
**Decision:** Used `node-json-db` library for JSON file persistence.
**Rationale:** 
- Meets the requirement of using a single JSON file as database
- Provides atomic write operations and JSON handling
- Simplifies setup with no external database dependencies
- Suitable for the scope of this assignment

**Trade-offs:**
- Not suitable for high-concurrency scenarios
- Limited scalability compared to proper databases
- All data loaded into memory for operations

### 2. Pagination for Lazy Loading
**Decision:** Implemented server-side pagination with metadata.
**Rationale:**
- Optimizes frontend performance with large datasets
- Reduces memory usage on both client and server
- Enables smooth infinite scroll and pagination UI
- Provides metadata for UI state management

**Trade-offs:**
- Slightly more complex API contract
- Requires frontend state management for pagination

### 3. CORS Configuration
**Decision:** Used the dedicated `cors` library instead of manual middleware.
**Rationale:**
- More reliable and tested CORS implementation
- Better security defaults
- Easier to configure and maintain
- Industry standard approach

### 4. Monorepo Structure
**Decision:** Single repository for both frontend and backend.
**Rationale:**
- Simplified deployment and development workflow
- Easier to maintain API contracts
- Better coordination between frontend and backend changes
- Suitable for full-stack development

### 5. Express.js Architecture
**Decision:** Used traditional MVC-style architecture with routes, controllers, and models.
**Rationale:**
- Clear separation of concerns
- Easy to understand and maintain
- Follows Express.js best practices
- Scalable structure for future enhancements

## Test Data

The repository includes tools and data for testing the log ingestion system with realistic data.

### Generating Test Data

To generate 10,000 realistic log entries, use the provided script:

```bash
node generate-test-data.js
```

This script will create `test-data-10k.json` containing 10,000 log entries with:

### Test Data Features
- **Realistic Messages**: Context-appropriate messages for each log level
- **Multiple Services**: 10 different services (database, api-gateway, authentication, payment, cache, file-storage, backup, monitoring, load-balancer, notification)
- **Service-Specific Metadata**: Each service includes relevant metadata fields
- **Temporal Distribution**: Timestamps distributed over the last 30 days
- **Balanced Distribution**: Even distribution across log levels and environments

### Test Data Statistics
- **Total Entries**: 10,000
- **File Size**: ~3.8 MB
- **Log Levels**: Distributed across error, warn, info, debug
- **Services**: 10 different services with realistic resource IDs
- **Environments**: production, staging, development
- **Time Range**: Last 30 days with realistic chronological ordering

### Generated Data Structure
Each log entry includes:
- **Level-appropriate messages**: Errors include failure scenarios, warnings include resource alerts, etc.
- **Service metadata**: Database logs include query times, API logs include endpoints, etc.
- **Unique identifiers**: Trace IDs, span IDs, and commit hashes
- **Realistic timestamps**: Chronologically ordered within the last 30 days

### Sample Generated Log Entry
```json
{
  "level": "error",
  "message": "Database connection failed: Connection timeout after 30 seconds",
  "resourceId": "database-001",
  "timestamp": "2024-01-15T08:00:00Z",
  "traceId": "trace-001",
  "spanId": "span-001",
  "commit": "abc123f",
  "metadata": {
    "service": "database",
    "environment": "production",
    "region": "us-east-1",
    "queryTime": "1.234s"
  }
}
```

### Using Test Data
You can use the generated test data to:
1. **Bulk Upload Testing**: Test the `/logs/bulk` endpoint with large datasets
2. **Performance Testing**: Evaluate pagination performance with 10,000+ entries
3. **Filter Testing**: Test various filter combinations across different services and log levels
4. **UI Development**: Provide realistic data for frontend development and testing
5. **Load Testing**: Simulate real-world log ingestion scenarios

## Testing the API

### Using curl

**Health Check:**
```bash
curl http://localhost:4000/ping
```

**Ingest a log:**
```bash
curl -X POST http://localhost:4000/logs \
  -H "Content-Type: application/json" \
  -d '{
    "level": "error",
    "message": "Database connection failed",
    "resourceId": "server-001",
    "timestamp": "2023-09-15T08:00:00Z",
    "traceId": "trace-123",
    "spanId": "span-456",
    "commit": "abc123",
    "metadata": {"service": "auth"}
  }'
```

**Generate and upload test data:**
```bash
# First, generate the test data
node generate-test-data.js

# Then upload it to the API
curl -X POST http://localhost:4000/logs/bulk \
  -H "Content-Type: application/json" \
  -d @test-data-10k.json
```

**Query logs with pagination:**
```bash
curl "http://localhost:4000/logs?level=error&page=1&limit=10"
```

### Using PowerShell (Windows)

**Health Check:**
```powershell
Invoke-RestMethod -Uri "http://localhost:4000/ping"
```

**Ingest a log:**
```powershell
$body = @{
    level = "error"
    message = "Database connection failed"
    resourceId = "server-001"
    timestamp = "2023-09-15T08:00:00Z"
    traceId = "trace-123"
    spanId = "span-456"
    commit = "abc123"
    metadata = @{service = "auth"}
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:4000/logs" -Method Post -Body $body -ContentType "application/json"
```

**Generate and upload test data:**
```powershell
# First, generate the test data
node generate-test-data.js

# Then upload it to the API
$bulkData = Get-Content -Path "test-data-10k.json" -Raw
Invoke-RestMethod -Uri "http://localhost:4000/logs/bulk" -Method Post -Body $bulkData -ContentType "application/json"
```

**Query logs with pagination:**
```powershell
Invoke-RestMethod -Uri "http://localhost:4000/logs?level=error&page=1&limit=10"
```

### Using a REST Client

You can also use tools like Postman, Insomnia, or VS Code REST Client extension to test the API endpoints.

## Dependencies

### Backend
- **express**: Web application framework
- **cors**: Cross-Origin Resource Sharing middleware
- **dotenv**: Environment variable management
- **node-json-db**: JSON file database
- **nodemon**: Development server with auto-restart

### Frontend
- **react**: UI library
- **vite**: Build tool and dev server
- **axios**: HTTP client (recommended for API calls)

## Environment Variables

### Backend
- `PORT`: Server port (default: 4000)

### Frontend
- `VITE_API_URL`: Backend API URL (default: http://localhost:4000)

## Development Configuration

### Nodemon Setup
The project includes a `nodemon.json` configuration file that prevents unnecessary server restarts:

**Ignored Files/Directories:**
- `data/**/*` - Database files (logs.json)
- `test-data*.json` - Test data files
- `*.log` - Log files
- `evallo/**/*` - Frontend directory
- `node_modules/**/*` - Dependencies
- `.git/**/*` - Git files

**Benefits:**
- Server doesn't restart when log data is saved
- Faster development workflow
- Prevents interruption during bulk log ingestion
- Only restarts when actual code changes are made

### Development Workflow
1. Code changes (`.js` files) → Server restarts automatically
2. Log ingestion → Server continues running
3. Test data generation → Server continues running

## Performance Considerations

### Backend
- **Pagination**: Limits memory usage and response time
- **Indexing**: Consider implementing in-memory indexing for large datasets
- **Caching**: Filter results could be cached for frequently accessed data

### Frontend
- **Lazy Loading**: Implement virtual scrolling for very large lists
- **Debouncing**: Debounce search inputs to reduce API calls
- **Caching**: Cache filtered results to improve user experience

## Future Enhancements

If given more time, the following features could be added:

1. **Real-time Updates**: WebSocket support for live log streaming
2. **Advanced Search**: Full-text search with highlighting
3. **Export Functionality**: Export filtered logs to CSV/JSON
4. **Log Aggregation**: Basic analytics and log level summaries
5. **Authentication**: User authentication and authorization
6. **Rate Limiting**: API rate limiting for production use
7. **Monitoring**: Performance monitoring and alerting
8. **Data Retention**: Automatic log rotation and archival

## License

ISC License - See package.json for details.

## Author

Varis Rajak 