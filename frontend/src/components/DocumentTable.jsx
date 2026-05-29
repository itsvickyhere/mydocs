import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton,
  Typography, Chip
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import { useSnackbar } from 'notistack'
import { deleteDocument } from '../api'

function formatBytes(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString()
}

export default function DocumentTable({ documents, onDelete }) {
  const { enqueueSnackbar } = useSnackbar()

  const handleDelete = async (doc) => {
    try {
      await deleteDocument(doc.id)
      enqueueSnackbar(`Deleted ${doc.fileName}`, { variant: 'info' })
      onDelete()
    } catch {
      enqueueSnackbar('Delete failed', { variant: 'error' })
    }
  }

  if (documents.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
        No documents yet. Upload one above!
      </Typography>
    )
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell>File</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Uploaded</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id} hover>
              <TableCell>
                <InsertDriveFileIcon
                  sx={{ verticalAlign: 'middle', mr: 1, color: 'primary.main' }}
                />
                {doc.fileName}
              </TableCell>
              <TableCell>{doc.fileType || '—'}</TableCell>
              <TableCell>{formatBytes(doc.fileSize)}</TableCell>
              <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
              <TableCell>
                <Chip
                  label={doc.status}
                  color={doc.status === 'UPLOADED' ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell align="center">
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleDelete(doc)}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
