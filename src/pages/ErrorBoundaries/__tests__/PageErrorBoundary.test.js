import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { MissingRCloneInfoError } from 'hooks/rclone/useRCloneClient';
import { InvalidRemotePathError } from 'hooks/utils/useRemotePathParams';
import InternalErrorPage from 'pages/ErrorPages/InternalServerErrorPage';
import NotFoundErrorPage from 'pages/ErrorPages/NotFoundErrorPage';
import { mockErrorStackTrace } from 'test-utils/mock-error';
import { render } from 'test-utils/react';
import PageErrorBoundary from '../PageErrorBoundary';

jest.mock('pages/ErrorPages/NotFoundErrorPage');
jest.mock('pages/ErrorPages/InternalServerErrorPage');

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

  const authError1 = { message: 'Network Error' };
  const authError2 = new MissingRCloneInfoError();

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

  it.each([authError1, authError2])(
    'should render nothing and redirect user to the login page given an auth error',
    (error) => {
      delete window.location;
      window.location = { assign: jest.fn() };

      renderComponent(error);

      expect(window.location.assign).toBeCalledWith('/login?redirect_path=/pictures');
    }
  );

  it('should render InternalErrorPage given a random error', () => {
    renderComponent(new Error('Random error'));

    expect(InternalErrorPage).toBeCalled();
  });

  const renderComponent = (error) => {
    const history = createMemoryHistory({ initialEntries: ['/pictures'] });

    return render(
      <Router location={history.location} navigator={history}>
        <PageErrorBoundary NotFoundComponent={NotFoundErrorPage}>
          <ErrorThrowingComponent error={error} />
        </PageErrorBoundary>
      </Router>
    );
  };

  const ErrorThrowingComponent = ({ error }) => {
    throw error;
  };
});
