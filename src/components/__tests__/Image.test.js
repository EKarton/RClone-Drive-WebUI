import Image from 'components/Image';
import useFetchImage from 'hooks/rclone/fetch-data/useFetchImage';
import { customRender, waitFor } from 'test-utils/react';
import { StatusTypes } from 'utils/constants';

jest.mock('hooks/rclone/fetch-data/useFetchImage');

describe('Image', () => {
  const imageProps = {
    remote: 'googledrive',
    folderPath: 'Pictures/2020',
    fileName: 'dog.png',
  };

  it('should render spinner when api call is in flight', async () => {
    useFetchImage.mockReturnValue({
      status: StatusTypes.LOADING,
    });

    const component = customRender(
      <Image image={imageProps} width="20px" height="20px" />
    );

    await waitFor(() => {
      expect(component.getByTestId('image-spinner')).toBeInTheDocument();
      expect(component.baseElement).toMatchSnapshot();
    });
  });

  it('should render image when api call finishes', async () => {
    useFetchImage.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: 'blob://data',
    });

    const component = customRender(
      <Image image={imageProps} width="20px" height="20px" />
    );

    await waitFor(() => {
      expect(component.getByTestId('image-content')).toBeInTheDocument();
      expect(component.baseElement).toMatchSnapshot();
    });
  });

  it('should render error message when api call fails', async () => {
    useFetchImage.mockReturnValue({
      status: StatusTypes.ERROR,
      error: new Error('Image not found'),
    });

    const component = customRender(
      <Image image={imageProps} width="20px" height="20px" />
    );

    await waitFor(() => {
      expect(component.getByTestId('image-error')).toBeInTheDocument();
      expect(component.baseElement).toMatchSnapshot();
    });
  });
});
