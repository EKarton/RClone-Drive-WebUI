import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import useColorMode from 'hooks/utils/useColorMode';
import { COLOR_MODE } from 'utils/constants';
import DarkModeToggleButton from './DarkModeToggleButton';
import './GlobalAppBar.scss';

export default function GlobalAppBar({ onDrawerButttonClicked }) {
  const colorMode = useColorMode();

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
        <div
          className={cx('global-app-bar__logo', {
            'global-app-bar__logo--dark': colorMode.mode === COLOR_MODE.DARK,
          })}
        />
        <div>
          <DarkModeToggleButton />
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
