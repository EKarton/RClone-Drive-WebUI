import { customRender, userEvent, screen } from 'test-utils/react';
import GlobalAppBar from '..';

describe('GlobalAppBar', () => {
  it('should match snapshot', () => {
    const { baseElement } = customRender(
      <GlobalAppBar onDrawerButttonClicked={jest.fn()} />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should call match snapshot', () => {
    const onDrawerButttonClicked = jest.fn();

    customRender(<GlobalAppBar onDrawerButttonClicked={onDrawerButttonClicked} />);

    userEvent.click(screen.getByTestId('nav-button'));

    expect(onDrawerButttonClicked).toBeCalled();
  });
});
