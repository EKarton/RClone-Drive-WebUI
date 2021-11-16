import { act, renderHook } from '@testing-library/react-hooks';
import { RCloneInfoStateProvider } from 'contexts/RCloneInfoStore';
import { waitFor } from 'test-utils';
import useRCloneInfo from '../useRCloneInfo';

describe('useRCloneInfo', () => {
  const wrapper = ({ children }) => (
    <RCloneInfoStateProvider>{children}</RCloneInfoStateProvider>
  );

  it('should not crash given default store', () => {
    renderHook(() => useRCloneInfo(), { wrapper });
  });

  it('should call dispatch correctly and return correct state when called setRCloneInfo()', async () => {
    const { result } = renderHook(() => useRCloneInfo(), { wrapper });

    const newRCloneInfo = {
      endpoint: 'http://localhost:4000',
      username: 'admin',
      password: '1234',
    };

    act(() => {
      result.current.setRCloneInfo(newRCloneInfo);
    });

    await waitFor(() => {
      expect(result.current.rCloneInfo).toEqual(newRCloneInfo);
    });
  });

  it('should call dispatch correctly and return correct state when called clearRCloneInfo()', async () => {
    const { result } = renderHook(() => useRCloneInfo(), { wrapper });

    act(() => {
      result.current.clearRCloneInfo();
    });

    await waitFor(() => {
      expect(result.current.rCloneInfo).toEqual({});
    });
  });
});
