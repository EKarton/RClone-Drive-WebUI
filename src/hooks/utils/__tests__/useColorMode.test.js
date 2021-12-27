import { renderHook } from '@testing-library/react-hooks';
import { ColorModeProvider } from 'contexts/ColorMode/index';
import useColorMode from '../useColorMode';

describe('useColorMode()', () => {
  it('should return an object given hook is wrapped in ColorModeProvider', () => {
    const { result } = renderHook(() => useColorMode(), {
      wrapper: ColorModeProvider,
    });

    expect(typeof result.current.mode).toBe('string');
    expect(typeof result.current.setMode).toBe('function');
    expect(typeof result.current.toggleColorMode).toBe('function');
  });

  it('should throw an error given hook is not wrapped in ColorModeProvider', () => {
    const { result } = renderHook(() => useColorMode());

    expect(result.error).toBeInstanceOf(Error);
  });
});
