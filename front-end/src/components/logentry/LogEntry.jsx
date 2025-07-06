const LogEntry = ({ log, index }) => {
  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  // Get CSS classes for log level
  const getLogLevelClasses = (level) => {
    switch (level) {
      case "error":
        return "border-l-red-500 bg-red-50"
      case "warn":
        return "border-l-yellow-500 bg-yellow-50"
      case "info":
        return "border-l-blue-500 bg-blue-50"
      case "debug":
        return "border-l-gray-500 bg-gray-50"
      default:
        return "border-l-gray-300 bg-white"
    }
  }

  const getLogLevelHoverClasses = (level) => {
    switch (level) {
      case "error":
        return "hover:bg-red-100"
      case "warn":
        return "hover:bg-yellow-100"
      case "info":
        return "hover:bg-blue-100"
      case "debug":
        return "hover:bg-gray-100"
      default:
        return "hover:bg-gray-100"
    }
  }

  const getBadgeClasses = (level) => {
    switch (level) {
      case "error":
        return "bg-red-600 text-white"
      case "warn":
        return "bg-yellow-600 text-white"
      case "info":
        return "bg-blue-600 text-white"
      case "debug":
        return "bg-gray-600 text-white"
      default:
        return "bg-gray-400 text-white"
    }
  }

  return (
    <div
      className={`px-6 py-4 border-b border-gray-100 border-l-4 transition-colors ${getLogLevelClasses(log.level)} ${getLogLevelHoverClasses(log.level)}`}
    >
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${getBadgeClasses(log.level)}`}>
          {log.level}
        </span>
        <span className="text-sm text-gray-600 font-mono">{formatTimestamp(log.timestamp)}</span>
        <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">{log.resourceId}</span>
      </div>

      <div className="text-gray-900 mb-3 break-words">{log.message}</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
        <div>
          <strong className="text-gray-700">Trace ID:</strong> {log.traceId}
        </div>
        <div>
          <strong className="text-gray-700">Span ID:</strong> {log.spanId}
        </div>
        <div>
          <strong className="text-gray-700">Commit:</strong> {log.commit}
        </div>
        {log.metadata && Object.keys(log.metadata).length > 0 && (
          <div className="md:col-span-3">
            <strong className="text-gray-700">Metadata:</strong>
            <pre className="bg-gray-100 p-2 rounded text-xs mt-1 overflow-x-auto">
              {JSON.stringify(log.metadata, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default LogEntry
