import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
} from '@mui/material';
import cx from 'classnames';
import useRCloneInfo from 'hooks/useRCloneInfo';
import { useState } from 'react';
import { useHistory } from 'react-router';
import RCloneClient from 'utils/RCloneClient';
import './LoginPage.scss';

/**
 * The login page
 */
const LoginPage = () => {
  const { setRCloneInfo } = useRCloneInfo();
  const history = useHistory();

  const [endpoint, setEndpoint] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const [error, setError] = useState(null);

  const handleTextEntered = (setFn) => (event) => {
    setFn(event.target.value);
  };

  const handleLogin = async () => {
    try {
      // To test if connection is correct, call RClone to fetch remotes
      await new RCloneClient(endpoint, username, password).fetchRemotes();

      setRCloneInfo({ endpoint, username, password });
      history.push('/files');
    } catch (error) {
      setError(error);
    }
  };

  const cardSubHeader = (
    <span className={cx({ 'login-page__card-subheader--red': error })}>
      {error ? error?.message : 'Enter your RClone info to get started'}
    </span>
  );

  const hasError = error === null;

  return (
    <div className="login-page">
      <Card variant="outlined" className="login-page__card">
        <CardHeader title="Login" subheader={cardSubHeader} />
        <CardContent className="login-page__card-contents">
          <TextField
            required
            label="RClone RC Endpoint"
            variant="outlined"
            placeholder="Ex: http://localhost:5572"
            className="login-page__text-field"
            onChange={handleTextEntered(setEndpoint)}
            error={hasError}
            inputProps={{ 'data-testid': 'endpoint-field' }}
          />
          <TextField
            required
            label="Username"
            variant="outlined"
            className="login-page__text-field"
            onChange={handleTextEntered(setUsername)}
            error={hasError}
            inputProps={{ 'data-testid': 'username-field' }}
          />
          <TextField
            required
            label="Password"
            variant="outlined"
            type="password"
            className="login-page__text-field"
            onChange={handleTextEntered(setPassword)}
            error={hasError}
            inputProps={{ 'data-testid': 'password-field' }}
          />
        </CardContent>
        <CardActions>
          <Button variant="contained" onClick={handleLogin} data-testid="login-button">
            Login
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default LoginPage;
