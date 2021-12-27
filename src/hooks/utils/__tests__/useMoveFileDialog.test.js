import { renderHook } from '@testing-library/react-hooks';
import { MoveFileDialogProvider } from 'contexts/MoveFileDialog/index';
import useMoveFileDialog from '../useMoveFileDialog';

jest.mock('hooks/rclone/useRCloneClient');

describe('useMoveFileDialog()', () => {
  it('should return a method for renaming files', () => {
    const { result } = renderHook(() => useMoveFileDialog(), {
      wrapper: MoveFileDialogProvider,
    });

    expect(typeof result.current.moveFile).toBe('function');
  });

  it('should throw an error given it is not wrapped in FileViewerDialogProvider', () => {
    const { result } = renderHook(() => useMoveFileDialog());

    expect(result.error).toBeInstanceOf(Error);
  });
});
