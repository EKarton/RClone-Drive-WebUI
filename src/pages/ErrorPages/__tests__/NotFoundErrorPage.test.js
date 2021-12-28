import axios from 'axios';
import { mockErrorStackTrace } from 'test-utils/mock-error';
import { customRender, waitFor } from 'test-utils/react';
import NotFoundErrorPage from '../NotFoundErrorPage';

jest.mock('axios');

describe('NotFoundErrorPage', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: { message: 'https://dogs.com/image/1' },
    });
  });

  it('should match snapshot given api call succeeds', async () => {
    const error = mockErrorStackTrace(new Error('Random error'));
    const { baseElement } = customRender(
      <NotFoundErrorPage
        error={error}
        redirectText="Go back to my files"
        redirectLink="/files"
      />
    );

    await waitFor(() => {
      expect(axios.get).toBeCalledWith('https://dog.ceo/api/breeds/image/random');
    });
    expect(baseElement).toMatchSnapshot();
  });
});
