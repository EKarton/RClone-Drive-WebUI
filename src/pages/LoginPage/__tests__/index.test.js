import RCloneClient from 'services/RCloneClient';
import { customRender, userEvent, waitFor, screen } from 'test-utils/react';
import { useLocation } from 'react-router-dom';
import LoginPage from '..';

jest.mock('services/RCloneClient');

describe('LoginPage', () => {
  const fetchRemotes = jest.fn();
  beforeEach(() => {
    fetchRemotes.mockResolvedValue([]);

    RCloneClient.mockImplementation(() => ({
      fetchRemotes,
    }));
  });

  it('should match snapshot', () => {
    const { baseElement } = customRender(<LoginPage />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should go to the files page when user enters rclone info and clicks Login', async () => {
    customRender(
      <>
        <LoginPage />
        <LocationDisplay />
      </>
    );

    userEvent.type(screen.getByTestId('endpoint-field'), 'http://localhost:5572');
    userEvent.type(screen.getByTestId('username-field'), 'admin');
    userEvent.type(screen.getByTestId('password-field'), '1234');

    userEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(screen.getByTestId('location-display')).toHaveTextContent('/files');
    });
  });

  it('should go to the redirect_path when user enters rclone info and clicks Login', async () => {
    const redirectPath = '/files/T25lZHJpdmU6';
    const route = `/login?redirect_path=${redirectPath}`;
    customRender(
      <>
        <LoginPage />
        <LocationDisplay />
      </>,
      {},
      { route }
    );

    userEvent.type(screen.getByTestId('endpoint-field'), 'http://localhost:5572');
    userEvent.type(screen.getByTestId('username-field'), 'admin');
    userEvent.type(screen.getByTestId('password-field'), '1234');

    userEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(screen.getByTestId('location-display')).toHaveTextContent(redirectPath);
    });
  });

  it('should show an error message when when user enters rclone info and rclone throws an error', async () => {
    fetchRemotes.mockRejectedValue(new Error('Wrong credentials'));

    customRender(<LoginPage />);

    userEvent.type(screen.getByTestId('endpoint-field'), 'http://localhost:5572');
    userEvent.type(screen.getByTestId('username-field'), 'admin');
    userEvent.type(screen.getByTestId('password-field'), '1234');

    userEvent.click(screen.getByTestId('login-button'));

    await screen.findByText('Wrong credentials');
  });

  it('should open dialog when user clicks on the Help button', async () => {
    customRender(<LoginPage />);

    userEvent.click(screen.getByText('Help'));

    await screen.findByTestId('login-help-dialog');
  });
});

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
}
