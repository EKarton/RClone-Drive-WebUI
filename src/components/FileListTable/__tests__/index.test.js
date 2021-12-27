import { customRender } from 'test-utils/react';
import Row from '../Row';
import FileListTable from '../index';

jest.mock('../Row');

const files = [
  {
    name: 'Documents',
    lastUpdatedTime: '2021-11-01T21:09:05.237Z',
    size: '',
    isDirectory: true,
    isImage: false,
  },
  {
    name: 'Pictures',
    lastUpdatedTime: '2021-09-28T03:39:11.850Z',
    size: '',
    isDirectory: true,
    isImage: false,
  },
];

describe('FileListTable', () => {
  beforeEach(() => {
    Row.mockReturnValue(null);
  });

  it('should match snapshot given files', () => {
    const { baseElement } = customRender(<FileListTable files={files} />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should call onFileOpen() correctly when the Documents row calls onFileOpen()', () => {
    const handleFileOpen = jest.fn();
    Row.mockImplementation(({ file, onFileOpen }) => {
      if (file.name === 'Documents') {
        onFileOpen();
      }
      return null;
    });

    customRender(<FileListTable files={files} onFileOpen={handleFileOpen} />);

    expect(handleFileOpen).toBeCalledWith(files[0]);
  });

  it('should call onFileRename() correctly when a row calls onFileRename()', () => {
    const handleFileRename = jest.fn();
    Row.mockImplementation(({ file, onFileRename }) => {
      if (file.name === 'Documents') {
        onFileRename();
      }
      return null;
    });

    customRender(<FileListTable files={files} onFileRename={handleFileRename} />);

    expect(handleFileRename).toBeCalledWith(files[0]);
  });

  it('should call onFileCopy() correctly when a row calls onFileCopy()', () => {
    const handleFileCopy = jest.fn();
    Row.mockImplementation(({ file, onFileCopy }) => {
      if (file.name === 'Documents') {
        onFileCopy();
      }
      return null;
    });

    customRender(<FileListTable files={files} onFileCopy={handleFileCopy} />);

    expect(handleFileCopy).toBeCalledWith(files[0]);
  });

  it('should call onFileDelete() correctly when a row calls onFileDelete()', () => {
    const handleFileDelete = jest.fn();
    Row.mockImplementation(({ file, onFileDelete }) => {
      if (file.name === 'Documents') {
        onFileDelete();
      }
      return null;
    });

    customRender(<FileListTable files={files} onFileDelete={handleFileDelete} />);

    expect(handleFileDelete).toBeCalledWith(files[0]);
  });

  it('should call onFileDownload() correctly when a row calls onFileDownload()', () => {
    const handleFileDownload = jest.fn();
    Row.mockImplementation(({ file, onFileDownload }) => {
      if (file.name === 'Documents') {
        onFileDownload();
      }
      return null;
    });

    customRender(<FileListTable files={files} onFileDownload={handleFileDownload} />);

    expect(handleFileDownload).toBeCalledWith(files[0]);
  });

  it('should call onFileMove() correctly when a row calls onFileMove()', () => {
    const handleFileMove = jest.fn();
    Row.mockImplementation(({ file, onFileMove }) => {
      if (file.name === 'Documents') {
        onFileMove();
      }
      return null;
    });

    customRender(<FileListTable files={files} onFileMove={handleFileMove} />);

    expect(handleFileMove).toBeCalledWith(files[0]);
  });
});
