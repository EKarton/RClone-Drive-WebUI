import GlobalAppBar from "components/GlobalAppBar";
import GlobalNavBar from "components/GlobalNavBar";
import FilesPage from "pages/FilesPage";
import { useState } from "react";
import { Route, Switch } from "react-router";
import "./AuthenticatedApp.scss";

export const AuthenticatedPaths = ["/files", "/pictures"];

const AuthenticatedApp = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDrawerButtonClicked = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="app-shell">
      <GlobalAppBar onDrawerButttonClicked={handleDrawerButtonClicked} />
      <div className="app-shell__below-appbar">
        <GlobalNavBar isExpanded={isExpanded} />
        <div className="app-shell__contents">
          <Switch>
            <Route path="/files/:id">
              <FilesPage />
            </Route>
            <Route path="/pictures/:id">
              <FilesPage />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedApp;
