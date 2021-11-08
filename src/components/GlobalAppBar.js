import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import './GlobalAppBar.scss';
import { Link } from 'react-router-dom';

export default function GlobalAppBar({ onDrawerButttonClicked }) {
  return (
    <AppBar color="transparent" className="global-app-bar">
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
        <div className="global-app-bar__logo" />
        <div>
          <IconButton aria-label="settings">
            <SettingsIcon />
          </IconButton>
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
