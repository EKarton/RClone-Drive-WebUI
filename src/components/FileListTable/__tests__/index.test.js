import StandardRow from 'components/FileListTableRows/StandardRow/index';
import { render } from 'test-utils/react';
import FileListTable from '..';

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
];

describe('FileListTable', () => {
  it('should match snapshot given rows', () => {
    const { baseElement } = render(
      <FileListTable>
        {files.map((file) => (
          <StandardRow file={file} />
        ))}
      </FileListTable>
    );

    expect(baseElement).toMatchSnapshot();
  });
});
