import { useState } from 'react';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import useRenameFileDialog from 'hooks/utils/useRenameFileDialog';
import { render, userEvent, fireEvent, screen } from 'test-utils/react';
import { waitForElementToBeRemoved } from 'test-utils/react';
import { RenameFileDialogProvider } from '../index';

jest.mock('hooks/rclone/useRCloneClient');

describe('RenameFileDialog', () => {
  const move = jest.fn();
  const moveFile = jest.fn();

  beforeEach(() => {
    move.mockResolvedValue();
    moveFile.mockResolvedValue();
    useRCloneClient.mockReturnValue({
      move,
      moveFile,
    });
  });

  it('should open the dialog, call RCloneClient correctly, and close the dialog when user opens the dialog and renames a file', async () => {
    renderComponent({
      remote: 'gdrive',
      folderPath: 'Pictures',
      name: 'dog.png',
      isDirectory: false,
    });

    userEvent.click(screen.getByText('Rename'));

    await screen.findByTestId('rename-file-dialog');

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'cat.png' } });
    userEvent.click(screen.getByTestId('ok'));

    await waitForElementToBeRemoved(() => screen.queryByTestId('rename-file-dialog'));

    await screen.findByText('File renamed!');
    expect(moveFile).toBeCalledWith(
      { remote: 'gdrive', folderPath: 'Pictures', fileName: 'dog.png' },
      { remote: 'gdrive', folderPath: 'Pictures', fileName: 'cat.png' }
    );
  });

  it('should open the dialog, call RCloneClient correctly, and close the dialog when user opens the dialog and renames a folder', async () => {
    renderComponent({
      remote: 'gdrive',
      folderPath: 'Pictures',
      name: '2021',
      isDirectory: true,
    });

    userEvent.click(screen.getByText('Rename'));

    await screen.findByTestId('rename-file-dialog');

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '2022' } });
    userEvent.click(screen.getByTestId('ok'));

    await waitForElementToBeRemoved(() => screen.queryByTestId('rename-file-dialog'));

    await screen.findByText('File renamed!');
    expect(move).toBeCalledWith(
      { remote: 'gdrive', folderPath: 'Pictures', fileName: '2021' },
      { remote: 'gdrive', folderPath: 'Pictures', fileName: '2022' },
      true
    );
  });

  it('should close the dialog when user opens the dialog and clicks on the Cancel button', async () => {
    renderComponent({
      remote: 'gdrive',
      folderPath: 'Pictures',
      name: '2021',
      isDirectory: true,
    });

    userEvent.click(screen.getByText('Rename'));

    await screen.findByTestId('rename-file-dialog');
    userEvent.click(screen.getByTestId('cancel'));

    await waitForElementToBeRemoved(() => screen.queryByTestId('rename-file-dialog'));

    await screen.findByText('File rename aborted');
    expect(move).not.toBeCalled();
    expect(moveFile).not.toBeCalled();
  });

  const renderComponent = (fileToRename) => {
    return render(
      <RenameFileDialogProvider>
        <MockPage fileToRename={fileToRename} />
      </RenameFileDialogProvider>
    );
  };

  const MockPage = ({ fileToRename }) => {
    const renameFileDialog = useRenameFileDialog();
    const [text, setText] = useState('');

    const handleClick = () => {
      renameFileDialog
        .renameFile(fileToRename)
        .then(() => setText('File renamed!'))
        .catch(() => setText('File rename aborted'));
    };

    return (
      <>
        <button onClick={handleClick}>Rename</button>
        <div>{text}</div>
      </>
    );
  };
});
