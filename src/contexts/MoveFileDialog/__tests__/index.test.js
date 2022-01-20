import { useState } from 'react';
import useFetchRemotes from 'hooks/fetch-data/useFetchRemotes';
import useFileMover from 'hooks/rclone/useFileMover';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import useMoveFileDialog from 'hooks/utils/useMoveFileDialog';
import { StatusTypes } from 'utils/constants';
import { mockFiles, mockRemotes } from 'test-utils/mock-responses';
import { render, userEvent, fireEvent, screen } from 'test-utils/react';
import { waitForElementToBeRemoved } from 'test-utils/react';
import { MoveFileDialogProvider } from '../index';

jest.mock('hooks/fetch-data/useFetchRemotes');
jest.mock('hooks/rclone/useRCloneClient');
jest.mock('hooks/rclone/useFileMover');

describe('MoveFileDialog', () => {
  const subFolders = mockFiles.list.filter((item) => item.IsDir);

  const moveFolder = jest.fn();
  const moveFile = jest.fn();
  const fetchSubFolders = jest.fn();

  beforeEach(() => {
    moveFolder.mockResolvedValue();
    moveFile.mockResolvedValue();
    fetchSubFolders.mockResolvedValue(subFolders);

    useFileMover.mockReturnValue({
      moveFolder,
      moveFile,
    });

    useRCloneClient.mockReturnValue({
      fetchSubFolders,
    });

    useFetchRemotes.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: mockRemotes.remotes,
    });
  });

  it('should open dialog, call moveFile(), and close dialog when user moves a file', async () => {
    renderComponent({
      remote: 'googledrive',
      dirPath: 'Pictures',
      name: 'dog.png',
      isDirectory: false,
    });

    userEvent.click(screen.getByText('Move'));

    await screen.findByTestId('move-file-dialog');
    await screen.findByText('googledrive');

    fireEvent.click(screen.getByText('googledrive'));
    userEvent.click(screen.getByTestId('ok-button'));

    await waitForElementToBeRemoved(() => screen.queryByTestId('move-file-dialog'));

    await screen.findByText('File moved!');
    expect(moveFile).toBeCalledWith(
      { remote: 'googledrive', dirPath: 'Pictures', name: 'dog.png' },
      { remote: 'googledrive', dirPath: '', name: 'dog.png' }
    );
  });

  it('should call moveFolder() when user moves a directory', async () => {
    renderComponent({
      remote: 'googledrive',
      dirPath: 'Pictures',
      name: '2021',
      isDirectory: true,
    });

    userEvent.click(screen.getByText('Move'));

    await screen.findByTestId('move-file-dialog');
    await screen.findByText('googledrive');

    fireEvent.click(screen.getByText('googledrive'));
    userEvent.click(screen.getByTestId('ok-button'));

    await waitForElementToBeRemoved(() => screen.queryByTestId('move-file-dialog'));

    await screen.findByText('File moved!');
    expect(moveFolder).toBeCalledWith(
      { remote: 'googledrive', dirPath: 'Pictures', name: '2021' },
      { remote: 'googledrive', dirPath: '', name: '2021' }
    );
  });

  it('should close the dialog and not call moveFile() or moveFolder() when user opens the dialog and clicks cancel', async () => {
    renderComponent({
      remote: 'googledrive',
      dirPath: 'Pictures',
      name: '2021',
      isDirectory: true,
    });

    userEvent.click(screen.getByText('Move'));

    await screen.findByTestId('move-file-dialog');
    await screen.findByText('googledrive');

    fireEvent.click(screen.getByText('googledrive'));
    userEvent.click(screen.getByTestId('cancel-button'));

    await waitForElementToBeRemoved(() => screen.queryByTestId('move-file-dialog'));

    await screen.findByText('File move aborted');

    expect(moveFolder).not.toBeCalled();
    expect(moveFile).not.toBeCalled();
  });

  it('should throw an exception when moveFolder() or moveFile() throws an error', async () => {
    moveFolder.mockRejectedValue(new Error('Random error'));
    moveFile.mockRejectedValue(new Error('Random error'));

    renderComponent({
      remote: 'googledrive',
      dirPath: 'Pictures',
      name: '2021',
      isDirectory: true,
    });

    userEvent.click(screen.getByText('Move'));

    await screen.findByTestId('move-file-dialog');
    await screen.findByText('googledrive');

    fireEvent.click(screen.getByText('googledrive'));
    userEvent.click(screen.getByTestId('ok-button'));

    await screen.findByText('File move aborted');
  });

  const renderComponent = (fileToMove) => {
    return render(
      <MoveFileDialogProvider>
        <MockPage fileToMove={fileToMove} />
      </MoveFileDialogProvider>
    );
  };

  const MockPage = ({ fileToMove }) => {
    const moveFileDialog = useMoveFileDialog();
    const [text, setText] = useState('');

    const handleClick = () => {
      moveFileDialog
        .moveFile(fileToMove)
        .then(() => setText('File moved!'))
        .catch(() => setText('File move aborted'));
    };

    return (
      <>
        <button onClick={handleClick}>Move</button>
        <div>{text}</div>
      </>
    );
  };
});
