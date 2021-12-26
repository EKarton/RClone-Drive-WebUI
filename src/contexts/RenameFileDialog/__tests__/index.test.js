import useRCloneClient from 'hooks/rclone/useRCloneClient';
import useRenameFileDialog from 'hooks/useRenameFileDialog';
import { useState } from 'react';
import { render, userEvent, waitFor, fireEvent } from 'test-utils/react';
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
    const component = renderComponent({
      remote: 'gdrive',
      folderPath: 'Pictures',
      name: 'dog.png',
      isDirectory: false,
    });

    userEvent.click(component.getByText('Rename'));

    await waitFor(() => {
      expect(component.getByTestId('rename-file-dialog')).toBeInTheDocument();
    });

    fireEvent.change(component.getByRole('textbox'), { target: { value: 'cat.png' } });
    userEvent.click(component.getByTestId('ok'));

    await waitFor(() => {
      expect(component.queryByTestId('rename-file-dialog')).not.toBeInTheDocument();
      expect(component.queryByText('File renamed!')).toBeInTheDocument();
      expect(moveFile).toBeCalledWith(
        { remote: 'gdrive', folderPath: 'Pictures', fileName: 'dog.png' },
        { remote: 'gdrive', folderPath: 'Pictures', fileName: 'cat.png' }
      );
    });
  });

  it('should open the dialog, call RCloneClient correctly, and close the dialog when user opens the dialog and renames a folder', async () => {
    const component = renderComponent({
      remote: 'gdrive',
      folderPath: 'Pictures',
      name: '2021',
      isDirectory: true,
    });

    userEvent.click(component.getByText('Rename'));

    await waitFor(() => {
      expect(component.getByTestId('rename-file-dialog')).toBeInTheDocument();
    });

    fireEvent.change(component.getByRole('textbox'), { target: { value: '2022' } });
    userEvent.click(component.getByTestId('ok'));

    await waitFor(() => {
      expect(component.queryByTestId('rename-file-dialog')).not.toBeInTheDocument();
      expect(component.queryByText('File renamed!')).toBeInTheDocument();
      expect(move).toBeCalledWith(
        { remote: 'gdrive', folderPath: 'Pictures', fileName: '2021' },
        { remote: 'gdrive', folderPath: 'Pictures', fileName: '2022' },
        true
      );
    });
  });

  it('should close the dialog when user opens the dialog and clicks on the Cancel button', async () => {
    const component = renderComponent({
      remote: 'gdrive',
      folderPath: 'Pictures',
      name: '2021',
      isDirectory: true,
    });

    userEvent.click(component.getByText('Rename'));

    await waitFor(() => {
      expect(component.getByTestId('rename-file-dialog')).toBeInTheDocument();
    });

    userEvent.click(component.getByTestId('cancel'));

    await waitFor(() => {
      expect(component.queryByTestId('rename-file-dialog')).not.toBeInTheDocument();
      expect(component.queryByText('File rename aborted')).toBeInTheDocument();
      expect(move).not.toBeCalled();
      expect(moveFile).not.toBeCalled();
    });
  });

  it('should throw an error when useMoveFileDialog() is used outside of MoveFileDialogProvider', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const MockComponent = () => {
      useRenameFileDialog();
      return <div>Test Component</div>;
    };

    expect(() => render(<MockComponent />)).toThrowError();
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
