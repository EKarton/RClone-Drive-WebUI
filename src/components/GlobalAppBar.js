import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import "./GlobalAppBar.scss";
import { Breadcrumbs, Link } from "@mui/material";

const GlobalAppBar = () => {
  const handleDrawerToggle = () => {};

  return (
    <>
      <CssBaseline />
      <AppBar position="fixed" classes={{ root: "app-bar" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            classes={{ root: "nav-button" }}
          >
            <MenuIcon />
          </IconButton>
          <Breadcrumbs maxItems={30} aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="#">
              Home
            </Link>
            <Link underline="hover" color="inherit" href="#">
              Catalog
            </Link>
            <Link underline="hover" color="inherit" href="#">
              Accessories
            </Link>
            <Link underline="hover" color="inherit" href="#">
              New Collection
            </Link>
            <Typography color="text.primary">Belts</Typography>
          </Breadcrumbs>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default GlobalAppBar;
