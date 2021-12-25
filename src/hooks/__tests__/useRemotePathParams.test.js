import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import { Router, Route, Switch } from 'react-router';
import useRemotePathParams from 'hooks/useRemotePathParams';

describe('useRemotePathParams()', () => {
  it('should return correct values given url contains remote and full path', () => {
    const wrapper = ({ children }) => {
      const route = '/files/Z2RyaXZlOlBpY3R1cmVzLzIwMjE=';
      const history = createMemoryHistory({ initialEntries: [route] });

      return (
        <Router history={history}>
          <Switch>
            <Route path="/files/:id">{children}</Route>
          </Switch>
        </Router>
      );
    };

    const { result } = renderHook(() => useRemotePathParams(), { wrapper });

    expect(result.current).toEqual({ remote: 'gdrive', path: 'Pictures/2021' });
  });
});
