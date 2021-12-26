import { act, renderHook } from '@testing-library/react-hooks';
import { RCloneInfoProvider } from 'contexts/RCloneInfo';
import { waitFor } from 'test-utils/react';
import useRCloneInfo from '../useRCloneInfo';

describe('useRCloneInfo', () => {
  const wrapper = ({ children }) => <RCloneInfoProvider>{children}</RCloneInfoProvider>;

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
