import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { Box } from "@mui/system";
import FolderIcon from "@mui/icons-material/Folder";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import { useState } from "react";
import "./GlobalNavBar.scss";
import { useHistory, useLocation } from "react-router";

const NavigationOptions = Object.freeze([
  {
    key: "files",
    text: "Files",
    icon: <FolderIcon />,
    redirectUrl: "/files",
  },
  {
    key: "pictures",
    text: "Pictures",
    icon: <PermMediaIcon />,
    redirectUrl: "/pictures",
  },
]);

/**
 * This component represents the global nav bar in all pages
 */
const GlobalNavBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const history = useHistory();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleListItemClick = (redirectUrl) => () => {
    history.push(redirectUrl);
  };

  const drawer = (
    <div>
      <Toolbar classes={{ root: "toolbar" }} />
      <List>
        {NavigationOptions.map(({ key, text, icon, redirectUrl }) => (
          <ListItemButton
            button
            key={key}
            selected={location.pathname.includes(redirectUrl)}
            onClick={handleListItemClick(redirectUrl)}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  return (
    <Box component="nav" aria-label="mailbox folders" className="nav">
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        className="temporary-nav"
      >
        {drawer}
      </Drawer>
      <Drawer variant="permanent" className="permanent-nav" open>
        {drawer}
      </Drawer>
    </Box>
  );
};

export default GlobalNavBar;
