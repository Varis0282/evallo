"use client"

import { useEffect, useRef } from "react"
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver"
import LoadingSpinner from "../logspinner/LoadingSpinner"

const InfiniteScrollTrigger = ({ onLoadMore, hasMore, loading }) => {
    const [triggerRef, isIntersecting] = useIntersectionObserver({
        threshold: 0.1,
        rootMargin: "100px",
    })
    
    const loadingRef = useRef(false)

    useEffect(() => {
        if (isIntersecting && hasMore && !loading && !loadingRef.current) {
            loadingRef.current = true
            // Add a small delay to prevent rapid consecutive calls
            const timer = setTimeout(() => {
                onLoadMore()
            }, 100)
            
            return () => clearTimeout(timer)
        }
        
        // Reset the loading ref when loading state changes
        if (!loading) {
            loadingRef.current = false
        }
    }, [isIntersecting, hasMore, loading, onLoadMore])

    if (!hasMore) {
        return (
            <div className="py-8 text-center text-gray-500">
                <p>🎉 You've reached the end! No more logs to load.</p>
            </div>
        )
    }

    return (
        <div ref={triggerRef} className="py-4">
            {loading && <LoadingSpinner size="md" text="Loading more logs..." />}
        </div>
    )
}

export default InfiniteScrollTrigger;
