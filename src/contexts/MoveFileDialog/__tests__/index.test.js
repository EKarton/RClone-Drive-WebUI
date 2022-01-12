import { useState } from 'react';
import useFetchRemotes from 'hooks/fetch-data/useFetchRemotes';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import useMoveFileDialog from 'hooks/utils/useMoveFileDialog';
import { StatusTypes } from 'utils/constants';
import { mockFiles, mockRemotes } from 'test-utils/mock-responses';
import { render, userEvent, fireEvent, screen } from 'test-utils/react';
import { waitForElementToBeRemoved } from 'test-utils/react';
import { MoveFileDialogProvider } from '../index';

jest.mock('hooks/fetch-data/useFetchRemotes');
jest.mock('hooks/rclone/useRCloneClient');

describe('MoveFileDialog', () => {
  const subFolders = mockFiles.list.filter((item) => item.IsDir);
  const move = jest.fn();
  const moveFile = jest.fn();
  const fetchSubFolders = jest.fn();
  const deleteDirectory = jest.fn();

  beforeEach(() => {
    move.mockResolvedValue();
    moveFile.mockResolvedValue();
    deleteDirectory.mockResolvedValue();
    fetchSubFolders.mockResolvedValue(subFolders);

    useFetchRemotes.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: mockRemotes.remotes,
    });

    useRCloneClient.mockReturnValue({
      move,
      moveFile,
      deleteDirectory,
      fetchSubFolders,
    });
  });

  it('should open dialog, call RCloneClient.moveFile(), and close dialog when user opens the dialog, selects a dir path, and clicks ok', async () => {
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
      { remote: 'googledrive', dirPath: 'Pictures', fileName: 'dog.png' },
      { remote: 'googledrive', dirPath: '', fileName: 'dog.png' }
    );
  });

  it('should call RCloneClient.move() and not RCloneClient.deleteDirectory() when user moves a directory in the same remote', async () => {
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
    expect(move).toBeCalledWith(
      { remote: 'googledrive', dirPath: 'Pictures', fileName: '2021' },
      { remote: 'googledrive', dirPath: '', fileName: '2021' },
      true,
      true
    );
    expect(deleteDirectory).not.toBeCalled();
  });

  it('should call RCloneClient.move() and RCloneClient.deleteDirectory() when user moves a directory in the different remote', async () => {
    renderComponent({
      remote: 'googledrive',
      dirPath: 'Pictures',
      name: '2021',
      isDirectory: true,
    });

    userEvent.click(screen.getByText('Move'));

    await screen.findByTestId('move-file-dialog');
    await screen.findByText('onedrive');

    fireEvent.click(screen.getByText('onedrive'));
    userEvent.click(screen.getByTestId('ok-button'));

    await waitForElementToBeRemoved(() => screen.queryByTestId('move-file-dialog'));

    await screen.findByText('File moved!');
    expect(move).toBeCalledWith(
      { remote: 'googledrive', dirPath: 'Pictures', fileName: '2021' },
      { remote: 'onedrive', dirPath: '', fileName: '2021' },
      true,
      true
    );
    expect(deleteDirectory).toBeCalledWith('googledrive', 'Pictures', '2021');
  });

  it('should close the dialog and not call RCloneClient when user opens the dialog and clicks cancel', async () => {
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

    expect(move).not.toBeCalled();
    expect(moveFile).not.toBeCalled();
  });

  it('should throw an exception when RClone throws an error', async () => {
    move.mockRejectedValue(new Error('Random error'));

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
