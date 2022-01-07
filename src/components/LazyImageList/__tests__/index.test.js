import { mockPictures } from 'test-utils/mock-responses';
import { customRender, userEvent, screen } from 'test-utils/react';
import LazyImageList from '..';

jest.mock('components/LazyImage', () => () => null);

describe('LazyImageList', () => {
  // Derived from https://github.com/bvaughn/react-virtualized/issues/493#issuecomment-447014986
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetHeight'
  );
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetWidth'
  );

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: 800,
    });
  });

  afterAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
  });

  it.each([800, 2000])('should match snapshot given width is %s', (width) => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: width,
    });

    const remote = 'gdrive';
    const onImageClicked = jest.fn();

    const { baseElement } = customRender(
      <LazyImageList
        images={mockPictures.list}
        remote={remote}
        onImageClicked={onImageClicked}
      />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should call onImageClicked() correctly when clicked on an image', () => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 800,
    });

    const remote = 'gdrive';
    const onImageClicked = jest.fn();

    customRender(
      <LazyImageList
        images={mockPictures.list}
        remote={remote}
        onImageClicked={onImageClicked}
      />
    );

    userEvent.click(screen.getByTestId('20120517_171428.JPG'));

    expect(onImageClicked).toBeCalledWith({
      remote,
      dirPath: 'Pictures/2012',
      fileName: '20120517_171428.JPG',
      dateTaken: {
        year: 2012,
        month: 5,
        day: 17,
      },
    });
  });
});
