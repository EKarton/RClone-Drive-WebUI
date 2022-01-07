import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { StatusTypes } from 'utils/constants';
import useImageFetcher from '../rclone/useImageFetcher';

export default function useFetchImage(image) {
  const cancelSource = useRef(null);
  const imageFetcher = useImageFetcher();

  const [result, setResult] = useState({
    status: StatusTypes.LOADING,
    data: undefined,
    error: undefined,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setResult({ status: StatusTypes.LOADING, data: undefined, error: undefined });

        const cancelToken = cancelSource.current.token;
        const opt = { cancelToken };
        const response = await imageFetcher.getImage(
          image.remote,
          image.dirPath,
          image.fileName,
          opt
        );

        setResult({
          status: StatusTypes.SUCCESS,
          data: URL.createObjectURL(new Blob([response.data])),
          error: undefined,
        });
      } catch (error) {
        if (!axios.isCancel(error)) {
          setResult({ status: StatusTypes.ERROR, data: undefined, error });
        }
      }
    };

    cancelSource.current = axios.CancelToken.source();

    if (!result.data && image) {
      fetchData();
    }

    return () => {
      cancelSource.current.cancel();

      if (result.data) {
        URL.revokeObjectURL(result.data);
      }
    };
  }, [image, imageFetcher, result.data]);

  return result;
}
