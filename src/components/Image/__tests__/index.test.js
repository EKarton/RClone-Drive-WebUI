import useFetchImage from 'hooks/fetch-data/useFetchImage';
import { StatusTypes } from 'utils/constants';
import { customRender, screen } from 'test-utils/react';
import Image from '..';

jest.mock('hooks/fetch-data/useFetchImage');

describe('Image', () => {
  const imageProps = {
    remote: 'googledrive',
    dirPath: 'Pictures/2020',
    fileName: 'dog.png',
  };

  it('should render spinner when api call is in flight', async () => {
    useFetchImage.mockReturnValue({
      status: StatusTypes.LOADING,
    });

    const { baseElement } = customRender(
      <Image image={imageProps} width="20px" height="20px" />
    );

    await screen.findByTestId('image-spinner');
    expect(baseElement).toMatchSnapshot();
  });

  it('should render image when api call finishes', async () => {
    useFetchImage.mockReturnValue({
      status: StatusTypes.SUCCESS,
      data: 'blob://data',
    });

    const { baseElement } = customRender(
      <Image image={imageProps} width="20px" height="20px" />
    );

    await screen.findByTestId('image-content');
    expect(baseElement).toMatchSnapshot();
  });

  it('should render error message when api call fails', async () => {
    useFetchImage.mockReturnValue({
      status: StatusTypes.ERROR,
      error: new Error('Image not found'),
    });

    const { baseElement } = customRender(
      <Image image={imageProps} width="20px" height="20px" />
    );

    await screen.findByTestId('image-error');
    expect(baseElement).toMatchSnapshot();
  });
});
