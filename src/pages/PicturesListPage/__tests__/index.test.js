import ImageList from '../ImageList';
import useFileViewer from 'hooks/useFileViewer';
import useRCloneClient from 'hooks/useRCloneClient';
import { Route } from 'react-router';
import { customRender, waitFor } from 'test-utils/react';
import { mockPictures } from 'test-utils/mock-responses';
import { hashRemotePath } from 'utils/remote-paths-url';
import PicturesListPage from '..';

jest.mock('hooks/useRCloneClient');
jest.mock('hooks/useFileViewer');
jest.mock('../ImageList');

describe('PicturesListPage', () => {
  const remote = 'googledrive';
  const route = `/pictures/${hashRemotePath(`${remote}:`)}`;

  const fetchPicturesFn = jest.fn();
  const showFn = jest.fn();

  beforeEach(() => {
    useRCloneClient.mockReturnValue({
      fetchPictures: fetchPicturesFn,
    });

    useFileViewer.mockReturnValue({
      show: showFn,
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
      expect(component.getByTestId('imagelistskeleton')).toBeInTheDocument();
      expect(component.baseElement).toMatchSnapshot();
    });

    // Resolve api call
    jest.runAllTimers();

    await waitFor(() => {
      expect(component.getByTestId('imagelist')).toBeInTheDocument();
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
    fetchPicturesFn.mockResolvedValue(mockPictures.list);

    const fileInfo = { remote, folderPath: 'Pictures', fileName: 'image.png' };
    ImageList.mockImplementation(({ onImageClicked }) => {
      onImageClicked(fileInfo);
      return null;
    });

    const component = renderComponent();

    await waitFor(() => {
      expect(component.getByTestId('imagelist')).toBeInTheDocument();
      expect(showFn).toBeCalledWith(fileInfo);
    });
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
