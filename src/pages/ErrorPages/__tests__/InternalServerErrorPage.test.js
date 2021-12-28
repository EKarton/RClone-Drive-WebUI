import axios from 'axios';
import { render, userEvent, waitFor } from 'test-utils/react';
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
    const error = new Error('Random error');
    const { baseElement } = render(<InternalErrorPage error={error} />);

    await waitFor(() => {
      expect(axios.get).toBeCalledWith('https://api.thecatapi.com/v1/images/search');
      expect(baseElement).toMatchSnapshot();
    });
  });

  it('should reload the page when user clicks on the button', async () => {
    const error = new Error('Random error');
    const component = render(<InternalErrorPage error={error} />);

    userEvent.click(component.getByRole('button'));

    await waitFor(() => {
      expect(window.location.reload).toHaveBeenCalled();
    });
  });
});
