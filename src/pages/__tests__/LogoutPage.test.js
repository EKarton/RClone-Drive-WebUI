import useRCloneInfo from 'hooks/rclone/useRCloneInfo';
import LogoutPage from 'pages/LogoutPage';
import { customRender, waitFor, screen } from 'test-utils/react';
import { useLocation } from 'react-router-dom';

jest.mock('hooks/rclone/useRCloneInfo');

describe('LogoutPage', () => {
  const clearRCloneInfoFn = jest.fn();

  beforeEach(() => {
    useRCloneInfo.mockReturnValue({
      clearRCloneInfo: clearRCloneInfoFn,
    });
  });

  it('should render page correctly, clearRCloneInfo(), redirect user to home page', async () => {
    const { baseElement } = customRender(
      <>
        <LogoutPage />
        <LocationDisplay />
      </>
    );

    expect(baseElement).toMatchSnapshot();
    await waitFor(() => expect(clearRCloneInfoFn).toBeCalled());
    await waitFor(() => {
      expect(screen.getByTestId('location-display')).toHaveTextContent('/');
    });
  });
});

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
}
