"use client"

import { useState, useEffect, useCallback } from "react"

export const useInfiniteScroll = (callback, hasMore, loading) => {
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!isFetching) return
    fetchMoreData()
  }, [isFetching])

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
      isFetching ||
      loading ||
      !hasMore
    )
      return
    setIsFetching(true)
  }

  const fetchMoreData = useCallback(async () => {
    await callback()
    setIsFetching(false)
  }, [callback])

  return [isFetching, setIsFetching]
}
