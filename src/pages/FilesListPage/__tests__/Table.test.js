import useFetchFiles from 'hooks/rclone/fetch-data/useFetchFiles';
import useFileCopier from 'hooks/useFileCopier';
import useFileDownloader from 'hooks/useFileDownloader';
import useFileRemover from 'hooks/useFileRemover';
import useFileViewer from 'hooks/useFileViewer';
import useMoveFileDialog from 'hooks/useMoveFileDialog';
import useRenameFileDialog from 'hooks/useRenameFileDialog';
import { Route, Switch } from 'react-router-dom';
import { mockFiles } from 'test-utils/mock-responses';
import { customRender, fireEvent, userEvent } from 'test-utils/react';
import { StatusTypes } from 'utils/constants';
import { hashRemotePath } from 'utils/remote-paths-url';
import Table from '../Table';

jest.mock('hooks/rclone/fetch-data/useFetchFiles');
jest.mock('hooks/rclone/useRCloneClient');
jest.mock('hooks/useFileViewer');
jest.mock('hooks/useMoveFileDialog');
jest.mock('hooks/useFileDownloader');
jest.mock('hooks/useFileRemover');
jest.mock('hooks/useFileCopier');
jest.mock('hooks/useRenameFileDialog');

describe('Table', () => {
  const remote = 'gdrive';
  const refetchData = jest.fn();

  const show = jest.fn();
  const moveFile = jest.fn();
  const renameFile = jest.fn();
  const downloadFile = jest.fn();
  const deleteFile = jest.fn();
  const copyFile = jest.fn();

  beforeEach(() => {
    show.mockResolvedValue();
    moveFile.mockResolvedValue();
    renameFile.mockResolvedValue();
    downloadFile.mockResolvedValue();
    deleteFile.mockResolvedValue();
    copyFile.mockResolvedValue();

    useFileViewer.mockReturnValue({ show });
    useMoveFileDialog.mockReturnValue({ moveFile });
    useRenameFileDialog.mockReturnValue({ renameFile });
    useFileDownloader.mockReturnValue(downloadFile);
    useFileRemover.mockReturnValue(deleteFile);
    useFileCopier.mockReturnValue(copyFile);

    useFetchFiles.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: mockFiles.list,
      refetchData,
    });
  });

  it('should render a Table skeleton when the api call is not done yet', () => {
    useFetchFiles.mockReturnValue({
      status: StatusTypes.LOADING,
    });

    const component = customRender(<Table />);

    expect(component.getByTestId('files-list-table-skeleton')).toBeInTheDocument();
  });

  it('should render a Table when the api call succeeds', () => {
    const component = customRender(<Table />);

    expect(component.getByTestId('file-list-table')).toBeInTheDocument();
  });

  it('should render an error message when the api call fails', () => {
    useFetchFiles.mockReturnValue({
      status: StatusTypes.ERROR,
      error: new Error('401 Unauthorized!'),
    });

    const component = renderComponent();

    expect(component.getByTestId('error-message')).toBeInTheDocument();
  });

  it('should call fileViewer.show() when user right-clicks on a file and selects Open', () => {
    const component = renderComponent();

    fireEvent.contextMenu(component.getByTestId('backup.sh'));
    userEvent.click(component.getByTestId('open'));

    expect(show).toBeCalledWith({ remote, folderPath: '', fileName: 'backup.sh' });
  });

  it('should redirect the user to the correct route when user right-clicks on a directory and selects Open', () => {
    const component = renderComponent();

    fireEvent.contextMenu(component.getByTestId('Documents'));
    userEvent.click(component.getByTestId('open'));

    // Check that user went to the correct page
    const expectedPath = `/files/${hashRemotePath(`${remote}:Documents`)}`;
    expect(component.history.location.pathname).toEqual(expectedPath);
  });

  it('should download the file when user right-clicks on a file and selects Download', () => {
    const component = renderComponent();

    fireEvent.contextMenu(component.getByTestId('backup.sh'));
    userEvent.click(component.getByTestId('download'));

    expect(downloadFile).toHaveBeenCalledWith(
      expect.objectContaining({
        folderPath: '',
        name: 'backup.sh',
        remote: 'gdrive',
      })
    );
  });

  it('should delete the file when user right-clicks on a file and selects Delete', () => {
    const component = renderComponent();

    fireEvent.contextMenu(component.getByTestId('backup.sh'));
    userEvent.click(component.getByTestId('delete'));

    expect(deleteFile).toHaveBeenCalledWith(
      expect.objectContaining({
        folderPath: '',
        name: 'backup.sh',
        remote: 'gdrive',
      })
    );
  });

  it('should copy the file when user right-clicks on a file and selects Copy', () => {
    const component = renderComponent();

    fireEvent.contextMenu(component.getByTestId('backup.sh'));
    userEvent.click(component.getByTestId('copy'));

    expect(copyFile).toHaveBeenCalledWith(
      expect.objectContaining({
        folderPath: '',
        name: 'backup.sh',
        remote: 'gdrive',
      })
    );
  });

  it('should rename the file when user right-clicks on the file and selects Rename', () => {
    const component = renderComponent();

    fireEvent.contextMenu(component.getByTestId('backup.sh'));
    userEvent.click(component.getByTestId('rename'));

    expect(renameFile).toHaveBeenCalledWith(
      expect.objectContaining({
        folderPath: '',
        name: 'backup.sh',
        remote: 'gdrive',
      })
    );
  });

  it('should move the file and refetch the data when user right-clicks on a file and selects Move', () => {
    const component = renderComponent();

    fireEvent.contextMenu(component.getByTestId('backup.sh'));
    userEvent.click(component.getByTestId('move'));

    expect(moveFile).toHaveBeenCalledWith(
      expect.objectContaining({
        folderPath: '',
        name: 'backup.sh',
        remote: 'gdrive',
      })
    );
  });

  const renderComponent = () => {
    const route = `/files/${hashRemotePath('gdrive:')}`;
    const component = (
      <Switch>
        <Route path="/files/:id">
          <Table remote={remote} path="" />
        </Route>
      </Switch>
    );

    return customRender(component, {}, { route });
  };
});