import { AppBar, Toolbar, Typography, IconButton } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'

export default function Header({ onNotifClick }) {
  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          MyDocs
        </Typography>
        <IconButton color="inherit" onClick={onNotifClick} aria-label="notifications">
          <NotificationsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
