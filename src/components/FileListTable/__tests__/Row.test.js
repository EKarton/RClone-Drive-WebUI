import { customRender, userEvent, fireEvent, screen } from 'test-utils/react';
import Row from '../Row';

describe('Row', () => {
  const file = {
    remote: 'gdrive',
    path: 'Pictures/2021',
    name: 'Screenshots',
    isDirectory: true,
    isImage: false,
  };

  it('should match snapshot given a folder', () => {
    const { baseElement } = customRender(<Row file={file} />);

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

    const { baseElement } = customRender(<Row file={mockFile} />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshots when user right clicks and clicks on the row', () => {
    const { baseElement } = customRender(<Row file={file} />);

    fireEvent.contextMenu(screen.getByTestId('Screenshots'));

    expect(baseElement).toMatchSnapshot();

    // Derived from https://stackoverflow.com/questions/55030879/how-to-trigger-onclose-for-react-ui-menu-with-react-testing-libray
    fireEvent.click(screen.getByRole('presentation').firstChild);

    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot when user loses focus on the row', () => {
    const { baseElement } = customRender(<Row file={file} />);

    fireEvent.click(screen.getByRole('row'));
    fireEvent.focusOut(screen.getByRole('row'));

    expect(baseElement).toMatchSnapshot();
  });

  it('should call onFileOpen() when user double-clicks on the row', () => {
    const handleOpen = jest.fn();
    customRender(<Row file={file} onFileOpen={handleOpen} />);

    userEvent.dblClick(screen.getByRole('row'));

    expect(handleOpen).toBeCalled();
  });

  it('should call onFileOpen() when user right-clicks on the row and selects Open', () => {
    const handleOpen = jest.fn();
    customRender(<Row file={file} onFileOpen={handleOpen} />);

    fireEvent.contextMenu(screen.getByRole('row'));
    userEvent.click(screen.getByText('Open'));

    expect(handleOpen).toBeCalled();
  });

  it('should call onFileRename() when user right-clicks on the row and selects Rename', () => {
    const handleRename = jest.fn();
    customRender(<Row file={file} onFileRename={handleRename} />);

    fireEvent.contextMenu(screen.getByRole('row'));
    userEvent.click(screen.getByText('Rename'));

    expect(handleRename).toBeCalled();
  });

  it('should call onFileCopy() when user right-clicks on the row and selects Copy', () => {
    const handleCopy = jest.fn();
    customRender(<Row file={file} onFileCopy={handleCopy} />);

    fireEvent.contextMenu(screen.getByRole('row'));
    userEvent.click(screen.getByText('Copy'));

    expect(handleCopy).toBeCalled();
  });

  it('should call onFileDelete() when user right-clicks on the row and selects Delete', () => {
    const handleDelete = jest.fn();
    customRender(<Row file={file} onFileDelete={handleDelete} />);

    fireEvent.contextMenu(screen.getByRole('row'));
    userEvent.click(screen.getByText('Delete'));

    expect(handleDelete).toBeCalled();
  });

  it('should call onFileDownload() when user right-clicks on the row and selects Download', () => {
    const handleDownload = jest.fn();
    customRender(<Row file={file} onFileDownload={handleDownload} />);

    fireEvent.contextMenu(screen.getByRole('row'));
    userEvent.click(screen.getByText('Download'));

    expect(handleDownload).toBeCalled();
  });

  it('should call onFileMove() when user right-clicks on the row and selects Move', () => {
    const handleMove = jest.fn();
    customRender(<Row file={file} onFileMove={handleMove} />);

    fireEvent.contextMenu(screen.getByRole('row'));
    userEvent.click(screen.getByText('Move to'));

    expect(handleMove).toBeCalled();
  });
});
