import { useContext, useEffect } from 'react';
import { store, actionTypes, RCloneInfoProvider } from 'contexts/RCloneInfo';
import { render } from 'test-utils/react';

describe('RCloneInfoProvider', () => {
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
      <RCloneInfoProvider>
        <MockComponent />
      </RCloneInfoProvider>
    );

    expect(localStorage.getItem('endpoint')).toEqual('google.com');
    expect(localStorage.getItem('username')).toEqual('admin');
    expect(localStorage.getItem('password')).toEqual('1234');
  });
});
