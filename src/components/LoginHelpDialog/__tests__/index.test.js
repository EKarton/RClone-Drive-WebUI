import { render } from 'test-utils/react';
import LoginHelpDialog from '..';

describe('LoginHelpDialog', () => {
  it('should match snapshot given dialog is open', () => {
    const { baseElement } = render(<LoginHelpDialog open onClose={jest.fn()} />);

    expect(baseElement).toMatchSnapshot();
  });
});
