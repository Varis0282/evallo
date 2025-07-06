"use client"

import  LogEntry from "../logentry/LogEntry"
import  InfiniteScrollTrigger from "../infinitescrolltriger/InfiniteScrollTrigger"
import  LogListSkeleton from "../loglistskeleton/LogListSkeleton"

const LogList = ({ logs, loading, error, pagination, onLoadMore, initialLoading }) => {
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-8 bg-red-50 border-l-4 border-red-500 text-red-700 text-center">
          <div className="mb-2">❌ Error loading logs</div>
          <div className="text-sm">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Show skeleton on initial load
  if (initialLoading && logs.length === 0) {
    return <LogListSkeleton count={5} />
  }

  // Show empty state
  if (!loading && !initialLoading && logs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-12 text-center text-gray-500">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
          <p>Try adjusting your filters or check if the backend is running.</p>
        </div>
      </div>
    )
  }

  const hasMore = pagination.hasNextPage || false
  const totalLogs = pagination.totalCount || logs.length

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">📋 Log Entries</h2>
          <div className="text-sm text-gray-600">
            {totalLogs > 0 && (
              <div className="flex items-center gap-4">
                <span>
                  Showing {logs.length} of {totalLogs} logs
                </span>
                {pagination.totalPages > 1 && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Log Entries */}
      <div className="max-h-screen overflow-y-auto">
        {logs.map((log, index) => (
          <LogEntry key={`${log.traceId}-${log.spanId}-${log.timestamp}-${index}`} log={log} index={index} />
        ))}

        {/* Infinite Scroll Trigger */}
        <InfiniteScrollTrigger onLoadMore={onLoadMore} hasMore={hasMore} loading={loading} />
      </div>

      {/* Footer with stats */}
      {logs.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center text-sm text-gray-600">
          {hasMore ? (
            <span>Scroll down to load more logs automatically</span>
          ) : (
            <span>All logs loaded • Total: {totalLogs}</span>
          )}
        </div>
      )}
    </div>
  )
}

export default LogList;
