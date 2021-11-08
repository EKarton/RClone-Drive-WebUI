import AuthenticatedApp from 'apps/AuthenticatedApp';
import FilesListPage from 'pages/FilesListPage';
import FilesPage from 'pages/FilesPage';
import PicturesListPage from 'pages/PicturesListPage';
import PicturesPage from 'pages/PicturesPage';
import FileViewerDialog from 'pages/FileViewerDialog';
import { customRender } from 'test-utils';

jest.mock('pages/FilesListPage');
jest.mock('pages/FilesPage');
jest.mock('pages/PicturesListPage');
jest.mock('pages/PicturesPage');
jest.mock('pages/FileViewerDialog');

describe('AuthenticatedApp', () => {
  beforeEach(() => {
    FileViewerDialog.mockReturnValue(null);
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
});
