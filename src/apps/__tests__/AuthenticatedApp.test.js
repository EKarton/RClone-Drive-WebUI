import AuthenticatedApp from 'apps/AuthenticatedApp';
import FilesListPage from 'pages/FilesListPage';
import FilesPage from 'pages/FilesPage';
import PicturesListPage from 'pages/PicturesListPage';
import PicturesPage from 'pages/PicturesPage';
import FileViewerDialog from 'pages/FileViewerDialog';
import { act, customRender } from 'test-utils/react';
import GlobalAppBar from 'components/GlobalAppBar';
import GlobalNavBar from 'components/GlobalNavBar';

jest.mock('pages/FilesListPage');
jest.mock('pages/FilesPage');
jest.mock('pages/PicturesListPage');
jest.mock('pages/PicturesPage');
jest.mock('pages/FileViewerDialog');
jest.mock('components/GlobalAppBar');
jest.mock('components/GlobalNavBar');

describe('AuthenticatedApp', () => {
  beforeEach(() => {
    FileViewerDialog.mockReturnValue(null);
    GlobalAppBar.mockReturnValue(null);
    GlobalNavBar.mockReturnValue(null);
  });

  it('should match snapshot given valid route', () => {
    FilesPage.mockReturnValue(null);

    const { baseElement } = customRender(<AuthenticatedApp />, {}, { route: '/files' });

    expect(baseElement).toMatchSnapshot();
  });

  it.each([
    [FilesPage, '/files'],
    [FilesListPage, '/files/123'],
    [PicturesPage, '/pictures'],
    [PicturesListPage, '/pictures/123'],
  ])('should render %s given route is %s', (expectedComponent, route) => {
    expectedComponent.mockReturnValue(null);

    customRender(<AuthenticatedApp />, {}, { route });

    expect(expectedComponent).toBeCalled();
  });

  it('should expand the global nav bar when user clicks on the menu button in global app bar', () => {
    FilesPage.mockReturnValue(null);

    let onDrawerButttonClickedFn = null;
    GlobalAppBar.mockImplementation(({ onDrawerButttonClicked }) => {
      onDrawerButttonClickedFn = onDrawerButttonClicked;
      return null;
    });

    customRender(<AuthenticatedApp />, {}, { route: '/files' });

    act(() => {
      onDrawerButttonClickedFn();
    });

    expect(GlobalNavBar.mock.calls[1][0].isExpanded).toBeTruthy();
  });
});
