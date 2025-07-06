import fs from 'fs';

// Arrays of realistic data for generating log entries
const logLevels = ['error', 'warn', 'info', 'debug'];
const services = ['database', 'api-gateway', 'authentication', 'payment', 'cache', 'file-storage', 'backup', 'monitoring', 'load-balancer', 'notification'];
const environments = ['production', 'staging', 'development'];
const regions = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'];

const errorMessages = [
    'Database connection failed: Connection timeout after 30 seconds',
    'Payment processing failed: Invalid credit card number',
    'File upload failed: Maximum file size exceeded',
    'Authentication failed: Invalid credentials',
    'Service unavailable: Circuit breaker is open',
    'Rate limit exceeded: Too many requests',
    'Internal server error: Null pointer exception',
    'Network timeout: Request timed out after 60 seconds',
    'Disk space full: Cannot write to log file',
    'Memory allocation failed: Out of memory'
];

const warnMessages = [
    'High memory usage detected: 85% of available RAM',
    'SSL certificate expires in 7 days',
    'High CPU usage detected: 90% utilization',
    'Database connection pool nearly exhausted',
    'Cache hit ratio below threshold: 65%',
    'API response time exceeding SLA: 2.5 seconds',
    'Disk usage warning: 80% full',
    'Network latency high: 500ms average',
    'Queue depth increasing: 1000 messages pending',
    'Session timeout approaching: 2 minutes remaining'
];

const infoMessages = [
    'User login successful',
    'API request processed successfully',
    'Scheduled backup completed successfully',
    'Cache refresh completed',
    'Database connection established',
    'File upload completed',
    'User logout successful',
    'Payment processed successfully',
    'Email notification sent',
    'System health check passed'
];

const debugMessages = [
    'Cache miss for key: user_profile_456',
    'Query executed: SELECT * FROM users WHERE id = 123',
    'Function called: getUserProfile(userId)',
    'Variable value: sessionId = abc123',
    'Loop iteration: processing item 5 of 10',
    'Entering method: validateUserInput()',
    'Exiting method: processPayment()',
    'Configuration loaded: database.timeout = 30s',
    'Thread created: worker-thread-01',
    'Connection pool size: 10 active connections'
];

const messagesByLevel = {
    error: errorMessages,
    warn: warnMessages,
    info: infoMessages,
    debug: debugMessages
};

// Function to generate a random timestamp within the last 30 days
function generateTimestamp() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const randomTime = thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime());
    return new Date(randomTime).toISOString();
}

// Function to generate a random commit hash
function generateCommitHash() {
    const chars = 'abcdef0123456789';
    let hash = '';
    for (let i = 0; i < 7; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
}

// Function to generate a random ID
function generateId(prefix, number) {
    const padded = number.toString().padStart(3, '0');
    return `${prefix}-${padded}`;
}

// Function to generate a single log entry
function generateLogEntry(index) {
    const level = logLevels[Math.floor(Math.random() * logLevels.length)];
    const service = services[Math.floor(Math.random() * services.length)];
    const environment = environments[Math.floor(Math.random() * environments.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];
    const messages = messagesByLevel[level];
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    const logEntry = {
        level,
        message,
        resourceId: generateId(service, Math.floor(Math.random() * 100) + 1),
        timestamp: generateTimestamp(),
        traceId: generateId('trace', index + 1),
        spanId: generateId('span', index + 1),
        commit: generateCommitHash(),
        metadata: {
            service,
            environment,
            region
        }
    };
    
    // Add service-specific metadata
    switch (service) {
        case 'database':
            logEntry.metadata.queryTime = `${(Math.random() * 2).toFixed(3)}s`;
            break;
        case 'api-gateway':
            logEntry.metadata.endpoint = `/api/v1/${['users', 'orders', 'products', 'payments'][Math.floor(Math.random() * 4)]}`;
            break;
        case 'authentication':
            logEntry.metadata.userId = `user${Math.floor(Math.random() * 10000)}`;
            break;
        case 'payment':
            logEntry.metadata.transactionId = `tx-${Math.floor(Math.random() * 100000)}`;
            break;
        case 'cache':
            logEntry.metadata.cacheKey = `cache_${Math.floor(Math.random() * 1000)}`;
            break;
        case 'file-storage':
            logEntry.metadata.fileSize = `${Math.floor(Math.random() * 100)}MB`;
            break;
        case 'backup':
            logEntry.metadata.backupSize = `${(Math.random() * 10).toFixed(1)}GB`;
            break;
        case 'load-balancer':
            logEntry.metadata.domain = `${['api', 'web', 'cdn'][Math.floor(Math.random() * 3)]}.example.com`;
            break;
        case 'notification':
            logEntry.metadata.notificationType = ['email', 'sms', 'push'][Math.floor(Math.random() * 3)];
            break;
    }
    
    return logEntry;
}

// Generate 10,000 log entries
console.log('Generating 10,000 log entries...');
const logEntries = [];
for (let i = 0; i < 10000; i++) {
    logEntries.push(generateLogEntry(i));
    if ((i + 1) % 1000 === 0) {
        console.log(`Generated ${i + 1} entries...`);
    }
}

// Sort by timestamp (oldest first)
logEntries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

// Write to JSON file
const jsonData = JSON.stringify(logEntries, null, 2);
fs.writeFileSync('test-data-10k.json', jsonData);

console.log('✅ Successfully generated test-data-10k.json with 10,000 log entries');
console.log(`📊 File size: ${(fs.statSync('test-data-10k.json').size / 1024 / 1024).toFixed(2)} MB`);

// Generate statistics
const stats = {
    totalEntries: logEntries.length,
    levelDistribution: {},
    serviceDistribution: {},
    environmentDistribution: {}
};

logEntries.forEach(entry => {
    stats.levelDistribution[entry.level] = (stats.levelDistribution[entry.level] || 0) + 1;
    stats.serviceDistribution[entry.metadata.service] = (stats.serviceDistribution[entry.metadata.service] || 0) + 1;
    stats.environmentDistribution[entry.metadata.environment] = (stats.environmentDistribution[entry.metadata.environment] || 0) + 1;
});

console.log('\n📈 Statistics:');
console.log('Level Distribution:', stats.levelDistribution);
console.log('Service Distribution:', stats.serviceDistribution);
console.log('Environment Distribution:', stats.environmentDistribution); 