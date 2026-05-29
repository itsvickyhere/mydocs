import { useState, useEffect, useCallback } from 'react'
import { Box, Container } from '@mui/material'
import { useSnackbar } from 'notistack'

import Header from './components/Header'
import UploadZone from './components/UploadZone'
import DocumentTable from './components/DocumentTable'
import NotificationPanel from './components/NotificationPanel'
import useSSE from './hooks/useSSE'
import { fetchDocuments } from './api'

export default function App() {
  const [documents, setDocuments] = useState([])
  const [notifOpen, setNotifOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  // Load documents on mount
  const loadDocuments = useCallback(async () => {
    try {
      const data = await fetchDocuments()
      setDocuments(data)
    } catch (err) {
      enqueueSnackbar('Failed to load documents', { variant: 'error' })
    }
  }, [enqueueSnackbar])

  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  // SSE — server pushes events when anything changes
  useSSE((eventName, data) => {
    if (eventName === 'upload') {
      enqueueSnackbar(data, { variant: 'success' })
      loadDocuments() // refresh table
    }
    if (eventName === 'delete') {
      enqueueSnackbar(data, { variant: 'info' })
      loadDocuments()
    }
  })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header onNotifClick={() => setNotifOpen(true)} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <UploadZone onUploadSuccess={loadDocuments} />
        <DocumentTable documents={documents} onDelete={loadDocuments} />
      </Container>

      <NotificationPanel
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
      />
    </Box>
  )
}
