import { renderHook } from '@testing-library/react-hooks';
import FileSaver from 'file-saver';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import useFileDownloader from '../useFileDownloader';

jest.mock('hooks/rclone/useRCloneClient');
jest.mock('file-saver');

describe('useFileDownloader()', () => {
  const fetchFileContents = jest.fn().mockResolvedValue();

  beforeEach(() => {
    useRCloneClient.mockReturnValue({
      fetchFileContents,
    });
  });

  it('should RCloneClient.fetchFileContents() and FileSaver.saveAs correctly', async () => {
    fetchFileContents.mockResolvedValue({
      data: '1234',
      headers: { 'content-type': 'application/json' },
    });

    const file = {
      remote: 'gdrive',
      dirPath: 'Pictures',
      name: 'dog.png',
      isDirectory: false,
    };

    const { result } = renderHook(() => useFileDownloader());
    await result.current(file);

    expect(fetchFileContents).toBeCalledWith('gdrive', 'Pictures', 'dog.png');
    expect(FileSaver.saveAs).toBeCalled();
  });
});
