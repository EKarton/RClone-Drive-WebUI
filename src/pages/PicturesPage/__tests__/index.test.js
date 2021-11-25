import useRCloneClient from 'hooks/useRCloneClient';
import PicturesPage from 'pages/PicturesPage';
import { customRender, userEvent, waitFor } from 'test-utils/react';
import { mockRemotes } from 'test-utils/mock-responses';
import { hashRemotePath } from 'utils/remote-paths-url';
import FolderBrowserDialog from '../FolderBrowserDialog';

jest.mock('../FolderBrowserDialog');
jest.mock('hooks/useRCloneClient');

describe('PicturesPage', () => {
  const fetchRemotesFn = jest.fn();

  beforeEach(() => {
    FolderBrowserDialog.mockReturnValue(null);

    useRCloneClient.mockReturnValue({
      fetchRemotes: fetchRemotesFn,
    });
  });

  it('should match snapshot when api call succeeds', async () => {
    // Mock the timer
    jest.useFakeTimers();

    // Mock api call that takes 10000ms
    fetchRemotesFn.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockRemotes.remotes);
        }, 10000);
      });
    });

    const component = customRender(<PicturesPage />);

    await waitFor(() => {
      expect(component.baseElement).toMatchSnapshot();
    });

    // Resolve api call
    jest.runAllTimers();

    await waitFor(() => {
      expect(component.baseElement.querySelector('.filespage')).toBeInTheDocument();
      expect(component.baseElement).toMatchSnapshot();
    });
  });

  it('should open FolderBrowserDialog when user clicks on a remote', async () => {
    fetchRemotesFn.mockResolvedValue(mockRemotes.remotes);

    const component = customRender(<PicturesPage />);

    await waitFor(() => {
      expect(component.baseElement.querySelector('.filespage')).toBeInTheDocument();

      userEvent.click(component.getByTestId('googledrive'));

      expect(FolderBrowserDialog.mock.calls[1][0].open).toBeTruthy();
    });
  });

  it('should redirect to correct page when user selected a remote in the FolderBrowserDialog component', async () => {
    let onOkFn = null;

    FolderBrowserDialog.mockImplementationOnce(({ onOk }) => {
      onOkFn = onOk;
      return null;
    });

    fetchRemotesFn.mockResolvedValue(mockRemotes.remotes);

    const component = customRender(<PicturesPage />);

    await waitFor(() => {
      onOkFn('googledrive:Pictures');

      const expectedPath = `/pictures/${hashRemotePath('googledrive:Pictures')}`;
      expect(component.history.location.pathname).toEqual(expectedPath);
    });
  });

  it('should close the dialog when user selects nothing in the FolderBrowserDialog component', async () => {
    let onOkFn = null;

    FolderBrowserDialog.mockImplementationOnce(({ onOk }) => {
      onOkFn = onOk;
      return null;
    });

    fetchRemotesFn.mockResolvedValue(mockRemotes.remotes);

    customRender(<PicturesPage />);

    await waitFor(() => {
      onOkFn('');

      expect(FolderBrowserDialog.mock.calls[0][0].open).toBeFalsy();
    });
  });

  it('should close the dialog when user closes the dialog', async () => {
    let onCancelFn = null;

    FolderBrowserDialog.mockImplementationOnce(({ onCancel }) => {
      onCancelFn = onCancel;
      return null;
    });

    fetchRemotesFn.mockResolvedValue(mockRemotes.remotes);

    customRender(<PicturesPage />);

    await waitFor(() => {
      onCancelFn();

      expect(FolderBrowserDialog.mock.calls[0][0].open).toBeFalsy();
    });
  });
});
