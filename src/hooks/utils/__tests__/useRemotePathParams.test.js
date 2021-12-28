import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import { Router, Routes, Route } from 'react-router';
import { hashRemotePath } from 'utils/remote-paths-url';
import useRemotePathParams from '../useRemotePathParams';

describe('useRemotePathParams()', () => {
  it('should return correct values given url contains remote and full path', () => {
    const { result } = renderCustomHook('/files/Z2RyaXZlOlBpY3R1cmVzLzIwMjE=');

    expect(result.current).toEqual({ remote: 'gdrive', path: 'Pictures/2021' });
  });

  it('should throw an error given route is an invalid route', () => {
    const { result } = renderCustomHook('/files/1234');

    expect(result.error).toBeInstanceOf(Error);
  });

  it('should throw an error given route does not contain path', () => {
    const { result } = renderCustomHook(`/files/${hashRemotePath('googledrive')}`);

    expect(result.error).toBeInstanceOf(Error);
  });

  const renderCustomHook = (route) => {
    const wrapper = ({ children }) => {
      const history = createMemoryHistory({ initialEntries: [route] });

      return (
        <Router location={history.location} navigator={history}>
          <Routes>
            <Route path="/files/:id" element={children} />
          </Routes>
        </Router>
      );
    };

    return renderHook(() => useRemotePathParams(), { wrapper });
  };
});
