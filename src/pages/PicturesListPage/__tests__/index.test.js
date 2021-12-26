import ImageList from '../ImageList';
import useFileViewer from 'hooks/utils/useFileViewer';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { Route } from 'react-router';
import { act, customRender, waitFor } from 'test-utils/react';
import { mockPictures } from 'test-utils/mock-responses';
import { hashRemotePath } from 'utils/remote-paths-url';
import PicturesListPage from '..';

jest.mock('hooks/rclone/useRCloneClient');
jest.mock('hooks/utils/useFileViewer');
jest.mock('../ImageList');

describe('PicturesListPage', () => {
  const remote = 'googledrive';
  const route = `/pictures/${hashRemotePath(`${remote}:`)}`;

  const fetchPicturesFn = jest.fn();
  const fileViewerShowFn = jest.fn();

  beforeEach(() => {
    useRCloneClient.mockReturnValue({
      fetchPictures: fetchPicturesFn,
    });

    useFileViewer.mockReturnValue({
      show: fileViewerShowFn,
    });

    ImageList.mockReturnValue(null);
  });

  it('should match snapshots when the api call loads and succeeds', async () => {
    // Mock the timer
    jest.useFakeTimers();

    // Mock api call that takes 10000ms
    fetchPicturesFn.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockPictures.list);
        }, 10000);
      });
    });

    const component = renderComponent();

    await waitFor(() => {
      expect(component.baseElement).toMatchSnapshot();
    });

    // Resolve api call
    jest.runAllTimers();

    await waitFor(() => {
      expect(component.baseElement).toMatchSnapshot();
    });
  });

  it('should render error page when fetching data was not successful', async () => {
    fetchPicturesFn.mockRejectedValue(new Error('Error!'));

    const component = renderComponent();

    await waitFor(() => {
      expect(component.getByText('Error!')).toBeInTheDocument();
      expect(component.baseElement).toMatchSnapshot();
    });
  });

  it('should call fileViewer.show() when someone clicks on an image', async () => {
    jest.useFakeTimers();

    fetchPicturesFn.mockResolvedValue(mockPictures.list);

    const fileInfo = { remote, folderPath: 'Pictures', fileName: 'image.png' };

    ImageList.mockImplementation(({ onImageClicked }) => {
      setTimeout(() => onImageClicked(fileInfo), 10000);
      return null;
    });

    renderComponent();

    act(() => jest.runAllTimers());

    await waitFor(() => expect(fileViewerShowFn).toBeCalledWith(fileInfo));
  });

  const renderComponent = () => {
    const component = (
      <Route path="/pictures/:id">
        <PicturesListPage />
      </Route>
    );

    return customRender(component, {}, { route });
  };
});
