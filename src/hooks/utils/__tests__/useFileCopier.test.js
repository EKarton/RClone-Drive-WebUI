import { renderHook } from '@testing-library/react-hooks';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import useFileCopier from '../useFileCopier';

jest.mock('hooks/rclone/useRCloneClient');

describe('useFileCopier()', () => {
  const fetchFiles = jest.fn().mockResolvedValue();
  const mkdir = jest.fn().mockResolvedValue();
  const copyDirectoryContents = jest.fn().mockResolvedValue();
  const copyFile = jest.fn().mockResolvedValue();

  beforeEach(() => {
    useRCloneClient.mockReturnValue({
      fetchFiles,
      mkdir,
      copyDirectoryContents,
      copyFile,
    });
  });

  it('should call RCloneClient.copyFile() correctly given item to copy is a file', async () => {
    const file = {
      remote: 'gdrive',
      dirPath: 'Pictures',
      name: 'dog.png',
      isDirectory: false,
    };

    const { result } = renderHook(() => useFileCopier());

    await result.current(file);

    expect(copyFile).toBeCalledWith(
      { remote: 'gdrive', dirPath: 'Pictures', fileName: 'dog.png' },
      { remote: 'gdrive', dirPath: 'Pictures', fileName: 'Copy of dog.png' }
    );
  });

  it('should call RCloneClient.mkdir() correctly given item to copy is an empty directory', async () => {
    const file = {
      remote: 'gdrive',
      dirPath: 'Pictures',
      name: '2022',
      isDirectory: true,
    };

    fetchFiles.mockResolvedValue([]);

    const { result } = renderHook(() => useFileCopier());

    await result.current(file);

    expect(mkdir).toBeCalledWith('gdrive', 'Pictures/Copy of 2022');
  });

  it('should call RCloneClient.copyDirectoryContents() correctly given item to copy is an empty directory', async () => {
    const file = {
      remote: 'gdrive',
      dirPath: 'Pictures',
      name: '2022',
      isDirectory: true,
    };

    fetchFiles.mockResolvedValue([
      { remote: 'gdrive', dirPath: 'Pictures', fileName: 'dog.png' },
    ]);

    const { result } = renderHook(() => useFileCopier());

    await result.current(file);

    expect(copyDirectoryContents).toBeCalledWith(
      { remote: 'gdrive', dirPath: 'Pictures', fileName: '2022' },
      { remote: 'gdrive', dirPath: 'Pictures', fileName: 'Copy of 2022' },
      true
    );
  });
});
