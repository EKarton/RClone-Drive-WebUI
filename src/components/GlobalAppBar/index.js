import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AppLogo from 'components/AppLogo';
import DarkModeToggleSwitch from 'components/DarkModeToggleSwitch';
import './index.scss';

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

GlobalAppBar.propTypes = {
  onDrawerButttonClicked: PropTypes.func,
};
