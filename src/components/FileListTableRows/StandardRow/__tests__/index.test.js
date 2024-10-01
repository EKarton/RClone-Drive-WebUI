import { render, userEvent, fireEvent, waitFor, screen } from 'test-utils/react';
import StandardRow from '..';

describe('StandardRow', () => {
  const file = {
    remote: 'gdrive',
    path: 'Pictures/2021',
    name: 'Screenshots',
    isDirectory: true,
    isImage: false,
  };

  it('should match snapshot given a folder', () => {
    const { baseElement } = render(<StandardRow file={file} />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot given a file', () => {
    const mockFile = {
      remote: 'gdrive',
      path: 'Documents',
      name: 'report.pdf',
      size: 12345,
      isDirectory: false,
      isImage: false,
    };

    const { baseElement } = render(<StandardRow file={mockFile} />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshots when user right clicks and clicks on the row', () => {
    const { baseElement } = render(<StandardRow file={file} />);

    fireEvent.contextMenu(screen.getByTestId('Screenshots'));

    expect(baseElement).toMatchSnapshot();

    // Derived from https://stackoverflow.com/questions/55030879/how-to-trigger-onclose-for-react-ui-menu-with-react-testing-libray
    fireEvent.click(screen.getByRole('presentation').firstChild);

    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot when user loses focus on the row', () => {
    const { baseElement } = render(<StandardRow file={file} />);

    fireEvent.click(screen.getByRole('row'));
    fireEvent.focusOut(screen.getByRole('row'));

    expect(baseElement).toMatchSnapshot();
  });

  it('should call onFileOpen() when user double-clicks on the row', async () => {
    const handleOpen = jest.fn();
    render(<StandardRow file={file} onFileOpen={handleOpen} />);

    userEvent.dblClick(screen.getByRole('row'));

    await waitFor(() => expect(handleOpen).toBeCalled());
  });

  it('should call onFileOpen() when user right-clicks on the row and selects Open', async () => {
    const handleOpen = jest.fn();
    render(<StandardRow file={file} onFileOpen={handleOpen} />);

    fireEvent.contextMenu(screen.getByRole('row'));
    userEvent.click(screen.getByText('Open'));

    await waitFor(() => expect(handleOpen).toBeCalled());
  });

  it('should call onFileRename() when user right-clicks on the row and selects Rename', async () => {
    const handleRename = jest.fn();
    render(<StandardRow file={file} onFileRename={handleRename} />);

    fireEvent.contextMenu(screen.getByRole('row'));
    userEvent.click(screen.getByText('Rename'));

    await waitFor(() => expect(handleRename).toBeCalled());
  });

  it('should call onFileCopy() when user right-clicks on the row and selects Copy', async () => {
    const handleCopy = jest.fn();
    render(<StandardRow file={file} onFileCopy={handleCopy} />);

    fireEvent.contextMenu(screen.getByRole('row'));
    userEvent.click(screen.getByText('Copy'));

    await waitFor(() => expect(handleCopy).toBeCalled());
  });

  it('should call onFileDelete() when user right-clicks on the row and selects Delete', async () => {
    const handleDelete = jest.fn();
    render(<StandardRow file={file} onFileDelete={handleDelete} />);

    fireEvent.contextMenu(screen.getByRole('row'));
    userEvent.click(screen.getByText('Delete'));

    await waitFor(() => expect(handleDelete).toBeCalled());
  });

  it('should call onFileDownload() when user right-clicks on the row and selects Download', async () => {
    const handleDownload = jest.fn();
    render(<StandardRow file={file} onFileDownload={handleDownload} />);

    fireEvent.contextMenu(screen.getByRole('row'));
    userEvent.click(screen.getByText('Download'));

    await waitFor(() => expect(handleDownload).toBeCalled());
  });

  it('should call onFileMove() when user right-clicks on the row and selects Move', async () => {
    const handleMove = jest.fn();
    render(<StandardRow file={file} onFileMove={handleMove} />);

    fireEvent.contextMenu(screen.getByRole('row'));
    userEvent.click(screen.getByText('Move to'));

    await waitFor(() => expect(handleMove).toBeCalled());
  });
});
