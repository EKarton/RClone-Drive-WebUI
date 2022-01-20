import { Routes, Route } from 'react-router-dom';
import { BehaviorSubject } from 'rxjs';
import { JobQueueProvider } from 'contexts/JobQueue/index';
import useFileCopier from 'hooks/utils/useFileCopier';
import useFileDownloader from 'hooks/utils/useFileDownloader';
import useFileRemover from 'hooks/utils/useFileRemover';
import useFileViewerDialog from 'hooks/utils/useFileViewerDialog';
import useMoveFileDialog from 'hooks/utils/useMoveFileDialog';
import useRenameFileDialog from 'hooks/utils/useRenameFileDialog';
import { StatusTypes, JobStatus, JobTypes } from 'utils/constants';
import { hashRemotePath } from 'utils/remote-paths-url';
import { customRender, fireEvent, userEvent, screen } from 'test-utils/react';
import useGetFiles from '../hooks/useGetFiles';
import TableSection from '../index';

jest.mock('../hooks/useGetFiles');
jest.mock('hooks/utils/useFileViewerDialog');
jest.mock('hooks/utils/useMoveFileDialog');
jest.mock('hooks/utils/useFileDownloader');
jest.mock('hooks/utils/useFileRemover');
jest.mock('hooks/utils/useFileCopier');
jest.mock('hooks/utils/useRenameFileDialog');

describe('TableSection', () => {
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

    useFileViewerDialog.mockReturnValue({ show });
    useMoveFileDialog.mockReturnValue({ moveFile });
    useRenameFileDialog.mockReturnValue({ renameFile });
    useFileDownloader.mockReturnValue(downloadFile);
    useFileRemover.mockReturnValue(deleteFile);
    useFileCopier.mockReturnValue(copyFile);

    useGetFiles.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: {
        existingFiles: [
          {
            remote,
            dirPath: '',
            path: 'Documents',
            name: 'Documents',
            lastUpdatedTime: '2021-09-28T01:51:05.982Z',
            size: undefined,
            mimeType: undefined,
            isDirectory: true,
            isImage: false,
          },
          {
            remote,
            dirPath: '',
            path: 'backup.sh',
            name: 'backup.sh',
            lastUpdatedTime: '2021-11-14T18:58:44.655Z',
            size: 1110,
            mimeType: 'application/x-sh',
            isDirectory: false,
            isImage: true,
          },
        ],
        uploadingFiles: [
          {
            jobStatus: JobTypes.UPLOAD_FILE,
            status: new BehaviorSubject(JobStatus.ONGOING),
            remote,
            dirPath: '',
            name: '.rclone',
          },
        ],
      },
      refetchData,
    });
  });

  it('should render a Table skeleton when the api call is not done yet', () => {
    useGetFiles.mockReturnValue({
      status: StatusTypes.LOADING,
    });

    renderComponent();

    expect(screen.getByTestId('files-list-table-skeleton')).toBeInTheDocument();
  });

  it('should render a Table when the api call succeeds', () => {
    renderComponent();

    expect(screen.getByTestId('file-list-table')).toBeInTheDocument();
  });

  it('should render a no files illustration when there are no uploading files and no existing files', () => {
    useGetFiles.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: {
        existingFiles: [],
        uploadingFiles: [],
      },
    });

    const { baseElement } = renderComponent();

    expect(baseElement).toMatchSnapshot();
  });

  it('should throw an error when the api call fails', () => {
    useGetFiles.mockReturnValue({
      status: StatusTypes.ERROR,
      error: new Error('401 Unauthorized!'),
    });

    expect(renderComponent).toThrowError();
  });

  it('should call fileViewer.show() when user right-clicks on a file and selects Open', () => {
    renderComponent();

    fireEvent.contextMenu(screen.getByTestId('backup.sh'));
    userEvent.click(screen.getByTestId('open'));

    expect(show).toBeCalledWith({ remote, dirPath: '', fileName: 'backup.sh' });
  });

  it('should redirect the user to the correct route when user right-clicks on a directory and selects Open', () => {
    const view = renderComponent();

    fireEvent.contextMenu(screen.getByTestId('Documents'));
    userEvent.click(screen.getByTestId('open'));

    // Check that user went to the correct page
    const expectedPath = `/files/${hashRemotePath(`${remote}:Documents`)}`;
    expect(view.history.location.pathname).toEqual(expectedPath);
  });

  it('should download the file when user right-clicks on a file and selects Download', () => {
    renderComponent();

    fireEvent.contextMenu(screen.getByTestId('backup.sh'));
    userEvent.click(screen.getByTestId('download'));

    expect(downloadFile).toHaveBeenCalledWith(
      expect.objectContaining({
        dirPath: '',
        name: 'backup.sh',
        remote: 'gdrive',
      })
    );
  });

  it('should delete the file when user right-clicks on a file and selects Delete', () => {
    renderComponent();

    fireEvent.contextMenu(screen.getByTestId('backup.sh'));
    userEvent.click(screen.getByTestId('delete'));

    expect(deleteFile).toHaveBeenCalledWith(
      expect.objectContaining({
        dirPath: '',
        name: 'backup.sh',
        remote: 'gdrive',
      })
    );
  });

  it('should copy the file when user right-clicks on a file and selects Copy', () => {
    renderComponent();

    fireEvent.contextMenu(screen.getByTestId('backup.sh'));
    userEvent.click(screen.getByTestId('copy'));

    expect(copyFile).toHaveBeenCalledWith(
      expect.objectContaining({
        dirPath: '',
        name: 'backup.sh',
        remote: 'gdrive',
      })
    );
  });

  it('should rename the file when user right-clicks on the file and selects Rename', () => {
    renderComponent();

    fireEvent.contextMenu(screen.getByTestId('backup.sh'));
    userEvent.click(screen.getByTestId('rename'));

    expect(renameFile).toHaveBeenCalledWith(
      expect.objectContaining({
        dirPath: '',
        name: 'backup.sh',
        remote: 'gdrive',
      })
    );
  });

  it('should move the file and refetch the data when user right-clicks on a file and selects Move', () => {
    renderComponent();

    fireEvent.contextMenu(screen.getByTestId('backup.sh'));
    userEvent.click(screen.getByTestId('move'));

    expect(moveFile).toHaveBeenCalledWith(
      expect.objectContaining({
        dirPath: '',
        name: 'backup.sh',
        remote: 'gdrive',
      })
    );
  });

  const renderComponent = () => {
    const initialRCloneInfoState = {
      endpoint: 'http://localhost:5572',
      username: 'admin',
      password: '1234',
    };

    const route = `/files/${hashRemotePath('gdrive:')}`;
    const component = (
      <Routes>
        <Route
          path="/files/:id"
          element={
            <JobQueueProvider>
              <TableSection remote={remote} path="" />
            </JobQueueProvider>
          }
        />
      </Routes>
    );

    return customRender(component, { initialRCloneInfoState }, { route });
  };
});
