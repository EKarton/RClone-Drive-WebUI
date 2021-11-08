import { Switch, Route } from 'react-router-dom';
import LandingPage from 'pages/LandingPage';
import LoginPage from 'pages/LoginPage';
import AuthenticatedApp from './AuthenticatedApp';
import LogoutPage from 'pages/LogoutPage';
import { AuthenticatedPaths } from 'utils/constants';

export default function MainApp() {
  return (
    <Switch>
      <Route path="/" exact>
        <LandingPage />
      </Route>
      <Route path="/login">
        <LoginPage />
      </Route>
      <Route path="/logout">
        <LogoutPage />
      </Route>
      <Route paths={AuthenticatedPaths}>
        <AuthenticatedApp />
      </Route>
    </Switch>
  );
}
