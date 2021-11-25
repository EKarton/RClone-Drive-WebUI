import Image from 'components/Image';
import LazyImage from 'components/LazyImage';
import { useInView } from 'react-intersection-observer';
import { customRender } from 'test-utils/react';

jest.mock('react-intersection-observer');
jest.mock('components/Image');

describe('LazyImage', () => {
  const imageProps = {
    remote: 'googledrive',
    folderPath: 'Pictures/2020',
    fileName: 'dog.png',
  };

  beforeEach(() => {
    Image.mockReturnValue(null);
  });

  it('should render nothing if image is not in the view', () => {
    useInView.mockReturnValue({
      ref: undefined,
      inView: false,
    });

    const { baseElement } = customRender(<LazyImage image={imageProps} />);

    expect(baseElement).toMatchSnapshot();
    expect(Image).not.toBeCalled();
  });

  it('should render the image component if image is in the view', () => {
    useInView.mockReturnValue({
      ref: undefined,
      inView: true,
    });

    const { baseElement } = customRender(<LazyImage image={imageProps} />);

    expect(baseElement).toMatchSnapshot();
    expect(Image).toBeCalled();
  });
});
