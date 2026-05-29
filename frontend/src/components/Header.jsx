import { AppBar, Toolbar, Typography, IconButton, Badge } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'

export default function Header({ unreadCount, onNotifClick }) {
  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
          MyDocs
        </Typography>
        <IconButton color="inherit" onClick={onNotifClick} aria-label="notifications">
          <Badge badgeContent={unreadCount || null} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
