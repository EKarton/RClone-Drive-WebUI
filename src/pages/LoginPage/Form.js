import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import cx from 'classnames';
import { useLoginHelpDialog } from 'contexts/LoginHelpDialog';
import './Form.scss';

export default function Form({ error, onFormSubmit }) {
  const { openDialog } = useLoginHelpDialog();
  const hasError = error !== null;

  const cardSubHeader = (
    <span className={cx({ 'login-page-form__header--red': error })}>
      {hasError ? error?.message : 'Enter your RClone info to get started'}
    </span>
  );

  return (
    <Card variant="outlined" className="login-page-form">
      <form onSubmit={onFormSubmit}>
        <CardHeader title="Login" subheader={cardSubHeader} />
        <CardContent className="login-page-form__contents">
          <TextField
            required
            name="endpoint"
            label="RClone RC Endpoint"
            variant="outlined"
            placeholder="Ex: http://localhost:5572"
            className="login-page-form__text-field"
            error={hasError}
            inputProps={{ 'data-testid': 'endpoint-field' }}
          />
          <TextField
            required
            name="username"
            label="Username"
            variant="outlined"
            className="login-page-form__text-field"
            error={hasError}
            inputProps={{ 'data-testid': 'username-field' }}
          />
          <TextField
            required
            name="password"
            label="Password"
            variant="outlined"
            type="password"
            className="login-page-form__text-field"
            error={hasError}
            inputProps={{ 'data-testid': 'password-field' }}
          />
        </CardContent>
        <CardActions>
          <Button variant="contained" data-testid="login-button" type="submit">
            Login
          </Button>
          <Button data-testid="help-button" onClick={openDialog}>
            Help
          </Button>
        </CardActions>
      </form>
    </Card>
  );
}
