import useRCloneClient from 'hooks/useRCloneClient';
import { customRender, userEvent, waitFor } from 'test-utils/react';
import { hashRemotePath } from 'utils/remote-paths-url';
import FilesPage from '..';

jest.mock('hooks/useRCloneClient');

describe('FilesPage', () => {
  const fetchRemotesFn = jest.fn();

  beforeEach(() => {
    useRCloneClient.mockReturnValue({
      fetchRemotes: fetchRemotesFn,
    });
  });

  it('should match snapshot given fetching list of remotes were successful', async () => {
    fetchRemotesFn.mockResolvedValue(['googledrive', 'onedrive', 'icloud']);

    const component = customRender(<FilesPage />);

    await waitFor(() => {
      expect(component.getByTestId('googledrive')).toBeInTheDocument();
      expect(component.baseElement).toMatchSnapshot();
    });
  });

  it('should go to the files page when user clicks on a remote', async () => {
    fetchRemotesFn.mockResolvedValue(['googledrive', 'onedrive', 'icloud']);

    const component = customRender(<FilesPage />);

    await waitFor(() => {
      expect(component.getByTestId('googledrive')).toBeInTheDocument();
    });

    userEvent.click(component.getByTestId('googledrive'));

    const expectedPath = `/files/${hashRemotePath('googledrive:')}`;
    expect(component.history.location.pathname).toEqual(expectedPath);
  });

  it('should show an error page when fetching remotes failed', async () => {
    fetchRemotesFn.mockRejectedValue(new Error('Error!'));

    const component = customRender(<FilesPage />);

    await waitFor(() => {
      expect(component.getByText('Error!')).toBeInTheDocument();
      expect(component.baseElement).toMatchSnapshot();
    });
  });
});
