// Dynamic API base URL - detects environment
const API_BASE_URL = (() => {
    // In production, use the same domain as the frontend
    if (import.meta.env.PROD) {
        return window.location.origin;
    }
    // In development, use localhost
    return "http://localhost:4000";
})();

export const logsApi = {
    // Test backend connection
    testConnection: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/ping`, {
                method: "GET",
                mode: "cors",
            })
            if (response.ok) {
                const data = await response.json()
                console.log("Backend connection successful:", data)
                return { success: true, data }
            } else {
                console.error("Backend connection failed:", response.status)
                return { success: false, error: `HTTP ${response.status}` }
            }
        } catch (err) {
            console.error("Backend connection test failed:", err)
            return { success: false, error: err.message }
        }
    },

    // Fetch logs with filters and pagination
    fetchLogs: async (filters = {}, page = 1, limit = 10) => {
        try {
            const queryParams = new URLSearchParams()

            // Add non-empty filters to query params
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value.toString().trim()) {
                    if (key === "timestampStart") {
                        queryParams.append("timestamp_start", value)
                    } else if (key === "timestampEnd") {
                        queryParams.append("timestamp_end", value)
                    } else {
                        queryParams.append(key, value)
                    }
                }
            })

            // Add pagination parameters
            queryParams.append("page", page.toString())
            queryParams.append("limit", limit.toString())

            const apiUrl = `${API_BASE_URL}/logs?${queryParams}`
            console.log("Fetching from:", apiUrl)

            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                mode: "cors",
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`HTTP ${response.status}: ${errorText}`)
            }

            const data = await response.json()
            console.log("API Response:", data)

            return {
                success: true,
                logs: data.logs || data || [],
                pagination: data.pagination || {},
            }
        } catch (err) {
            console.error("Fetch error details:", err)
            return {
                success: false,
                error: `Failed to fetch logs: ${err.message}. Make sure the backend server is running on ${API_BASE_URL}`,
            }
        }
    },

    // Create a new log entry
    createLog: async (logData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/logs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                mode: "cors",
                body: JSON.stringify(logData),
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`HTTP ${response.status}: ${errorText}`)
            }

            const data = await response.json()
            return { success: true, data }
        } catch (err) {
            console.error("Create log error:", err)
            return { success: false, error: err.message }
        }
    },
}
