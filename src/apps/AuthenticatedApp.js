import { Box } from "@mui/system";
import GlobalNavBar from "components/GlobalNavBar";
import FilesPage from "pages/FilesPage";
import { Route, Switch } from "react-router";
import "./AuthenticatedApp.scss";

export const AuthenticatedPaths = ["/files", "/pictures"];

const AuthenticatedApp = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <GlobalNavBar />
      <Box component="main" className="main">
        <Switch>
          <Route path="/files">
            <FilesPage />
          </Route>
          <Route path="/pictures">
            <FilesPage />
          </Route>
        </Switch>
      </Box>
    </Box>
  );
};

export default AuthenticatedApp;
