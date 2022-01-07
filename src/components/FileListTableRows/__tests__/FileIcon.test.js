import LazyImage from 'components/LazyImage';
import { render } from 'test-utils/react';
import FileIcon from '../FileIcon';

jest.mock('components/LazyImage');

describe('FileIcon', () => {
  it('should match snapshot given file is a directory', () => {
    const file = {
      remote: 'gdrive',
      path: 'Pictures/2021',
      name: 'Screenshots',
      isDirectory: true,
      isImage: false,
    };

    const { baseElement } = render(<FileIcon file={file} />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should show an image given file is an image and it is showing previews', () => {
    LazyImage.mockReturnValue(null);

    const file = {
      remote: 'gdrive',
      path: 'Pictures/2021',
      name: 'Big Sur.png',
      isDirectory: false,
      isImage: true,
    };

    const { baseElement } = render(<FileIcon file={file} showPreview />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot given file is an image and it is not showing previews', () => {
    const file = {
      remote: 'gdrive',
      path: 'Pictures/2021',
      name: 'Big Sur.png',
      isDirectory: false,
      isImage: true,
    };

    const { baseElement } = render(<FileIcon file={file} />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot given file is a pdf', () => {
    const file = {
      remote: 'gdrive',
      path: 'Documents/2021',
      name: 'Forms.png',
      isDirectory: false,
      isImage: false,
    };

    const { baseElement } = render(<FileIcon file={file} />);

    expect(baseElement).toMatchSnapshot();
  });
});
