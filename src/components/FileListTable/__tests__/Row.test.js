import { customRender, userEvent, fireEvent } from 'test-utils/react';
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
    const component = customRender(<Row file={file} />);

    fireEvent.contextMenu(component.getByTestId('Screenshots'));

    expect(component.baseElement).toMatchSnapshot();

    // Derived from https://stackoverflow.com/questions/55030879/how-to-trigger-onclose-for-react-ui-menu-with-react-testing-libray
    fireEvent.click(component.getByRole('presentation').firstChild);

    expect(component.baseElement).toMatchSnapshot();
  });

  it('should match snapshot when user loses focus on the row', () => {
    const component = customRender(<Row file={file} />);

    fireEvent.click(component.getByRole('row'));
    fireEvent.focusOut(component.getByRole('row'));

    expect(component.baseElement).toMatchSnapshot();
  });

  it('should call onFileOpen() when user double-clicks on the row', () => {
    const handleOpen = jest.fn();
    const component = customRender(<Row file={file} onFileOpen={handleOpen} />);

    userEvent.dblClick(component.getByRole('row'));

    expect(handleOpen).toBeCalled();
  });

  it('should call onFileOpen() when user right-clicks on the row and selects Open', () => {
    const handleOpen = jest.fn();
    const component = customRender(<Row file={file} onFileOpen={handleOpen} />);

    fireEvent.contextMenu(component.getByRole('row'));
    userEvent.click(component.getByText('Open'));

    expect(handleOpen).toBeCalled();
  });

  it('should call onFileRename() when user right-clicks on the row and selects Rename', () => {
    const handleRename = jest.fn();
    const component = customRender(<Row file={file} onFileRename={handleRename} />);

    fireEvent.contextMenu(component.getByRole('row'));
    userEvent.click(component.getByText('Rename'));

    expect(handleRename).toBeCalled();
  });

  it('should call onFileCopy() when user right-clicks on the row and selects Copy', () => {
    const handleCopy = jest.fn();
    const component = customRender(<Row file={file} onFileCopy={handleCopy} />);

    fireEvent.contextMenu(component.getByRole('row'));
    userEvent.click(component.getByText('Copy'));

    expect(handleCopy).toBeCalled();
  });

  it('should call onFileDelete() when user right-clicks on the row and selects Delete', () => {
    const handleDelete = jest.fn();
    const component = customRender(<Row file={file} onFileDelete={handleDelete} />);

    fireEvent.contextMenu(component.getByRole('row'));
    userEvent.click(component.getByText('Delete'));

    expect(handleDelete).toBeCalled();
  });

  it('should call onFileDownload() when user right-clicks on the row and selects Download', () => {
    const handleDownload = jest.fn();
    const component = customRender(<Row file={file} onFileDownload={handleDownload} />);

    fireEvent.contextMenu(component.getByRole('row'));
    userEvent.click(component.getByText('Download'));

    expect(handleDownload).toBeCalled();
  });

  it('should call onFileMove() when user right-clicks on the row and selects Move', () => {
    const handleMove = jest.fn();
    const component = customRender(<Row file={file} onFileMove={handleMove} />);

    fireEvent.contextMenu(component.getByRole('row'));
    userEvent.click(component.getByText('Move to'));

    expect(handleMove).toBeCalled();
  });
});
