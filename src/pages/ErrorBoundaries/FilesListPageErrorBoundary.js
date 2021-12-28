import NotFoundErrorPage from 'pages/ErrorPages/NotFoundErrorPage';
import PageErrorBoundary from './PageErrorBoundary';

export default function FilesListPageErrorBoundary({ children }) {
  const Files404Component = ({ error }) => (
    <NotFoundErrorPage
      error={error}
      redirectText="Go back to my files"
      redirectLink="/files"
    />
  );

  return (
    <PageErrorBoundary NotFoundComponent={Files404Component}>
      {children}
    </PageErrorBoundary>
  );
}
