import { InvalidRemotePathError } from 'hooks/utils/useRemotePathParams';
import InternalErrorPage from 'pages/ErrorPages/InternalServerErrorPage';
import NotFoundErrorPage from 'pages/ErrorPages/NotFoundErrorPage';
import { mockErrorStackTrace } from 'test-utils/mock-error';
import { render } from 'test-utils/react';
import PageErrorBoundary from '../PageErrorBoundary';

jest.mock('pages/ErrorPages/NotFoundErrorPage');
jest.mock('pages/ErrorPages/InternalServerErrorPage');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    location: {
      pathname: '/pictures',
    },
  }),
}));

describe('PageErrorBoundary', () => {
  const notFoundError1 = mockErrorStackTrace(new InvalidRemotePathError('/files/123'));
  const notFoundError2 = {
    response: {
      status: 500,
      data: {
        error: "didn't find section in config file",
      },
    },
  };
  const notFoundError3 = {
    response: {
      status: 404,
      data: {
        error: 'error in ListJSON: directory not found',
      },
    },
  };

  beforeEach(() => {
    NotFoundErrorPage.mockReturnValue(null);
    InternalErrorPage.mockReturnValue(null);
  });

  it.each([notFoundError1, notFoundError2, notFoundError3])(
    'should render NotFoundComponent given 404 error %s',
    (error) => {
      renderComponent(error);

      expect(NotFoundErrorPage).toBeCalled();
    }
  );

  it('should render nothing and redirect user to the login page given an auth error', () => {
    delete window.location;
    window.location = { assign: jest.fn() };

    const error = { message: 'Network Error' };
    renderComponent(error);

    expect(window.location.assign).toBeCalledWith('/login?redirect_path=/pictures');
  });

  it('should render InternalErrorPage given a random error', () => {
    renderComponent(new Error('Random error'));

    expect(InternalErrorPage).toBeCalled();
  });

  const renderComponent = (error) => {
    return render(
      <PageErrorBoundary NotFoundComponent={NotFoundErrorPage}>
        <ErrorThrowingComponent error={error} />
      </PageErrorBoundary>
    );
  };

  const ErrorThrowingComponent = ({ error }) => {
    throw error;
  };
});
