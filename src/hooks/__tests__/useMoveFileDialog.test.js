import { renderHook } from '@testing-library/react-hooks';
import { FileMoverProvider } from 'contexts/MoveFileDialog/index';
import useMoveFileDialog from '../useMoveFileDialog';

jest.mock('hooks/rclone/useRCloneClient');

describe('useMoveFileDialog()', () => {
  it('should return a method for renaming files', () => {
    const { result } = renderHook(() => useMoveFileDialog(), {
      wrapper: FileMoverProvider,
    });

    expect(typeof result.current.moveFile).toBe('function');
  });
});
