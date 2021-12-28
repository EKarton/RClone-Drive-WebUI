import NotFoundErrorPage from 'pages/ErrorPages/NotFoundErrorPage';
import PageErrorBoundary from './PageErrorBoundary';

export default function PicturesListPageErrorBoundary({ children }) {
  const Pictures404Component = ({ error }) => (
    <NotFoundErrorPage
      error={error}
      redirectText="Go back to my pictures"
      redirectLink="/pictures"
    />
  );

  return (
    <PageErrorBoundary NotFoundComponent={Pictures404Component}>
      {children}
    </PageErrorBoundary>
  );
}
