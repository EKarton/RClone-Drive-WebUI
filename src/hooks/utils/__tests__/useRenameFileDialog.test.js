import { renderHook } from '@testing-library/react-hooks';
import { RenameFileDialogProvider } from 'contexts/RenameFileDialog/index';
import useRenameFileDialog from '../useRenameFileDialog';

jest.mock('hooks/rclone/useRCloneClient');

describe('useRenameFileDialog()', () => {
  it('should return a method for renaming files', () => {
    const { result } = renderHook(() => useRenameFileDialog(), {
      wrapper: RenameFileDialogProvider,
    });

    expect(typeof result.current.renameFile).toBe('function');
  });

  it('should throw an error given it is not wrapped in FileViewerDialogProvider', () => {
    const { result } = renderHook(() => useRenameFileDialog());

    expect(result.error).toBeInstanceOf(Error);
  });
});
