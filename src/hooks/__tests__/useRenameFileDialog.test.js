import { renderHook } from '@testing-library/react-hooks';
import { FileRenamerProvider } from 'contexts/RenameFileDialog/index';
import useRenameFileDialog from '../useRenameFileDialog';

jest.mock('hooks/rclone/useRCloneClient');

describe('useRenameFileDialog()', () => {
  it('should return a method for renaming files', () => {
    const { result } = renderHook(() => useRenameFileDialog(), {
      wrapper: FileRenamerProvider,
    });

    expect(typeof result.current.renameFile).toBe('function');
  });
});
