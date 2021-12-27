import { TreeItem } from '@mui/lab';
import { mockRemotes } from 'test-utils/mock-responses';
import { customRender, fireEvent, screen } from 'test-utils/react';
import FolderTreeItem from '../FolderTreeItem';
import FolderTree from '../index';

jest.mock('../FolderTreeItem');

describe('FolderTree', () => {
  beforeEach(() => {
    FolderTreeItem.mockImplementation(({ remote }) => {
      return <TreeItem nodeId={remote} label={remote} data-testid={remote} />;
    });
  });

  it('should match snapshot given list of remotes', () => {
    const { baseElement } = customRender(
      <FolderTree remotes={mockRemotes.remotes} onSelect={jest.fn()} />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should call onFolderSelect() given user clicks on a FolderTreeItem', async () => {
    const onSelect = jest.fn();
    customRender(<FolderTree remotes={mockRemotes.remotes} onSelect={onSelect} />);

    fireEvent.click(screen.getByText(mockRemotes.remotes[0]));

    expect(onSelect).toBeCalledWith(mockRemotes.remotes[0]);
  });
});
