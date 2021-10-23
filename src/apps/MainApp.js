import { Switch, Route } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";

const MainApp = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <LandingPage />
      </Route>
      <Route path="/login">
        <LoginPage />
      </Route>
      <Route path="/dashboard">
        <DashboardPage />
      </Route>
    </Switch>
  );
};

export default MainApp;
