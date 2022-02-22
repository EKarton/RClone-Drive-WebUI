import Box from '@mui/material/Box';
import { useState } from 'react';
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formProps = Object.fromEntries(new FormData(e.target));
    const { endpoint, username, password } = formProps;

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
        <Form error={error} isLoading={isLoading} onFormSubmit={handleFormSubmit} />
      </Box>
    </LoginHelpDialogProvider>
  );
}
