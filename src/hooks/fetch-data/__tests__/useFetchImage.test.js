import { act, renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import useImageFetcher from 'hooks/rclone/useImageFetcher';
import { StatusTypes } from 'utils/constants';
import { waitFor } from 'test-utils/react';
import useFetchImage from '../useFetchImage';

jest.mock('hooks/rclone/useImageFetcher');

describe('useFetchImage()', () => {
  const image = {
    remote: 'drive',
    dirPath: 'Pictures',
    fileName: 'dog.png',
  };

  const getImage = jest.fn();

  beforeEach(() => {
    getImage.mockReset();
    useImageFetcher.mockReturnValue({ getImage });
  });

  it('should return correct results when api loads and succeeds', async () => {
    // Mimic fetching image takes 10 seconds
    jest.useFakeTimers();

    getImage.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve('1234'), 1000);
      });
    });

    URL.createObjectURL.mockReturnValue('blob://data');

    const { result } = renderHook(() => useFetchImage(image));

    await waitFor(() => expect(result.current.status).toEqual(StatusTypes.LOADING));

    act(() => jest.runAllTimers());

    await waitFor(() => expect(result.current.status).toEqual(StatusTypes.SUCCESS));
    await waitFor(() => expect(result.current.data).toEqual('blob://data'));
  });

  it('should return correct results when api fails', async () => {
    const error = new Error('404 image not found');
    getImage.mockRejectedValue(error);

    const { result } = renderHook(() => useFetchImage(image));

    await waitFor(() => expect(result.current.status).toEqual(StatusTypes.ERROR));
    await waitFor(() => expect(result.current.error).toEqual(error));
  });

  it('should return correct results when api call is cancelled', async () => {
    getImage.mockRejectedValue(new axios.Cancel('API call cancelled'));

    const { result } = renderHook(() => useFetchImage(image));

    await waitFor(() => expect(result.current.status).toEqual(StatusTypes.LOADING));
  });
});
