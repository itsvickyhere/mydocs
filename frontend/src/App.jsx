import { useState, useEffect, useCallback } from 'react'
import { Box, Container } from '@mui/material'
import { useSnackbar } from 'notistack'

import Header from './components/Header'
import UploadZone from './components/UploadZone'
import DocumentTable from './components/DocumentTable'
import NotificationPanel from './components/NotificationPanel'
import useSSE from './hooks/useSSE'
import { getDocuments, getNotifications, SSE_URL } from './api'

export default function App() {
  const [documents, setDocuments] = useState([])
  const [notifOpen, setNotifOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const { enqueueSnackbar } = useSnackbar()

  const loadDocuments = useCallback(async () => {
    try {
      const { data } = await getDocuments()
      setDocuments(data)
    } catch {
      enqueueSnackbar('Failed to load documents', { variant: 'error' })
    }
  }, [enqueueSnackbar])

  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  useEffect(() => {
    getNotifications()
      .then(({ data }) => setUnreadCount(data.filter((n) => !n.read).length))
      .catch(() => {})
  }, [])

  useSSE(SSE_URL, (eventName, data) => {
    if (eventName === 'bulk_complete') {
      loadDocuments()
      setUnreadCount((c) => c + 1)
      enqueueSnackbar(data, { variant: 'success' })
    }
    if (eventName === 'delete') {
      loadDocuments()
    }
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header
        unreadCount={unreadCount}
        onNotifClick={() => {
          setNotifOpen(true)
          setUnreadCount(0)
        }}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <UploadZone onUploadSuccess={loadDocuments} />
        <DocumentTable documents={documents} onDelete={loadDocuments} />
      </Container>
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </Box>
  )
}
