"use client"

import { useState, useEffect, useCallback } from "react"
import { logsApi } from "../../api/logs"
import { useDebounce } from "../../hooks/useDebounce"
import Header from "../top-header/Header"
import FilterBar from "../filterbar/FilterBar"
import LogList from "../loglist/LogList"
import LinearLoader from "../linearloader/LinearLoader"

const LogViewer = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter states
  const [filters, setFilters] = useState({
    message: "",
    level: "",
    resourceId: "",
    timestampStart: "",
    timestampEnd: "",
    traceId: "",
    spanId: "",
    commit: "",
  })

  // Debounced filters for API calls (500ms delay)
  const debouncedFilters = useDebounce(filters, 500)

  // Pagination state
  const [pagination, setPagination] = useState({})
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch logs from backend
  const fetchLogs = useCallback(
    async (page = 1, isLoadMore = false) => {
      if (page === 1) {
        setInitialLoading(true)
      } else {
        setLoading(true)
      }
      setError(null)

      const result = await logsApi.fetchLogs(debouncedFilters, page, 10) // Smaller page size for better UX

      if (result.success) {
        if (page === 1) {
          // Reset logs for new search/filter
          setLogs(result.logs.data)
        } else {
          // Append logs for pagination
          setLogs((prevLogs) => [...prevLogs, ...result.logs.data])
        }
        setPagination(result.pagination)
      } else {
        setError(result.error)
        // If it's a network error, try to show some helpful mock data
        if (page === 1 && result.error.includes("Failed to fetch")) {
          setLogs([
            {
              level: "info",
              message: "Backend connection failed. This is sample data for UI testing.",
              resourceId: "demo-server",
              timestamp: new Date().toISOString(),
              traceId: "demo-trace-123",
              spanId: "demo-span-456",
              commit: "abc123",
              metadata: { note: "This is mock data" },
            },
          ])
          setPagination({ hasNextPage: false, totalLogs: 1, currentPage: 1, totalPages: 1 })
        }
      }

      setLoading(false)
      setInitialLoading(false)
    },
    [debouncedFilters],
  )

  // Load more logs for infinite scroll
  const loadMoreLogs = useCallback(async () => {
    if (pagination.hasNextPage && !loading && !initialLoading) {
      const nextPage = currentPage + 1
      setLoading(true) // Set loading immediately to prevent multiple calls
      await fetchLogs(nextPage, true)
      setCurrentPage(nextPage)
    }
  }, [pagination.hasNextPage, loading, initialLoading, currentPage, fetchLogs])

  // Fetch logs on component mount and when filters change
  useEffect(() => {
    // Test connection first
    logsApi.testConnection()
    setCurrentPage(1)
    fetchLogs(1)
  }, [fetchLogs])

  // Handle filter changes
  const handleFilterChange = useCallback((filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }))
    setCurrentPage(1) // Reset to first page when filters change
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      message: "",
      level: "",
      resourceId: "",
      timestampStart: "",
      timestampEnd: "",
      traceId: "",
      spanId: "",
      commit: "",
    })
    setCurrentPage(1)
  }, [])

  // Refresh logs (immediate, bypasses debouncing)
  const refreshLogs = useCallback(async () => {
    setCurrentPage(1)
    setInitialLoading(true)
    setError(null)

    const result = await logsApi.fetchLogs(filters, 1, 10)

    if (result.success) {
      setLogs(result.logs)
      setPagination(result.pagination)
    } else {
      setError(result.error)
    }

    setInitialLoading(false)
  }, [filters])

  return (
    <>
      <LinearLoader isLoading={loading || initialLoading} />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4/5 mx-auto p-5">
          <Header />
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            onRefresh={refreshLogs}
            loading={loading || initialLoading}
          />
          <LogList
            logs={logs}
            loading={loading}
            initialLoading={initialLoading}
            error={error}
            pagination={pagination}
            onLoadMore={loadMoreLogs}
          />
        </div>
      </div>
    </>
  )
}

export default LogViewer;
