import NotFoundErrorPage from '../ErrorPages/NotFoundErrorPage';
import PageErrorBoundary from './PageErrorBoundary';

export default function AppErrorBoundary({ children }) {
  const NotFoundComponent = ({ error }) => (
    <NotFoundErrorPage error={error} redirectLink="/" redirectText="Go back to home" />
  );

  return (
    <PageErrorBoundary NotFoundComponent={NotFoundComponent}>
      {children}
    </PageErrorBoundary>
  );
}
