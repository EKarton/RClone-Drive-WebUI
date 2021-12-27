import LoginPage from 'pages/LoginPage';
import RCloneClient from 'utils/RCloneClient';
import { customRender, userEvent, waitFor } from 'test-utils/react';

jest.mock('utils/RCloneClient');

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
    const component = customRender(<LoginPage />);

    userEvent.type(component.getByTestId('endpoint-field'), 'http://localhost:5572');
    userEvent.type(component.getByTestId('username-field'), 'admin');
    userEvent.type(component.getByTestId('password-field'), '1234');

    userEvent.click(component.getByTestId('login-button'));

    await waitFor(() => {
      expect(component.history.location.pathname).toEqual('/files');
    });
  });

  it('should go to the redirect_path when user enters rclone info and clicks Login', async () => {
    const redirectPath = '/files/T25lZHJpdmU6';
    const route = `/login?redirect_path=${redirectPath}`;
    const component = customRender(<LoginPage />, {}, { route });

    userEvent.type(component.getByTestId('endpoint-field'), 'http://localhost:5572');
    userEvent.type(component.getByTestId('username-field'), 'admin');
    userEvent.type(component.getByTestId('password-field'), '1234');

    userEvent.click(component.getByTestId('login-button'));

    await waitFor(() => {
      expect(component.history.location.pathname).toEqual(redirectPath);
    });
  });

  it('should show an error message when when user enters rclone info and rclone throws an error', async () => {
    fetchRemotes.mockRejectedValue(new Error('Wrong credentials'));

    const component = customRender(<LoginPage />);

    userEvent.type(component.getByTestId('endpoint-field'), 'http://localhost:5572');
    userEvent.type(component.getByTestId('username-field'), 'admin');
    userEvent.type(component.getByTestId('password-field'), '1234');

    userEvent.click(component.getByTestId('login-button'));

    await waitFor(() => {
      expect(component.getByText('Wrong credentials')).toBeInTheDocument();
    });
  });
});
