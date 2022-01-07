import { renderHook } from '@testing-library/react-hooks';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import useFileRemover from '../useFileRemover';

jest.mock('hooks/rclone/useRCloneClient');

describe('useFileRemover()', () => {
  const deleteDirectory = jest.fn().mockResolvedValue();
  const deleteFile = jest.fn().mockResolvedValue();

  beforeEach(() => {
    useRCloneClient.mockReturnValue({
      deleteDirectory,
      deleteFile,
    });
  });

  it('should call RCloneClient.deleteFile() correctly given item to copy is a file', async () => {
    const file = {
      remote: 'gdrive',
      dirPath: 'Pictures',
      name: 'dog.png',
      isDirectory: false,
    };

    const { result } = renderHook(() => useFileRemover());

    await result.current(file);

    expect(deleteFile).toBeCalledWith('gdrive', 'Pictures', 'dog.png');
  });

  it('should call RCloneClient.deleteDirectory() correctly given item to copy is an directory', async () => {
    const file = {
      remote: 'gdrive',
      dirPath: 'Pictures',
      name: '2022',
      isDirectory: true,
    };

    const { result } = renderHook(() => useFileRemover());

    await result.current(file);

    expect(deleteDirectory).toBeCalledWith('gdrive', 'Pictures', '2022');
  });
});
