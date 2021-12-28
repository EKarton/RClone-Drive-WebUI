import { TreeView } from '@mui/lab';
import useRCloneClient from 'hooks/rclone/useRCloneClient';
import { customRender, fireEvent, screen } from 'test-utils/react';
import FolderTreeItem from '../FolderTreeItem';

jest.mock('hooks/rclone/useRCloneClient');

// Sub-folders under the '/' directory
const TopLevelFolders = [
  {
    Path: '.rclone',
    Name: '.rclone',
    Size: -2,
    MimeType: 'inode/directory',
    ModTime: '2021-11-01T21:09:05.237Z',
    IsDir: true,
    ID: 'asfsf',
  },
  {
    Path: 'Documents',
    Name: 'Documents',
    Size: -10,
    MimeType: 'inode/directory',
    ModTime: '2021-09-28T01:51:05.982Z',
    IsDir: true,
    ID: 'fsaf',
  },
];

// Sub-folders under the 'Documents' directory
const SecondLevelFolders = [
  {
    Path: 'Work',
    Name: 'Work',
    Size: -2,
    MimeType: 'inode/directory',
    ModTime: '2021-11-01T21:09:05.237Z',
    IsDir: true,
    ID: 'asfsaf',
  },
  {
    Path: 'Personal',
    Name: 'Personal',
    Size: -10,
    MimeType: 'inode/directory',
    ModTime: '2021-09-28T01:51:05.982Z',
    IsDir: true,
    ID: 'sakfmkasfm',
  },
];

describe('FolderTreeItem', () => {
  const fetchSubFoldersFn = jest.fn();

  beforeEach(() => {
    useRCloneClient.mockReturnValue({
      fetchSubFolders: fetchSubFoldersFn,
    });
  });

  it('should make api calls match snapshots when user clicks on subfolders', async () => {
    fetchSubFoldersFn.mockImplementation((remote, curPath) => {
      if (curPath === '') {
        return Promise.resolve(TopLevelFolders);
      }

      return Promise.resolve(SecondLevelFolders);
    });

    const { baseElement } = customRender(
      <TreeView>
        <FolderTreeItem remote="gdrive" curPath="" label="/" />
      </TreeView>
    );

    await screen.findByText('/');
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('/'));

    await screen.findByText('Documents');
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('Documents'));

    await screen.findByText('Personal');
    expect(baseElement).toMatchSnapshot();
  });

  it('should render loading and then display data when api is loading and has succeeded', async () => {
    // Mock the timer
    jest.useFakeTimers();

    // Mock api call that takes 10000ms
    fetchSubFoldersFn.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(TopLevelFolders);
        }, 10000);
      });
    });

    customRender(
      <TreeView>
        <FolderTreeItem remote="gdrive" curPath="" label="/" />
      </TreeView>
    );

    await screen.findByText('/');
    fireEvent.click(screen.getByText('/'));

    // Resolve api call
    jest.runAllTimers();

    await screen.findByText('Documents');
  });

  it('should render error when api call failed', async () => {
    fetchSubFoldersFn.mockRejectedValue(new Error('Random error'));

    customRender(
      <TreeView>
        <FolderTreeItem remote="gdrive" curPath="" label="/" />
      </TreeView>
    );

    await screen.findByText('/');
    fireEvent.click(screen.getByText('/'));

    await screen.findByText('Error!');
  });

  it('should render correctly when there are no more sub-folders', async () => {
    fetchSubFoldersFn.mockResolvedValue([]);

    customRender(
      <TreeView>
        <FolderTreeItem remote="gdrive" curPath="" label="/" />
      </TreeView>
    );

    await screen.findByText('/');
    fireEvent.click(screen.getByText('/'));

    await screen.findByText('No subfolders');
  });
});
