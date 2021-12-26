import { renderHook } from '@testing-library/react-hooks';
import { actionTypes } from 'contexts/FileViewerDialog';
import reducer from 'contexts/FileViewerDialog/reducer';
import useFileViewer from '../useFileViewer';
import { createContext, useReducer } from 'react';

describe('useFileViewer', () => {
  const mockInitialState = {};
  const mockStore = createContext(mockInitialState);
  const dispatchFn = jest.fn();

  const MockStateProvider = ({ children }) => {
    const Provider = mockStore.Provider;
    const [state] = useReducer(reducer, mockInitialState);

    return <Provider value={{ state, dispatch: dispatchFn }}>{children}</Provider>;
  };

  it('should not throw an error given default store', () => {
    renderHook(() => useFileViewer());
  });

  it('should call dispatch() correctly when called useFileViewer.show()', () => {
    const fileInfo = {
      remote: 'gdrive',
      folderPath: 'Documents',
      fileName: 'iamge.png',
    };

    const { result } = renderHook(() => useFileViewer(mockStore), {
      wrapper: MockStateProvider,
    });

    result.current.show(fileInfo);

    expect(dispatchFn).toBeCalledWith({ type: actionTypes.SHOW_DIALOG });
    expect(dispatchFn).toBeCalledWith({
      type: actionTypes.SET_FILE_INFO,
      payload: fileInfo,
    });
  });

  it('should call dispatch() correctly when called useFileViewer.hide()', () => {
    const { result } = renderHook(() => useFileViewer(mockStore), {
      wrapper: MockStateProvider,
    });

    result.current.hide();

    expect(dispatchFn).toBeCalledWith({ type: actionTypes.HIDE_DIALOG });
  });
});
