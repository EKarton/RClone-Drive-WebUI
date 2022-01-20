import { renderHook } from '@testing-library/react-hooks';
import MoveFileDialog from 'components/MoveFileDialog';
import { MoveFileDialogProvider } from 'contexts/MoveFileDialog';
import useFileMover from 'hooks/rclone/useFileMover';
import useMoveFileDialog from '../useMoveFileDialog';

jest.mock('hooks/rclone/useFileMover');
jest.mock('components/MoveFileDialog');

describe('useMoveFileDialog()', () => {
  beforeEach(() => {
    useFileMover.mockReturnValue({});
    MoveFileDialog.mockReturnValue(null);
  });

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
