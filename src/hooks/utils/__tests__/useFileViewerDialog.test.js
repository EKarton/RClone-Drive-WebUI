import { renderHook } from '@testing-library/react-hooks';
import { FileViewerDialogProvider } from 'contexts/FileViewerDialog/index';
import { RCloneInfoProvider } from 'contexts/RCloneInfo/index';
import useFileViewerDialog from '../useFileViewerDialog';

describe('useFileViewerDialog', () => {
  it('should not throw an error and return a show() function given it is wrapped in FileViewerDialogProvider', () => {
    const { result } = renderHook(() => useFileViewerDialog(), {
      wrapper: Wrapper,
    });

    expect(typeof result.current.show).toBe('function');
  });

  it('should throw an error given it is not wrapped in FileViewerDialogProvider', () => {
    const { result } = renderHook(() => useFileViewerDialog());

    expect(result.error).toBeInstanceOf(Error);
  });

  const Wrapper = ({ children }) => {
    const rCloneInfo = {
      endpoint: 'http://localhost:5572',
      username: 'local',
      password: '1234',
    };

    return (
      <RCloneInfoProvider defaultState={rCloneInfo}>
        <FileViewerDialogProvider>{children}</FileViewerDialogProvider>
      </RCloneInfoProvider>
    );
  };
});
