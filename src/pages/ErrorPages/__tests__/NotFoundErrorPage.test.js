import axios from 'axios';
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
    const { baseElement } = customRender(
      <NotFoundErrorPage
        error={new Error('Random error')}
        redirectText="Go back to my files"
        redirectLink="/files"
      />
    );

    await waitFor(() => {
      expect(axios.get).toBeCalledWith('https://dog.ceo/api/breeds/image/random');
      expect(baseElement).toMatchSnapshot();
    });
  });
});
