import RemoteCardList from 'components/RemoteCardList';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { hashRemotePath } from 'utils/remote-paths-url';
import { customRender, waitFor } from 'test-utils/react';
import RemotesListSection from '../RemotesListSection';

jest.mock('components/RemoteCardList');
jest.mock('hooks/rclone/useRCloneClient');

describe('RemotesListSection', () => {
  const fetchRemotesFn = jest.fn();

  beforeEach(() => {
    useRCloneClient.mockReturnValue({
      fetchRemotes: fetchRemotesFn,
    });
  });

  it('should match snapshot given fetching list of remotes were successful', async () => {
    RemoteCardList.mockImplementation(({ remotes }) => {
      return <div>{remotes.join(',')}</div>;
    });
    fetchRemotesFn.mockResolvedValue(['googledrive', 'onedrive', 'icloud']);

    const component = customRender(<RemotesListSection />);

    await waitFor(() => {
      expect(component.baseElement).toMatchSnapshot();
    });
  });

  it('should go to the files page when user clicks on a remote', async () => {
    // Mock the timer to prevent calling onClick immediately
    jest.useFakeTimers();

    RemoteCardList.mockImplementation(({ remotes, onClick }) => {
      setTimeout(() => onClick('googledrive'), 10000);
      return <div>{remotes.join(',')}</div>;
    });

    fetchRemotesFn.mockResolvedValue(['googledrive', 'onedrive', 'icloud']);

    const component = customRender(<RemotesListSection />);

    // Mimic user clicking on the buttotn
    jest.runAllTimers();

    const expectedPath = `/files/${hashRemotePath('googledrive:')}`;
    await waitFor(() => {
      expect(component.history.location.pathname).toEqual(expectedPath);
    });
  });

  it('should show an error page when fetching remotes failed', async () => {
    fetchRemotesFn.mockRejectedValue(new Error('Error!'));

    const component = customRender(<RemotesListSection />);

    await waitFor(() => {
      expect(component.getByText('Error!')).toBeInTheDocument();
      expect(component.baseElement).toMatchSnapshot();
    });
  });
});
