import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from 'test-utils/react';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { mockPictures } from 'test-utils/mock-responses';
import { StatusTypes } from 'utils/constants';
import useFetchPictures from '../useFetchPictures';
import axios from 'axios';

jest.mock('hooks/rclone/useRCloneClient');

describe('useFetchPictures()', () => {
  const rCloneClient = {
    fetchPictures: jest.fn(),
  };

  beforeEach(() => {
    useRCloneClient.mockReturnValue(rCloneClient);
  });

  it('should return values and call rCloneClient.fetchPictures() correctly', async () => {
    rCloneClient.fetchPictures.mockResolvedValue(mockPictures.list);

    const { result } = renderHook(() => useFetchPictures('gdrive', 'Pictures'));

    await waitFor(() => {
      expect(result.current.status).toEqual(StatusTypes.SUCCESS);
      expect(result.current.data).toEqual(mockPictures.list);
      expect(rCloneClient.fetchPictures).toBeCalledWith('gdrive', 'Pictures', {
        cancelToken: expect.any(axios.CancelToken),
      });
    });
  });
});
