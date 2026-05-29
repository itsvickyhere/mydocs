import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import DeleteIcon from '@mui/icons-material/Delete'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import { useSnackbar } from 'notistack'
import { deleteDocument, downloadUrl } from '../api'

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
      enqueueSnackbar(`Deleted ${doc.originalName}`, { variant: 'info' })
      onDelete()
    } catch {
      enqueueSnackbar('Delete failed', { variant: 'error' })
    }
  }

  if (documents.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
        No documents yet — upload a PDF above!
      </Typography>
    )
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell>File</TableCell>
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
                  fontSize="small"
                  sx={{ verticalAlign: 'middle', mr: 1, color: 'primary.main' }}
                />
                {doc.originalName}
              </TableCell>
              <TableCell>{formatBytes(doc.size)}</TableCell>
              <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
              <TableCell>
                <Chip label={doc.status} color="success" size="small" />
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Download">
                  <IconButton
                    size="small"
                    color="primary"
                    href={downloadUrl(doc.id)}
                    target="_blank"
                    aria-label="download"
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(doc)}
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
