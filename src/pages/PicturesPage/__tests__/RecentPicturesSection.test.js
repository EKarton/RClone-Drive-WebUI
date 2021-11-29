import Image from 'components/Image';
import useFileViewer from 'hooks/useFileViewer';
import useRecentlyViewedImages from 'hooks/useRecentlyViewedImages';
import { customRender, userEvent, waitFor } from 'test-utils/react';
import RecentPicturesSection from '../RecentPicturesSection';

const recentPicturesList = [
  {
    folderPath: 'Pictures/2010/Tomas',
    fileName: '20100918_091219.jpg',
    remote: 'googledrive-main-encrypted',
  },
  {
    folderPath: 'Pictures/2010/Tomas',
    fileName: '20101009_105344.jpg',
    remote: 'googledrive-main-encrypted',
  },
  {
    folderPath: 'Pictures/2010/Tomas',
    fileName: '20100918_091229.jpg',
    remote: 'googledrive-main-encrypted',
  },
  {
    folderPath: 'Pictures/2010/Tomas',
    fileName: '20100918_091209.jpg',
    remote: 'googledrive-main-encrypted',
  },
  {
    folderPath: 'Pictures/2010/Tomas',
    fileName: '20101009_1053283.jpg',
    remote: 'googledrive-main-encrypted',
  },
  {
    folderPath: 'Pictures/2010/Tomas',
    fileName: '20100918_0912434.jpg',
    remote: 'googledrive-main-encrypted',
  },
  {
    folderPath: 'Pictures/2010/Tomas',
    fileName: '20100918_0911231.jpg',
    remote: 'googledrive-main-encrypted',
  },
];

jest.mock('components/Image');
jest.mock('hooks/useFileViewer');
jest.mock('hooks/useRecentlyViewedImages');

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
      recentPictures: recentPicturesList,
      addImage: addImageFn,
    });

    useFileViewer.mockReturnValue({
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

    const component = customRender(<RecentPicturesSection />);

    await waitFor(() => {
      expect(component.queryByTestId(recentPicturesList[0].fileName)).toBeInTheDocument();
      expect(component.queryByTestId(recentPicturesList[1].fileName)).toBeInTheDocument();
      expect(component.queryByTestId(recentPicturesList[2].fileName)).toBeInTheDocument();
      expect(component.queryByTestId(recentPicturesList[3].fileName)).toBeInTheDocument();

      expect(component.baseElement).toMatchSnapshot();
    });
  });

  it('should render correctly if screen width is > 1920', async () => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 2000,
    });

    const component = customRender(<RecentPicturesSection />);

    await waitFor(() => {
      expect(component.queryByTestId(recentPicturesList[0].fileName)).toBeInTheDocument();
      expect(component.queryByTestId(recentPicturesList[1].fileName)).toBeInTheDocument();
      expect(component.queryByTestId(recentPicturesList[2].fileName)).toBeInTheDocument();
      expect(component.queryByTestId(recentPicturesList[3].fileName)).toBeInTheDocument();
      expect(component.queryByTestId(recentPicturesList[4].fileName)).toBeInTheDocument();
      expect(component.queryByTestId(recentPicturesList[5].fileName)).toBeInTheDocument();

      expect(component.baseElement).toMatchSnapshot();
    });
  });

  it('should call addImage() and fileViewer.show() correctly if user clicks on an image', () => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 2000,
    });

    const component = customRender(<RecentPicturesSection />);

    userEvent.click(component.getByTestId(recentPicturesList[0].fileName));

    expect(addImageFn).toBeCalledWith(recentPicturesList[0]);
    expect(fileViewerShowFn).toBeCalledWith(recentPicturesList[0]);
  });

  it('should render nothing when there are no recent pictures', () => {
    useRecentlyViewedImages.mockReturnValue({
      recentPictures: [],
      addImage: jest.fn(),
    });

    const { baseElement } = customRender(<RecentPicturesSection />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should render fillers when there are less than the max. number of images', () => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 800,
    });

    useRecentlyViewedImages.mockReturnValue({
      recentPictures: [
        {
          folderPath: 'Pictures/2010/Tomas',
          fileName: '20100918_091219.jpg',
          remote: 'googledrive-main-encrypted',
        },
      ],
      addImage: jest.fn(),
    });

    const component = customRender(<RecentPicturesSection />);

    expect(component.getAllByTestId('image-fillers').length).toEqual(3);
  });
});
