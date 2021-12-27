import { ErrorBoundary } from 'react-error-boundary';
import { useHistory } from 'react-router-dom';

export default function AppBoundary({ children }) {
  const history = useHistory();

  const errorHandler = (error) => {
    // If there is no response, then it is a network error and we need to ask user for info again
    // Link: https://github.com/axios/axios/issues/383
    if (!error.response) {
      window.location = `/login?redirect_path=${history.location.pathname}`;
    }
  };

  return (
    <ErrorBoundary fallback={<div>Hehe</div>} onError={errorHandler}>
      {children}
    </ErrorBoundary>
  );
}
