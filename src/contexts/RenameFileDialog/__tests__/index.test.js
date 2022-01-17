import { useContext, useState } from 'react';
import useFileRenamer from 'hooks/rclone/useFileRenamer';
import { render, userEvent, fireEvent, screen } from 'test-utils/react';
import { waitForElementToBeRemoved } from 'test-utils/react';
import { RenameFileDialogContext, RenameFileDialogProvider } from '../index';

jest.mock('hooks/rclone/useFileRenamer');

describe('RenameFileDialogProvider', () => {
  const renameFolder = jest.fn();
  const renameFile = jest.fn();

  beforeEach(() => {
    renameFolder.mockResolvedValue();
    renameFile.mockResolvedValue();

    useFileRenamer.mockReturnValue({
      renameFolder,
      renameFile,
    });
  });

  it('should open the dialog, call RCloneClient correctly, and close the dialog when user opens the dialog and renames a file', async () => {
    renderComponent({
      remote: 'gdrive',
      dirPath: 'Pictures',
      name: 'dog.png',
      isDirectory: false,
    });

    userEvent.click(screen.getByText('Rename'));

    await screen.findByTestId('rename-file-dialog');

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'cat.png' } });
    userEvent.click(screen.getByTestId('ok'));

    await waitForElementToBeRemoved(() => screen.queryByTestId('rename-file-dialog'));

    await screen.findByText('File renamed!');
    expect(renameFile).toBeCalledWith('gdrive', 'Pictures', 'dog.png', 'cat.png');
  });

  it('should open the dialog, call RCloneClient correctly, and close the dialog when user opens the dialog and renames a folder', async () => {
    renderComponent({
      remote: 'gdrive',
      dirPath: 'Pictures',
      name: '2021',
      isDirectory: true,
    });

    userEvent.click(screen.getByText('Rename'));

    await screen.findByTestId('rename-file-dialog');

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '2022' } });
    userEvent.click(screen.getByTestId('ok'));

    await waitForElementToBeRemoved(() => screen.queryByTestId('rename-file-dialog'));

    await screen.findByText('File renamed!');
    expect(renameFolder).toBeCalledWith('gdrive', 'Pictures', '2021', '2022');
  });

  it('should close the dialog when user opens the dialog and clicks on the Cancel button', async () => {
    renderComponent({
      remote: 'gdrive',
      dirPath: 'Pictures',
      name: '2021',
      isDirectory: true,
    });

    userEvent.click(screen.getByText('Rename'));

    await screen.findByTestId('rename-file-dialog');
    userEvent.click(screen.getByTestId('cancel'));

    await waitForElementToBeRemoved(() => screen.queryByTestId('rename-file-dialog'));

    await screen.findByText('File rename aborted');
    expect(renameFile).not.toBeCalled();
    expect(renameFolder).not.toBeCalled();
  });

  it('should throw an exception when RClone throws an exception', async () => {
    renameFolder.mockRejectedValue(new Error('Random error'));

    renderComponent({
      remote: 'gdrive',
      dirPath: 'Pictures',
      name: '2021',
      isDirectory: true,
    });

    userEvent.click(screen.getByText('Rename'));

    await screen.findByTestId('rename-file-dialog');

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '2022' } });
    userEvent.click(screen.getByTestId('ok'));

    await screen.findByText('File rename aborted');
  });

  const renderComponent = (fileToRename) => {
    return render(
      <RenameFileDialogProvider>
        <MockPage fileToRename={fileToRename} />
      </RenameFileDialogProvider>
    );
  };

  const MockPage = ({ fileToRename }) => {
    const renameFileDialog = useContext(RenameFileDialogContext);
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
