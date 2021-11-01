import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FolderIcon from '@mui/icons-material/Folder';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import './GlobalNavBar.scss';
import cx from 'classnames';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

const NavigationOptions = Object.freeze([
  {
    key: 'files',
    text: 'Files',
    icon: <FolderIcon />,
    redirectUrl: '/files',
  },
  {
    key: 'pictures',
    text: 'Pictures',
    icon: <PermMediaIcon />,
    redirectUrl: '/pictures',
  },
]);

/**
 * This component represents the global nav bar in all pages
 */
export default function GlobalNavBar({ isExpanded }) {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      classes={{
        root: cx('global-navbar', {
          'global-navbar--expanded': isExpanded,
        }),
        paper: 'global-navbar__paper',
      }}
    >
      <List>
        {NavigationOptions.map(({ key, text, icon, redirectUrl }) => (
          <Link className="global-navbar__link" to={redirectUrl}>
            <ListItem button key={key} selected={location.pathname.includes(redirectUrl)}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText className="global-navbar__listitem-text" primary={text} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Drawer>
  );
}
