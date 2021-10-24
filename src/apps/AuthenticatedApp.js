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
          <Route path="/files/:id">
            <FilesPage />
          </Route>
          <Route path="/pictures/:id">
            <FilesPage />
          </Route>
        </Switch>
      </Box>
    </Box>
  );
};

export default AuthenticatedApp;
