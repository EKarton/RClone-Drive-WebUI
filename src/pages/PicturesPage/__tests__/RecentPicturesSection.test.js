import Image from 'components/Image';
import useFileViewerDialog from 'hooks/utils/useFileViewerDialog';
import useRecentlyViewedImages from 'hooks/utils/useRecentlyViewedImages';
import getExistingPictures from 'utils/getExistingPictures';
import { customRender, userEvent, screen } from 'test-utils/react';
import RecentPicturesSection from '../RecentPicturesSection';

const recentPictures = [
  {
    dirPath: 'Pictures/2010/Tomas',
    fileName: '20100918_091219.jpg',
    remote: 'googledrive-main-encrypted',
  },
  {
    dirPath: 'Pictures/2010/Tomas',
    fileName: '20101009_105344.jpg',
    remote: 'googledrive-main-encrypted',
  },
  {
    dirPath: 'Pictures/2010/Tomas',
    fileName: '20100918_091229.jpg',
    remote: 'googledrive-main-encrypted',
  },
  {
    dirPath: 'Pictures/2010/Tomas',
    fileName: '20100918_091209.jpg',
    remote: 'googledrive-main-encrypted',
  },
  {
    dirPath: 'Pictures/2010/Tomas',
    fileName: '20101009_1053283.jpg',
    remote: 'googledrive-main-encrypted',
  },
  {
    dirPath: 'Pictures/2010/Tomas',
    fileName: '20100918_0912434.jpg',
    remote: 'googledrive-main-encrypted',
  },
  {
    dirPath: 'Pictures/2010/Tomas',
    fileName: '20100918_0911231.jpg',
    remote: 'googledrive-main-encrypted',
  },
];

jest.mock('components/Image');
jest.mock('hooks/utils/useFileViewerDialog');
jest.mock('hooks/utils/useRecentlyViewedImages');
jest.mock('hooks/rclone/useRCloneClient');
jest.mock('utils/getExistingPictures');

describe('RecentPicturesSection', () => {
  // Derived from https://github.com/bvaughn/react-virtualized/issues/493#issuecomment-447014986
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetHeight'
  );
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetWidth'
  );

  const addImageFn = jest.fn();
  const fileViewerShowFn = jest.fn();

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: 800,
    });
  });

  beforeEach(() => {
    Image.mockReturnValue(null);

    addImageFn.mockReset();
    fileViewerShowFn.mockReset();

    useRecentlyViewedImages.mockReturnValue({
      recentPictures: recentPictures,
      addImage: addImageFn,
    });

    getExistingPictures.mockResolvedValue(recentPictures);

    useFileViewerDialog.mockReturnValue({
      show: fileViewerShowFn,
    });
  });

  afterAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
  });

  it('should render correctly if screen width is < 800', async () => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 800,
    });

    const { baseElement } = customRender(<RecentPicturesSection />);

    await screen.findByTestId(recentPictures[0].fileName);
    await screen.findByTestId(recentPictures[1].fileName);
    await screen.findByTestId(recentPictures[2].fileName);
    await screen.findByTestId(recentPictures[3].fileName);

    expect(baseElement).toMatchSnapshot();
  });

  it('should render correctly if screen width is > 1920', async () => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 2000,
    });

    const { baseElement } = customRender(<RecentPicturesSection />);

    await screen.findByTestId(recentPictures[0].fileName);
    await screen.findByTestId(recentPictures[1].fileName);
    await screen.findByTestId(recentPictures[2].fileName);
    await screen.findByTestId(recentPictures[3].fileName);
    await screen.findByTestId(recentPictures[4].fileName);
    await screen.findByTestId(recentPictures[5].fileName);

    expect(baseElement).toMatchSnapshot();
  });

  it('should call addImage() and fileViewer.show() correctly if user clicks on an image', async () => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 2000,
    });

    customRender(<RecentPicturesSection />);

    await screen.findByTestId(recentPictures[0].fileName);
    userEvent.click(screen.getByTestId(recentPictures[0].fileName));

    expect(addImageFn).toBeCalledWith(recentPictures[0]);
    expect(fileViewerShowFn).toBeCalledWith(recentPictures[0]);
  });

  it('should render nothing when there are no recent pictures', async () => {
    useRecentlyViewedImages.mockReturnValue({
      recentPictures: [],
      addImage: jest.fn(),
    });

    const { baseElement } = customRender(<RecentPicturesSection />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should render fillers when there are less than the max. number of images', async () => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 800,
    });

    const recentPictures = [
      {
        dirPath: 'Pictures/2010/Tomas',
        fileName: '20100918_091219.jpg',
        remote: 'googledrive-main-encrypted',
      },
    ];

    useRecentlyViewedImages.mockReturnValue({
      recentPictures,
      addImage: jest.fn(),
    });

    getExistingPictures.mockResolvedValue(recentPictures);

    customRender(<RecentPicturesSection />);

    expect((await screen.findAllByTestId('image-fillers')).length).toEqual(3);
  });
});
