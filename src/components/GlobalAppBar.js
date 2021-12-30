import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { Link } from 'react-router-dom';
import AppLogo from './AppLogo';
import DarkModeToggleSwitch from './DarkModeToggleSwitch';
import './GlobalAppBar.scss';

export default function GlobalAppBar({ onDrawerButttonClicked }) {
  return (
    <AppBar
      className="global-app-bar"
      sx={{ bgcolor: 'background.default', color: 'text.primary' }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerButttonClicked}
          className="global-app-bar__nav-button"
          data-testid="nav-button"
        >
          <MenuIcon />
        </IconButton>
        <AppLogo />
        <div>
          <DarkModeToggleSwitch />
          <Link to="/logout">
            <IconButton>
              <LogoutIcon />
            </IconButton>
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
}
