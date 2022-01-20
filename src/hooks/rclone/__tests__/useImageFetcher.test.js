import RCloneClient from 'services/RCloneClient';
import useImageFetcher from '../useImageFetcher';
import useRCloneClient from '../useRCloneClient';

jest.mock('../useRCloneClient');

describe('useImageFetcher()', () => {
  it('should return the same object when it is called twice', () => {
    const mockRCloneClient = new RCloneClient('http://localhost:5572', 'admin', '1234');
    useRCloneClient.mockReturnValue(mockRCloneClient);

    const client1 = useImageFetcher();
    const client2 = useImageFetcher();

    expect(client1 === client2).toBeTruthy();
  });
});
