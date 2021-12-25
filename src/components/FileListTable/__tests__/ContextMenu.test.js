const { customRender } = require('test-utils/react');
const { default: ContextMenu } = require('../ContextMenu');

describe('ContextMenu', () => {
  it('should match snapshot given it is open', () => {
    const { baseElement } = customRender(
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