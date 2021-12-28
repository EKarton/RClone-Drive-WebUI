import { ErrorBoundary } from 'react-error-boundary';
import { useLocation } from 'react-router-dom';
import { MissingRCloneInfoError } from 'hooks/rclone/useRCloneClient';
import { InvalidRemotePathError } from 'hooks/utils/useRemotePathParams';
import InternalErrorPage from 'pages/ErrorPages/InternalServerErrorPage';

export default function PageErrorBoundary({ children, NotFoundComponent }) {
  const { pathname } = useLocation();

  const errorHandler = (error) => {
    if (isAuthError(error)) {
      window.location.assign(`/login?redirect_path=${pathname}`);
    }
  };

  const renderFallback = ({ error }) => {
    if (is404Error(error)) {
      return <NotFoundComponent error={error} />;
    }

    return <InternalErrorPage error={error} />;
  };

  const isAuthError = (error) => {
    const authError = !error.response && error.message === 'Network Error';
    const missingInfoError = error instanceof MissingRCloneInfoError;

    return authError || missingInfoError;
  };

  const is404Error = (error) => {
    const isRemoteNotFound =
      error?.response?.status === 500 &&
      error?.response?.data?.error === "didn't find section in config file";

    const isDirectoryNotFound =
      error?.response?.status === 404 &&
      error?.response?.data?.error === 'error in ListJSON: directory not found';

    const is404AppError = error instanceof InvalidRemotePathError;

    return isRemoteNotFound || isDirectoryNotFound || is404AppError;
  };

  return (
    <ErrorBoundary fallbackRender={renderFallback} onError={errorHandler}>
      {children}
    </ErrorBoundary>
  );
}
