import RemotesListSection from 'components/RemotesListSection';
import { hashRemotePath } from 'utils/remote-paths-url';
import { customRender, waitFor, screen } from 'test-utils/react';
import { useLocation } from 'react-router-dom';
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

    customRender(
      <>
        <FilesPage />
        <LocationDisplay />
      </>
    );

    jest.runAllTimers();

    const expectedPath = `/files/${hashRemotePath('gdrive:')}`;
    await waitFor(() => {
      expect(screen.getByTestId('location-display')).toHaveTextContent(expectedPath);
    });
  });
});

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
}
