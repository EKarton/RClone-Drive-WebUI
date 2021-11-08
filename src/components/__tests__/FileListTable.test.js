import { render, userEvent } from 'test-utils';
import { ICON_SIZE } from 'utils/constants';
import FileListTable from 'components/FileListTable';

const files = [
  {
    name: 'Documents',
    lastUpdatedTime: '2021-11-01T21:09:05.237Z',
    size: '',
    isDirectory: true,
    isImage: false,
  },
  {
    name: 'Pictures',
    lastUpdatedTime: '2021-09-28T03:39:11.850Z',
    size: '',
    isDirectory: true,
    isImage: false,
  },
  {
    name: 'My Home.png',
    lastUpdatedTime: '2021-11-01T21:08:16.736Z',
    size: '',
    isDirectory: false,
    isImage: true,
    preview: <img />,
  },
  {
    name: 'My dog.png',
    lastUpdatedTime: '2021-01-01T21:08:16.736Z',
    size: '',
    isDirectory: false,
    isImage: true,
  },
  {
    name: 'My Script.sh',
    lastUpdatedTime: '2021-10-01T21:08:16.736Z',
    size: '',
    isDirectory: false,
    isImage: false,
  },
];

describe('FileListTable', () => {
  it.each([ICON_SIZE.SMALL, ICON_SIZE.MEDIUM, ICON_SIZE.LARGE])(
    'should match snapshot given icon size is %s',
    (iconSize) => {
      const { baseElement } = render(
        <FileListTable files={files} iconSize={iconSize} onFileClicked={jest.fn()} />
      );

      expect(baseElement).toMatchSnapshot();
    }
  );

  it('should call onFileClicked() when file is clicked', () => {
    const onFileClickedFn = jest.fn();

    const component = render(
      <FileListTable
        files={files}
        iconSize={ICON_SIZE.LARGE}
        onFileClicked={onFileClickedFn}
      />
    );

    userEvent.click(component.getByTestId('Documents'));

    expect(onFileClickedFn).toBeCalledWith(files[0]);
  });
});
