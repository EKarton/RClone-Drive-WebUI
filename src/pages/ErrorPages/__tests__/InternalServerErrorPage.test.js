import axios from 'axios';
import { mockErrorStackTrace } from 'test-utils/mock-error';
import { render, userEvent, waitFor, screen } from 'test-utils/react';
import InternalErrorPage from '../InternalServerErrorPage';

jest.mock('axios');

describe('InternalServerErrorPage', () => {
  const { location } = window;

  beforeEach(() => {
    delete window.location;
    window.location = { reload: jest.fn() };

    axios.get.mockResolvedValue({
      data: [{ url: 'https://cats.com/image/1' }],
    });
  });

  afterEach(() => {
    window.location = location;
  });

  it('should match snapshot given api call succeeds', async () => {
    const error = mockErrorStackTrace(new Error('Random error'));
    const { baseElement } = render(<InternalErrorPage error={error} />);

    expect(axios.get).toBeCalledWith('https://api.thecatapi.com/v1/images/search');
    expect(baseElement).toMatchSnapshot();
  });

  it('should reload the page when user clicks on the button', async () => {
    const error = mockErrorStackTrace(new Error('Random error'));
    render(<InternalErrorPage error={error} />);

    userEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(window.location.reload).toHaveBeenCalled());
  });
});
