import { customRender, userEvent } from 'test-utils';
import GlobalAppBar from 'components/GlobalAppBar';

describe('GlobalAppBar', () => {
  it('should match snapshot', () => {
    const { baseElement } = customRender(
      <GlobalAppBar onDrawerButttonClicked={jest.fn()} />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should call match snapshot', () => {
    const onDrawerButttonClicked = jest.fn();

    const component = customRender(
      <GlobalAppBar onDrawerButttonClicked={onDrawerButttonClicked} />
    );

    userEvent.click(component.getByTestId('nav-button'));

    expect(onDrawerButttonClicked).toBeCalled();
  });
});
