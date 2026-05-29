import { useEffect } from 'react'

/**
 * useSSE — subscribes to GET /api/sse/subscribe
 * Calls onEvent(eventName, data) whenever the server pushes an event.
 *
 * Usage:
 *   useSSE((name, data) => {
 *     if (name === 'upload') refetchDocuments()
 *   })
 */
export default function useSSE(onEvent) {
  useEffect(() => {
    const es = new EventSource('/api/sse/subscribe')

    // Handle named events from SseService.sendEvent()
    const handleUpload = (e) => onEvent('upload', e.data)
    const handleDelete = (e) => onEvent('delete', e.data)
    const handleProgress = (e) => onEvent('progress', e.data)

    es.addEventListener('upload', handleUpload)
    es.addEventListener('delete', handleDelete)
    es.addEventListener('progress', handleProgress)

    es.onerror = (err) => {
      console.error('SSE connection error:', err)
      // EventSource auto-reconnects — no manual retry needed
    }

    // Cleanup on unmount
    return () => {
      es.removeEventListener('upload', handleUpload)
      es.removeEventListener('delete', handleDelete)
      es.removeEventListener('progress', handleProgress)
      es.close()
    }
  }, []) // run once on mount
}
