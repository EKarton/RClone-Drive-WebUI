import useRCloneInfo from 'hooks/rclone/useRCloneInfo';
import LogoutPage from 'pages/LogoutPage';
import { customRender } from 'test-utils/react';

jest.mock('hooks/rclone/useRCloneInfo');

describe('LogoutPage', () => {
  const clearRCloneInfoFn = jest.fn();

  beforeEach(() => {
    useRCloneInfo.mockReturnValue({
      clearRCloneInfo: clearRCloneInfoFn,
    });
  });

  it('should render page correctly, clearRCloneInfo(), redirect user to home page', () => {
    const { baseElement, history } = customRender(<LogoutPage />);

    expect(baseElement).toMatchSnapshot();
    expect(clearRCloneInfoFn).toBeCalled();
    expect(history.location.pathname).toEqual('/');
  });
});
