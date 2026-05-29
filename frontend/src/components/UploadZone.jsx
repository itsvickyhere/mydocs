import { useState, useRef } from 'react'
import {
  Box, Typography, LinearProgress, Paper, Chip, Collapse, IconButton, Stack,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { useSnackbar } from 'notistack'
import { uploadFiles } from '../api'

function formatBytes(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const STATUS_COLOR = {
  pending: 'default',
  uploading: 'primary',
  complete: 'success',
  failed: 'error',
}

function distributeProgress(fileCount, overallPercent) {
  const slice = 100 / fileCount
  return Array.from({ length: fileCount }, (_, i) => {
    const start = i * slice
    const end = (i + 1) * slice
    if (overallPercent >= end) return 100
    if (overallPercent <= start) return 0
    return Math.round(((overallPercent - start) / slice) * 100)
  })
}

export default function UploadZone({ onUploadSuccess }) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [fileStates, setFileStates] = useState([])
  const [bulkExpanded, setBulkExpanded] = useState(true)
  const inputRef = useRef()
  const { enqueueSnackbar } = useSnackbar()

  const updateFile = (index, patch) => {
    setFileStates((prev) =>
      prev.map((f, i) => (i === index ? { ...f, ...patch } : f))
    )
  }

  const uploadOne = async (file, index) => {
    updateFile(index, { status: 'uploading', progress: 0 })
    const form = new FormData()
    form.append('files', file)
    try {
      await uploadFiles(form, (percent) => updateFile(index, { progress: percent }))
      updateFile(index, { status: 'complete', progress: 100 })
    } catch {
      updateFile(index, { status: 'failed', progress: 0 })
      throw new Error('upload failed')
    }
  }

  const uploadBulk = async (fileArray) => {
    const form = new FormData()
    fileArray.forEach((f) => form.append('files', f))
    setFileStates((prev) =>
      prev.map((f) => ({ ...f, status: 'uploading', progress: 0 }))
    )
    await uploadFiles(form, (overallPercent) => {
      const perFile = distributeProgress(fileArray.length, overallPercent)
      setFileStates((prev) =>
        prev.map((f, i) => ({
          ...f,
          progress: perFile[i],
          status: perFile[i] === 100 ? 'complete' : 'uploading',
        }))
      )
    })
    setFileStates((prev) =>
      prev.map((f) => ({ ...f, status: 'complete', progress: 100 }))
    )
  }

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    const nonPdf = fileArray.find((f) => f.type !== 'application/pdf')
    if (nonPdf) {
      enqueueSnackbar('Only PDF files are allowed', { variant: 'error' })
      return
    }

    const isBulk = fileArray.length > 3
    if (isBulk) {
      enqueueSnackbar(
        `Upload in progress — processing ${fileArray.length} files in background.`,
        { variant: 'info', persist: true }
      )
    }

    setFileStates(
      fileArray.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
        status: 'pending',
        progress: 0,
      }))
    )
    setUploading(true)
    setBulkExpanded(true)

    try {
      if (isBulk) {
        await uploadBulk(fileArray)
      } else {
        for (let i = 0; i < fileArray.length; i++) {
          await uploadOne(fileArray[i], i)
        }
        enqueueSnackbar(
          fileArray.length === 1
            ? `${fileArray[0].name} uploaded!`
            : `${fileArray.length} files uploaded!`,
          { variant: 'success' }
        )
      }
      onUploadSuccess()
    } catch {
      enqueueSnackbar('Upload failed. Try again.', { variant: 'error' })
    } finally {
      setUploading(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const isBulk = fileStates.length > 3

  return (
    <Paper
      variant="outlined"
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => !uploading && inputRef.current.click()}
      sx={{
        p: 5,
        mb: 3,
        textAlign: 'center',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: dragging ? 'primary.main' : 'grey.400',
        bgcolor: dragging ? 'primary.50' : 'background.paper',
        cursor: uploading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      <CloudUploadIcon sx={{ fontSize: 52, color: 'primary.main', mb: 1 }} />
      <Typography variant="h6" gutterBottom>
        Drag & drop PDFs here
      </Typography>
      <Typography variant="body2" color="text.secondary">
        or click to browse — multiple files supported
      </Typography>

      {fileStates.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'left' }} onClick={(e) => e.stopPropagation()}>
          {isBulk && (
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="subtitle2" color="primary">
                Uploading {fileStates.length} files…
              </Typography>
              <IconButton size="small" onClick={() => setBulkExpanded((v) => !v)}>
                {bulkExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Stack>
          )}
          <Collapse in={!isBulk || bulkExpanded}>
            <Stack spacing={1.5}>
              {fileStates.map((f) => (
                <Box
                  key={f.name}
                  sx={{ p: 1.5, borderRadius: 1, bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider' }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: '60%' }}>
                      {f.name}
                    </Typography>
                    <Chip label={f.status} size="small" color={STATUS_COLOR[f.status]} />
                  </Stack>
                  <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                    {formatBytes(f.size)} · {f.type || 'application/pdf'}
                  </Typography>
                  {(f.status === 'uploading' || f.status === 'complete') && (
                    <>
                      <LinearProgress
                        variant="determinate"
                        value={f.progress}
                        sx={{ borderRadius: 1, height: 6 }}
                        color={f.status === 'failed' ? 'error' : 'primary'}
                      />
                      <Typography variant="caption">{f.progress}%</Typography>
                    </>
                  )}
                </Box>
              ))}
            </Stack>
          </Collapse>
        </Box>
      )}
    </Paper>
  )
}
