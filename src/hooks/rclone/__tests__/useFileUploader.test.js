import RCloneClient from 'utils/RCloneClient';
import useFileUploader from '../useFileUploader';
import useRCloneClient from '../useRCloneClient';

jest.mock('../useRCloneClient');

describe('useFileUploader()', () => {
  it('should return the same object when it is called twice', () => {
    const mockRCloneClient = new RCloneClient('http://localhost:5572', 'admin', '1234');
    useRCloneClient.mockReturnValue(mockRCloneClient);

    const client1 = useFileUploader();
    const client2 = useFileUploader();

    expect(client1 === client2).toBeTruthy();
  });
});
