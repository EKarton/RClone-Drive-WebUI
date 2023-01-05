import LoginIcon from '@mui/icons-material/Login';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import cx from 'classnames';
import { useState, useEffect } from 'react';
import { useLoginHelpDialog } from 'contexts/LoginHelpDialog';
import './Form.scss';

export default function Form({ initialValues = {}, error, isLoading, onFormSubmit }) {
  const { openDialog } = useLoginHelpDialog();
  const hasError = error !== null;
  const [values, setValues] = useState({});

  const cardSubHeader = (
    <span className={cx({ 'login-page-form__header--red': error })}>
      {hasError ? error?.message : 'Enter your RClone info to get started'}
    </span>
  );

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(values);
  };

  return (
    <Card variant="outlined" className="login-page-form">
      <form onSubmit={handleFormSubmit}>
        <CardHeader title="Login" subheader={cardSubHeader} />
        <CardContent className="login-page-form__contents">
          <TextField
            required
            value={values.endpoint}
            onChange={(newValue) =>
              setValues({
                ...values,
                endpoint: newValue.target.value,
              })
            }
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
            value={values.username}
            onChange={(newValue) =>
              setValues({
                ...values,
                username: newValue.target.value,
              })
            }
            name="username"
            label="Username"
            variant="outlined"
            className="login-page-form__text-field"
            error={hasError}
            inputProps={{ 'data-testid': 'username-field' }}
          />
          <TextField
            required
            value={values.password}
            onChange={(newValue) =>
              setValues({
                ...values,
                password: newValue.target.value,
              })
            }
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
          <LoadingButton
            loading={isLoading}
            loadingPosition="start"
            startIcon={<LoginIcon />}
            variant="contained"
            data-testid="login-button"
            type="submit"
          >
            Login
          </LoadingButton>
          <Button data-testid="help-button" onClick={openDialog}>
            Help
          </Button>
        </CardActions>
      </form>
    </Card>
  );
}
