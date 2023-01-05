import Box from '@mui/material/Box';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoginHelpDialogProvider } from 'contexts/LoginHelpDialog';
import useRCloneInfo from 'hooks/rclone/useRCloneInfo';
import RCloneClient from 'services/RCloneClient';
import Form from './Form';
import Header from './Header';
import './index.scss';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setRCloneInfo } = useRCloneInfo();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    const authMethod = searchParams.get('auth_method') || 'form';

    if (authMethod === 'redirected') {
      const endpoint = Cookies.get('endpoint');
      const username = Cookies.get('username');
      const password = Cookies.get('password');

      setInitialValues({ endpoint, username, password });
      tryLoginAndRedirect({ endpoint, username, password });
    }
  }, []);

  const tryLoginAndRedirect = async ({ endpoint, username, password }) => {
    const redirectPath = searchParams.get('redirect_path') || '/files';

    try {
      // To test if connection is correct, call RClone to fetch remotes
      setIsLoading(true);
      await new RCloneClient({ endpoint, username, password }).fetchRemotes();

      setIsLoading(false);
      setRCloneInfo({ endpoint, username, password });
      navigate(redirectPath);
    } catch (error) {
      setIsLoading(false);
      setError(error);
    }
  };

  return (
    <LoginHelpDialogProvider>
      <Box className="login-page">
        <Header />
        <Form
          initialValues={initialValues}
          error={error}
          isLoading={isLoading}
          onFormSubmit={tryLoginAndRedirect}
        />
      </Box>
    </LoginHelpDialogProvider>
  );
}
