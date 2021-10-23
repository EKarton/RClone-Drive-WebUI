import { Switch, Route } from "react-router-dom";
import LandingPage from "pages/LandingPage";
import LoginPage from "pages/LoginPage";
import AuthenticatedApp, { AuthenticatedPaths } from "./AuthenticatedApp";

const MainApp = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <LandingPage />
      </Route>
      <Route path="/login">
        <LoginPage />
      </Route>
      <Route paths={AuthenticatedPaths}>
        <AuthenticatedApp />
      </Route>
    </Switch>
  );
};

export default MainApp;
