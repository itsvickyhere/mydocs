import { useEffect } from 'react'

export default function useSSE(url, onEvent) {
  useEffect(() => {
    const es = new EventSource(url)

    // Named events from SseService.sendEvent()
    es.addEventListener('upload', (e) => onEvent('upload', e.data))
    es.addEventListener('delete', (e) => onEvent('delete', e.data))
    es.addEventListener('bulk_complete', (e) => onEvent('bulk_complete', e.data))

    // Fallback for broadcast() which sends unnamed events
    es.onmessage = (e) => onEvent('message', e.data)

    es.onerror = () => {} // auto-reconnects

    return () => es.close()
  }, [url])
}
