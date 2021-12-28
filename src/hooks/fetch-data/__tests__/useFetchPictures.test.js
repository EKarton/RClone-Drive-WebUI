import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { StatusTypes } from 'utils/constants';
import { mockPictures } from 'test-utils/mock-responses';
import { waitFor } from 'test-utils/react';
import useFetchPictures from '../useFetchPictures';

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

    await waitFor(() => expect(result.current.status).toEqual(StatusTypes.SUCCESS));
    await waitFor(() => expect(result.current.data).toEqual(mockPictures.list));
    await waitFor(() => {
      expect(rCloneClient.fetchPictures).toBeCalledWith('gdrive', 'Pictures', {
        cancelToken: expect.any(axios.CancelToken),
      });
    });
  });
});
