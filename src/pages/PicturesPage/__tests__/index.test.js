import PicturesPage from 'pages/PicturesPage';
import { act, customRender, waitFor } from 'test-utils/react';
import { hashRemotePath } from 'utils/remote-paths-url';
import FolderBrowserDialog from '../FolderBrowserDialog';
import RemotesListSection from '../RemotesListSection';
import RecentPicturesSection from '../RecentPicturesSection';
import { FileViewerDialogProvider } from 'contexts/FileViewerDialog';

jest.mock('../FolderBrowserDialog');
jest.mock('../RecentPicturesSection');
jest.mock('../RemotesListSection');

describe('PicturesPage', () => {
  beforeEach(() => {
    FolderBrowserDialog.mockReturnValue(null);
    RecentPicturesSection.mockReturnValue(null);
    RemotesListSection.mockReturnValue(null);
  });

  it('should open FolderBrowserDialog when user clicks on a remote', async () => {
    // Mock user clicking on a remote
    jest.useFakeTimers();

    RemotesListSection.mockImplementation(({ onRemoteCardClicked }) => {
      setTimeout(() => onRemoteCardClicked('googledrive'), 10000);
      return null;
    });

    renderComponent();

    act(() => jest.runAllTimers());

    await waitFor(() => {
      expect(FolderBrowserDialog.mock.calls[1][0].open).toBeTruthy();
    });
  });

  it('should redirect to correct page when user selected a remote in the FolderBrowserDialog component', async () => {
    jest.useFakeTimers();

    FolderBrowserDialog.mockImplementationOnce(({ onOk }) => {
      setTimeout(() => onOk('googledrive:Pictures'), 10000);
      return null;
    });

    const component = renderComponent();

    act(() => jest.runAllTimers());

    await waitFor(() => {
      const expectedPath = `/pictures/${hashRemotePath('googledrive:Pictures')}`;
      expect(component.history.location.pathname).toEqual(expectedPath);
    });
  });

  it('should close the dialog when user selects nothing in the FolderBrowserDialog component', async () => {
    jest.useFakeTimers();

    FolderBrowserDialog.mockImplementationOnce(({ onOk }) => {
      setTimeout(() => onOk(''), 10000);
      return null;
    });

    renderComponent();

    act(() => jest.runAllTimers());

    await waitFor(() => {
      expect(FolderBrowserDialog.mock.calls[0][0].open).toBeFalsy();
    });
  });

  it('should close the dialog when user closes the dialog', async () => {
    jest.useFakeTimers();

    FolderBrowserDialog.mockImplementationOnce(({ onCancel }) => {
      setTimeout(() => onCancel(), 10000);
      return null;
    });

    renderComponent();

    act(() => jest.runAllTimers());

    await waitFor(() => {
      expect(FolderBrowserDialog.mock.calls[0][0].open).toBeFalsy();
    });
  });

  const renderComponent = () => {
    const initialRCloneInfoState = {
      endpoint: 'http://localhost:5572',
      username: 'local',
      password: '1234',
    };

    const componentToRender = (
      <FileViewerDialogProvider>
        <PicturesPage />
      </FileViewerDialogProvider>
    );

    const component = customRender(componentToRender, {
      initialRCloneInfoState,
    });

    return component;
  };
});
