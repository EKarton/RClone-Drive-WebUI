import useFetchRemotes from 'hooks/fetch-data/useFetchRemotes';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import useMoveFileDialog from 'hooks/utils/useMoveFileDialog';
import { useState } from 'react';
import { mockFiles, mockRemotes } from 'test-utils/mock-responses';
import { render, userEvent, fireEvent, waitFor, screen } from 'test-utils/react';
import { StatusTypes } from 'utils/constants';
import { MoveFileDialogProvider } from '../index';

jest.mock('hooks/fetch-data/useFetchRemotes');
jest.mock('hooks/rclone/useRCloneClient');

describe('MoveFileDialog', () => {
  const subFolders = mockFiles.list.filter((item) => item.IsDir);
  const move = jest.fn();
  const moveFile = jest.fn();
  const fetchSubFolders = jest.fn();

  beforeEach(() => {
    move.mockResolvedValue();
    moveFile.mockResolvedValue();
    fetchSubFolders.mockResolvedValue(subFolders);

    useFetchRemotes.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: mockRemotes.remotes,
    });

    useRCloneClient.mockReturnValue({
      move,
      moveFile,
      fetchSubFolders,
    });
  });

  it('should open dialog, call RCloneClient.moveFile(), and close dialog when user opens the dialog, selects a dir path, and clicks ok', async () => {
    const component = renderComponent({
      remote: 'googledrive',
      folderPath: 'Pictures',
      name: 'dog.png',
      isDirectory: false,
    });

    userEvent.click(component.getByText('Move'));

    await waitFor(() => {
      expect(component.getByTestId('move-file-dialog')).toBeInTheDocument();
      expect(component.getByText('googledrive')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('googledrive'));
    userEvent.click(component.getByTestId('ok-button'));

    await waitFor(() => {
      expect(component.queryByTestId('move-file-dialog')).not.toBeInTheDocument();
      expect(component.queryByText('File moved!')).toBeInTheDocument();
      expect(moveFile).toBeCalledWith(
        { remote: 'googledrive', folderPath: 'Pictures', fileName: 'dog.png' },
        { remote: 'googledrive', folderPath: '', fileName: 'dog.png' }
      );
    });
  });

  it('should call RCloneClient.move() when user moves a directory', async () => {
    const component = renderComponent({
      remote: 'googledrive',
      folderPath: 'Pictures',
      name: '2021',
      isDirectory: true,
    });

    userEvent.click(component.getByText('Move'));

    await waitFor(() => {
      expect(component.getByTestId('move-file-dialog')).toBeInTheDocument();
      expect(component.getByText('googledrive')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('googledrive'));
    userEvent.click(component.getByTestId('ok-button'));

    await waitFor(() => {
      expect(component.queryByTestId('move-file-dialog')).not.toBeInTheDocument();
      expect(component.queryByText('File moved!')).toBeInTheDocument();
      expect(move).toBeCalledWith(
        { remote: 'googledrive', folderPath: 'Pictures', fileName: '2021' },
        { remote: 'googledrive', folderPath: '', fileName: '2021' },
        true,
        false
      );
    });
  });

  it('should close the dialog and not call RCloneClient when user opens the dialog and clicks cancel', async () => {
    const component = renderComponent({
      remote: 'googledrive',
      folderPath: 'Pictures',
      name: '2021',
      isDirectory: true,
    });

    userEvent.click(component.getByText('Move'));

    await waitFor(() => {
      expect(component.getByTestId('move-file-dialog')).toBeInTheDocument();
      expect(component.getByText('googledrive')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('googledrive'));
    userEvent.click(component.getByTestId('cancel-button'));

    await waitFor(() => {
      expect(component.queryByTestId('move-file-dialog')).not.toBeInTheDocument();
      expect(component.queryByText('File move aborted')).toBeInTheDocument();
      expect(move).not.toBeCalled();
      expect(moveFile).not.toBeCalled();
    });
  });

  it('should throw an error when useMoveFileDialog() is used outside of MoveFileDialogProvider', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const MockComponent = () => {
      useMoveFileDialog();
      return <div>Test Component</div>;
    };

    expect(() => render(<MockComponent />)).toThrowError();
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
