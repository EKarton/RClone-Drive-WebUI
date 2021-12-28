import RemotesListSection from 'components/RemotesListSection';
import { hashRemotePath } from 'utils/remote-paths-url';
import { customRender, waitFor } from 'test-utils/react';
import FilesPage from '../index';

jest.mock('components/RemotesListSection');

describe('FilesPage', () => {
  it('should match snapshot', () => {
    RemotesListSection.mockReturnValue(null);

    const { baseElement } = customRender(<FilesPage />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should go to correct page given user clicks on a remote', async () => {
    // Simulate user clicking on a remote
    jest.useFakeTimers();

    RemotesListSection.mockImplementation(({ onRemoteCardClicked }) => {
      setTimeout(() => onRemoteCardClicked('gdrive'), 10000);
      return null;
    });

    const view = customRender(<FilesPage />);

    jest.runAllTimers();

    const expectedPath = `/files/${hashRemotePath('gdrive:')}`;
    await waitFor(() => {
      expect(view.history.location.pathname).toEqual(expectedPath);
    });
  });
});
