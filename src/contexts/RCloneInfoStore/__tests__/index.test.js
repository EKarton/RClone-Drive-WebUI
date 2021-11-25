import { store, actionTypes, RCloneInfoStateProvider } from 'contexts/RCloneInfoStore';
import { useContext, useEffect } from 'react';
import { render } from 'test-utils/react';

describe('RCloneInfoStateProvider', () => {
  it('should call localStorage.setItem() correctly when endpoint, username, and password changes', () => {
    const MockComponent = () => {
      const { dispatch } = useContext(store);

      useEffect(() => {
        dispatch({ type: actionTypes.SET_ENDPOINT, payload: 'google.com' });
        dispatch({ type: actionTypes.SET_USERNAME, payload: 'admin' });
        dispatch({ type: actionTypes.SET_PASSWORD, payload: '1234' });
      }, [dispatch]);

      return null;
    };

    render(
      <RCloneInfoStateProvider>
        <MockComponent />
      </RCloneInfoStateProvider>
    );

    expect(localStorage.getItem('endpoint')).toEqual('google.com');
    expect(localStorage.getItem('username')).toEqual('admin');
    expect(localStorage.getItem('password')).toEqual('1234');
  });
});
