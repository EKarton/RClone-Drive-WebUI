import LazyImageList from 'components/LazyImageList';
import { FileViewerDialogProvider } from 'contexts/FileViewerDialog/index';
import useFetchPictures from 'hooks/fetch-data/useFetchPictures';
import useFileViewerDialog from 'hooks/utils/useFileViewerDialog';
import { StatusTypes } from 'utils/constants';
import { hashRemotePath } from 'utils/remote-paths-url';
import { mockPictures } from 'test-utils/mock-responses';
import { act, customRender, waitFor } from 'test-utils/react';
import ImageList from '../ImageList';

jest.mock('hooks/fetch-data/useFetchPictures');
jest.mock('hooks/utils/useFileViewerDialog');
jest.mock('components/LazyImageList');

describe('ImageList', () => {
  const remote = 'googledrive';
  const fetchPicturesFn = jest.fn();
  const fileViewerShowFn = jest.fn();

  beforeEach(() => {
    useFetchPictures.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: mockPictures.list,
    });

    useFileViewerDialog.mockReturnValue({
      show: fileViewerShowFn,
    });

    LazyImageList.mockReturnValue(null);
  });

  it('should match snapshots when the api call succeeds', async () => {
    const { baseElement } = renderComponent();

    expect(baseElement).toMatchSnapshot();
  });

  it('should render skeleton when api is being loaded', async () => {
    useFetchPictures.mockReturnValue({
      status: StatusTypes.LOADING,
    });

    const { baseElement } = renderComponent();

    expect(baseElement).toMatchSnapshot();
  });

  it('should render error page when fetching data was not successful', async () => {
    useFetchPictures.mockReturnValue({
      status: StatusTypes.ERROR,
      error: new Error('Error!'),
    });

    expect(renderComponent).toThrowError();
  });

  it('should call fileViewer.show() when someone clicks on an image', async () => {
    jest.useFakeTimers();

    fetchPicturesFn.mockResolvedValue(mockPictures.list);

    const fileInfo = { remote, dirPath: 'Pictures', fileName: 'image.png' };

    LazyImageList.mockImplementation(({ onImageClicked }) => {
      setTimeout(() => onImageClicked(fileInfo), 10000);
      return null;
    });

    renderComponent();

    act(() => jest.runAllTimers());

    await waitFor(() => expect(fileViewerShowFn).toBeCalledWith(fileInfo));
  });

  const renderComponent = () => {
    const route = `/pictures/${hashRemotePath(`${remote}:`)}`;

    const initialRCloneInfoState = {
      endpoint: 'http://localhost:5572',
      username: 'local',
      password: '1234',
    };

    const component = (
      <FileViewerDialogProvider>
        <ImageList remote={remote} path="" />
      </FileViewerDialogProvider>
    );

    return customRender(component, { initialRCloneInfoState }, { route });
  };
});
