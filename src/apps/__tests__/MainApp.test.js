import AuthenticatedApp from 'apps/AuthenticatedApp';
import MainApp from 'apps/MainApp';
import LandingPage from 'pages/LandingPage';
import LoginPage from 'pages/LoginPage';
import LogoutPage from 'pages/LogoutPage';
import { customRender } from 'test-utils/react';
import { AuthenticatedPaths } from 'utils/constants';

jest.mock('pages/LandingPage');
jest.mock('pages/LoginPage');
jest.mock('pages/LogoutPage');
jest.mock('apps/AuthenticatedApp');

describe('MainApp', () => {
  it('should match snapshot given valid route', () => {
    LandingPage.mockReturnValue(null);

    const { baseElement } = customRender(<MainApp />, {}, { route: '/' });

    expect(baseElement).toMatchSnapshot();
  });

  it.each([
    [LandingPage, '/'],
    [LoginPage, '/login'],
    [LogoutPage, '/logout'],
    [AuthenticatedApp, AuthenticatedPaths[0]],
  ])('should render %s given route is %s', (expectedComponent, route) => {
    expectedComponent.mockReturnValue(null);

    customRender(<MainApp />, {}, { route });

    expect(expectedComponent).toBeCalled();
  });
});
