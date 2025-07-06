"use client"

import { useState } from "react"

const LOG_LEVELS = ["error", "warn", "info", "debug"]

const FilterBar = ({ filters, onFilterChange, onClearFilters, onRefresh, loading }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (filterName, value) => {
    onFilterChange(filterName, value)
  }

  // Get active filters count
  const getActiveFiltersCount = () => {
    return Object.values(filters).filter((value) => value && value.toString().trim() !== "").length
  }

  const activeFiltersCount = getActiveFiltersCount()

  // Get active filters for display
  const getActiveFilters = () => {
    const activeFilters = []
    const filterLabels = {
      message: "Message",
      level: "Level",
      resourceId: "Resource ID",
      timestampStart: "Start Time",
      timestampEnd: "End Time",
      traceId: "Trace ID",
      spanId: "Span ID",
      commit: "Commit",
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.toString().trim() !== "") {
        activeFilters.push({
          key,
          label: filterLabels[key],
          value: value.toString().trim(),
          displayValue: key === "level" ? value.toUpperCase() : value.toString().trim(),
        })
      }
    })

    return activeFilters
  }

  const activeFilters = getActiveFilters()

  const handleRemoveFilter = (filterKey) => {
    onFilterChange(filterKey, "")
  }

  return (
    <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 mb-6 overflow-hidden">
      {/* Compact Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-white font-semibold text-lg flex items-center gap-2">
              🔍 Filters
              {activeFiltersCount > 0 && (
                <span className="bg-white/20 text-white px-2 py-1 rounded-full text-sm font-medium">
                  {activeFiltersCount}
                </span>
              )}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
              type="button"
              disabled={loading}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {loading ? "Loading..." : "Refresh"}
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 flex items-center gap-2"
              type="button"
            >
              {isExpanded ? "Less" : "More"}
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Filters Row */}
      <div className="px-6 py-4 bg-white border-b border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages..."
              value={filters.message}
              onChange={(e) => handleFilterChange("message", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3 top-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <select
            value={filters.level}
            onChange={(e) => handleFilterChange("level", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">All Levels</option>
            {LOG_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level.toUpperCase()}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Resource ID..."
            value={filters.resourceId}
            onChange={(e) => handleFilterChange("resourceId", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />

          <div className="flex gap-2">
            {activeFiltersCount > 0 && (
              <button
                onClick={onClearFilters}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all duration-200 flex items-center gap-2"
                type="button"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filters (Collapsible) */}
      <div
        className={`transition-all duration-300 ease-in-out ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
      >
        <div className="px-6 py-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">⚙️ Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="datetime-local"
                value={filters.timestampStart}
                onChange={(e) => handleFilterChange("timestampStart", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="datetime-local"
                value={filters.timestampEnd}
                onChange={(e) => handleFilterChange("timestampEnd", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trace ID</label>
              <input
                type="text"
                placeholder="e.g., abc-xyz-123"
                value={filters.traceId}
                onChange={(e) => handleFilterChange("traceId", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Span ID</label>
              <input
                type="text"
                placeholder="e.g., span-456"
                value={filters.spanId}
                onChange={(e) => handleFilterChange("spanId", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commit Hash</label>
              <input
                type="text"
                placeholder="e.g., 5e5342f"
                value={filters.commit}
                onChange={(e) => handleFilterChange("commit", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-blue-800 mr-2">Active:</span>
            {activeFilters.map((filter) => (
              <div
                key={filter.key}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-sm shadow-sm hover:bg-blue-700 transition-colors"
              >
                <span className="font-medium">{filter.label}:</span>
                <span className="truncate max-w-24" title={filter.displayValue}>
                  {filter.displayValue.length > 15 ? `${filter.displayValue.substring(0, 15)}...` : filter.displayValue}
                </span>
                <button
                  onClick={() => handleRemoveFilter(filter.key)}
                  className="ml-1 text-white hover:text-blue-200 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  type="button"
                  title={`Remove ${filter.label} filter`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterBar
