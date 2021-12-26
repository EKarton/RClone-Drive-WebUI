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
});
