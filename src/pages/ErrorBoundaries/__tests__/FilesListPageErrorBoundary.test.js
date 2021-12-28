import { MemoryRouter } from 'react-router-dom';
import { InvalidRemotePathError } from 'hooks/utils/useRemotePathParams';
import NotFoundErrorPage from 'pages/ErrorPages/NotFoundErrorPage';
import { mockErrorStackTrace } from 'test-utils/mock-error';
import { render } from 'test-utils/react';
import FilesListPageErrorBoundary from '../FilesListPageErrorBoundary';

jest.mock('pages/ErrorPages/NotFoundErrorPage');

describe('FilesListPageErrorBoundary', () => {
  beforeEach(() => {
    NotFoundErrorPage.mockReturnValue(null);
  });

  it('should render NotFoundErrorPage given 404 error', () => {
    renderComponent(mockErrorStackTrace(new InvalidRemotePathError('/files/123')));

    expect(NotFoundErrorPage).toBeCalled();
  });

  const renderComponent = (error) => {
    const ErrorThrowingComponent = ({ error }) => {
      throw error;
    };

    return render(
      <MemoryRouter>
        <FilesListPageErrorBoundary>
          <ErrorThrowingComponent error={error} />
        </FilesListPageErrorBoundary>
      </MemoryRouter>
    );
  };
});
