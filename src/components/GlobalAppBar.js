import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import RCloneLogo from "assets/images/rclone-icon/logo_on_light__horizontal_color_256px.png";
import "./GlobalAppBar.scss";

const GlobalAppBar = ({ onDrawerButttonClicked }) => {
  return (
    <AppBar color="transparent" className="global-app-bar">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerButttonClicked}
          className="global-app-bar__nav-button"
        >
          <MenuIcon />
        </IconButton>
        <img className="global-app-bar__logo" src={RCloneLogo} alt="RClone" />
      </Toolbar>
    </AppBar>
  );
};

export default GlobalAppBar;
