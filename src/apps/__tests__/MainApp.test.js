import MainApp from 'apps/MainApp';
import FilesListPage from 'pages/FilesListPage/index';
import FilesPage from 'pages/FilesPage/index';
import LandingPage from 'pages/LandingPage';
import LoginPage from 'pages/LoginPage';
import LogoutPage from 'pages/LogoutPage';
import PicturesListPage from 'pages/PicturesListPage/index';
import PicturesPage from 'pages/PicturesPage/index';
import { customRender } from 'test-utils/react';

jest.mock('pages/LandingPage');
jest.mock('pages/LoginPage');
jest.mock('pages/LogoutPage');
jest.mock('pages/FilesPage');
jest.mock('pages/FilesListPage');
jest.mock('pages/PicturesPage');
jest.mock('pages/PicturesListPage');

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
    [FilesPage, '/files'],
    [FilesListPage, '/files/123'],
    [PicturesPage, '/pictures'],
    [PicturesListPage, '/pictures/123'],
  ])('should render %s given route is %s', (expectedComponent, route) => {
    expectedComponent.mockReturnValue(null);

    customRender(<MainApp />, {}, { route });

    expect(expectedComponent).toBeCalled();
  });
});
