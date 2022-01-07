import { render } from 'test-utils/react';
import ContextMenu from '../ContextMenu';

describe('ContextMenu', () => {
  it('should match snapshot given it is open', () => {
    const { baseElement } = render(
      <ContextMenu
        open
        onClose={jest.fn()}
        menuPosition={{ left: 200, top: 300 }}
        menuButtonEvents={{
          onOpen: jest.fn(),
          onDownload: jest.fn(),
          onMove: jest.fn(),
          onCopy: jest.fn(),
          onRename: jest.fn(),
          onDelete: jest.fn(),
        }}
      />
    );

    expect(baseElement).toMatchSnapshot();
  });
});
