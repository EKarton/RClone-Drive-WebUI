import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import cx from 'classnames';
import { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import DarkModeToggleSwitch from 'components/DarkModeToggleSwitch';
import useRCloneInfo from 'hooks/rclone/useRCloneInfo';
import RCloneClient from 'utils/RCloneClient';
import './LoginPage.scss';

/**
 * The login page
 */
const LoginPage = () => {
  const { search } = useLocation();
  const history = useHistory();
  const { setRCloneInfo } = useRCloneInfo();
  const [error, setError] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formProps = Object.fromEntries(new FormData(e.target));
    const { endpoint, username, password } = formProps;

    const searchParams = new URLSearchParams(search);
    const redirectPath = searchParams.get('redirect_path') || '/files';

    try {
      // To test if connection is correct, call RClone to fetch remotes
      await new RCloneClient(endpoint, username, password).fetchRemotes();

      setRCloneInfo({ endpoint, username, password });
      history.push(redirectPath);
    } catch (error) {
      setError(error);
    }
  };

  const hasError = error !== null;

  const cardSubHeader = (
    <span className={cx({ 'login-page__card-subheader--red': error })}>
      {hasError ? error?.message : 'Enter your RClone info to get started'}
    </span>
  );

  return (
    <Box
      className="login-page"
      sx={{ bgcolor: 'background.default', color: 'text.primary' }}
    >
      <div className="login-page__header">
        <DarkModeToggleSwitch />
      </div>
      <Card variant="outlined" className="login-page__card">
        <form onSubmit={handleFormSubmit}>
          <CardHeader title="Login" subheader={cardSubHeader} />
          <CardContent className="login-page__card-contents">
            <TextField
              required
              name="endpoint"
              label="RClone RC Endpoint"
              variant="outlined"
              placeholder="Ex: http://localhost:5572"
              className="login-page__text-field"
              error={hasError}
              inputProps={{ 'data-testid': 'endpoint-field' }}
            />
            <TextField
              required
              name="username"
              label="Username"
              variant="outlined"
              className="login-page__text-field"
              error={hasError}
              inputProps={{ 'data-testid': 'username-field' }}
            />
            <TextField
              required
              name="password"
              label="Password"
              variant="outlined"
              type="password"
              className="login-page__text-field"
              error={hasError}
              inputProps={{ 'data-testid': 'password-field' }}
            />
          </CardContent>
          <CardActions>
            <Button variant="contained" data-testid="login-button" type="submit">
              Login
            </Button>
          </CardActions>
        </form>
      </Card>
    </Box>
  );
};

export default LoginPage;
