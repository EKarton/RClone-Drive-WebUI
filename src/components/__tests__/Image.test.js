const { default: Image } = require('components/Image');
const { default: useImageFetcher } = require('hooks/useImageFetcher');
const { customRender, waitFor } = require('test-utils/react');

jest.mock('hooks/useImageFetcher');

describe('Image', () => {
  const getImageFn = jest.fn();

  beforeEach(() => {
    useImageFetcher.mockReturnValue({
      getImage: getImageFn,
    });
  });

  it('should render image when api call to fetch image succeeds', async () => {
    // Mock the timer
    jest.useFakeTimers();

    // Simulate api call that takes 10000 ms
    getImageFn.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: '123' });
        }, 10000);
      });
    });

    // Mock the URL.createObjectUrl() function
    URL.createObjectURL.mockReturnValue('blob://data');

    const imageProps = {
      remote: 'googledrive',
      folderPath: 'Pictures/2020',
      fileName: 'dog.png',
    };

    const component = customRender(
      <Image image={imageProps} width="20px" height="20px" />
    );

    await waitFor(() => {
      expect(component.getByTestId('image-spinner')).toBeInTheDocument();
      expect(component.baseElement).toMatchSnapshot();
    });

    jest.runAllTimers();

    await waitFor(() => {
      expect(component.getByTestId('image-content')).toBeInTheDocument();
      expect(component.baseElement).toMatchSnapshot();
    });
  });

  it('should render an error message when api call to fetch image fails', async () => {
    // Simulate failed api call
    getImageFn.mockRejectedValue(new Error('Random error'));

    const imageProps = {
      remote: 'googledrive',
      folderPath: 'Pictures/2020',
      fileName: 'dog.png',
    };

    const component = customRender(
      <Image image={imageProps} width="20px" height="20px" />
    );

    await waitFor(() => {
      expect(component.getByTestId('image-error')).toBeInTheDocument();
      expect(component.baseElement).toMatchSnapshot();
    });
  });
});
