import FolderTreeItem from '../FolderTreeItem';
import FolderTree from '..';
import { customRender, fireEvent, screen } from 'test-utils';
import { mockRemotes } from 'utils/mock-files';
import { TreeItem } from '@mui/lab';

jest.mock('../FolderTreeItem');

describe('FolderTree', () => {
  beforeEach(() => {
    FolderTreeItem.mockImplementation(({ remote }) => {
      return <TreeItem nodeId={remote} label={remote} data-testid={remote} />;
    });
  });

  it('should match snapshot given list of remotes', () => {
    const { baseElement } = customRender(
      <FolderTree remotes={mockRemotes.remotes} onFolderSelect={jest.fn()} />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should call onFolderSelect() given user clicks on a FolderTreeItem', async () => {
    const onFolderSelect = jest.fn();
    customRender(
      <FolderTree remotes={mockRemotes.remotes} onFolderSelect={onFolderSelect} />
    );

    fireEvent.click(screen.getByText(mockRemotes.remotes[0]));

    expect(onFolderSelect).toBeCalledWith(mockRemotes.remotes[0]);
  });
});
