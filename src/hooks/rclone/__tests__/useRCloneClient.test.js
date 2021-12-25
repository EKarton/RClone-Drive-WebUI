import useRCloneClient, { MissingRCloneInfoError } from 'hooks/rclone/useRCloneClient';
import useRCloneInfo from '../useRCloneInfo';

jest.mock('../useRCloneInfo');

const emptyRCloneInfo = {
  endpoint: undefined,
  username: undefined,
  password: undefined,
};

const filledRCloneInfo = {
  endpoint: 'http://localhost:5572',
  username: 'admin',
  password: '1234',
};

describe('useRCloneClient', () => {
  it('should throw an error when there is no rclone info', () => {
    useRCloneInfo.mockReturnValue({ rCloneInfo: emptyRCloneInfo });

    expect(() => useRCloneClient()).toThrowError(MissingRCloneInfoError);
  });

  it('should return the same RClone info when there is rclone info', () => {
    useRCloneInfo.mockReturnValue({ rCloneInfo: filledRCloneInfo });

    const client1 = useRCloneClient();
    const client2 = useRCloneClient();

    expect(client1 === client2).toBeTruthy();
  });
});
