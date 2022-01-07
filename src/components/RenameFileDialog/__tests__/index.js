import { customRender, userEvent, fireEvent, screen } from 'test-utils/react';
import RenameFileDialog from '..';

describe('RenameFileDialog', () => {
  const onCancel = jest.fn();
  const onRename = jest.fn();

  it('should match snapshot when dialog is open', () => {
    const { baseElement } = renderComponent();

    expect(baseElement).toMatchSnapshot();
  });

  it('should call onCancel() when user clicks on the Cancel button', () => {
    renderComponent();

    userEvent.click(screen.getByTestId('cancel'));

    expect(onCancel).toBeCalled();
  });

  it('should call onCancel() when user types nothing in the textbox and clicks on the Ok button', () => {
    renderComponent();

    userEvent.click(screen.getByTestId('ok'));

    expect(onCancel).toBeCalled();
  });

  it('should call onRename() when user types text in the text box and clicks on the Ok button', () => {
    renderComponent();

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'dog2.png' } });
    userEvent.click(screen.getByTestId('ok'));

    expect(onRename).toBeCalledWith('dog2.png');
  });

  const renderComponent = () => {
    return customRender(
      <RenameFileDialog open fileName="dog.png" onCancel={onCancel} onRename={onRename} />
    );
  };
});
