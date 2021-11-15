import LoginPage from 'pages/LoginPage';
import { customRender, userEvent, fireEvent, waitFor, screen } from 'test-utils';
import RCloneClient from 'utils/RCloneClient';

jest.mock('utils/RCloneClient');

describe('LoginPage', () => {
  it('should match snapshot', () => {
    const { baseElement } = customRender(<LoginPage />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should go to the files page when user enters rclone info and clicks Login', async () => {
    // Mock RClone client
    RCloneClient.mockImplementation(() => ({
      fetchRemotes: () => Promise.resolve([]),
    }));

    const component = customRender(<LoginPage />);

    simulateTyping(component.getByTestId('endpoint-field'), 'http://localhost:5572');
    simulateTyping(component.getByTestId('username-field'), 'admin');
    simulateTyping(component.getByTestId('password-field'), '1234');

    userEvent.click(component.getByTestId('login-button'));

    await waitFor(() => {
      expect(component.history.location.pathname).toEqual('/files');
    });
  });

  it('should show an error message when when user enters rclone info and rclone throws an error', async () => {
    // Mock RClone client
    RCloneClient.mockImplementation(() => ({
      fetchRemotes: () => Promise.reject(new Error('Wrong credentials')),
    }));

    const component = customRender(<LoginPage />);

    simulateTyping(component.getByTestId('endpoint-field'), 'http://localhost:5572');
    simulateTyping(component.getByTestId('username-field'), 'admin');
    simulateTyping(component.getByTestId('password-field'), '1234');

    userEvent.click(component.getByTestId('login-button'));

    await waitFor(() => {
      expect(component.getByText('Wrong credentials')).toBeInTheDocument();
    });
  });

  const simulateTyping = (element, inputText) => {
    fireEvent.change(element, { target: { value: inputText } });
  };
});
