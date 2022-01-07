import { renderHook } from '@testing-library/react-hooks';
import { createContext, useReducer } from 'react';
import actionTypes from 'contexts/RecentPicturesList/actionTypes';
import reducer from 'contexts/RecentPicturesList/reducer';
import useRecentlyViewedImages from '../useRecentlyViewedImages';

const recentPictures = [
  {
    dirPath: 'Pictures/2010',
    fileName: '20100918_091219.jpg',
    remote: 'googledrive-main-encrypted',
  },
  {
    dirPath: 'Pictures/2010',
    fileName: '20101009_105344.jpg',
    remote: 'googledrive-main-encrypted',
  },
  {
    dirPath: 'Pictures/2010',
    fileName: '20100918_091229.jpg',
    remote: 'googledrive-main-encrypted',
  },
  {
    dirPath: 'Pictures/2010',
    fileName: '20100918_091209.jpg',
    remote: 'googledrive-main-encrypted',
  },
  {
    dirPath: 'Pictures/2010',
    fileName: '20101009_1053283.jpg',
    remote: 'googledrive-main-encrypted',
  },
  {
    dirPath: 'Pictures/2010',
    fileName: '20100918_0912434.jpg',
    remote: 'googledrive-main-encrypted',
  },
  {
    dirPath: 'Pictures/2010',
    fileName: '20100918_0911231.jpg',
    remote: 'googledrive-main-encrypted',
  },
];

describe('useRecentlyViewedImages()', () => {
  const mockInitialState = { recentPictures };
  const mockStore = createContext(mockInitialState);
  const dispatchFn = jest.fn();

  const MockStateProvider = ({ children }) => {
    const Provider = mockStore.Provider;
    const [state] = useReducer(reducer, mockInitialState);

    return <Provider value={{ state, dispatch: dispatchFn }}>{children}</Provider>;
  };

  it('should not throw an error given default store', () => {
    renderHook(() => useRecentlyViewedImages());
  });

  it('should return a list of recently viewed images', () => {
    const { result } = renderHook(() => useRecentlyViewedImages(mockStore), {
      wrapper: MockStateProvider,
    });

    expect(result.current.recentPictures).toEqual(recentPictures);
  });

  it('should call dispatch() correctly when addImage() is called', () => {
    const { result } = renderHook(() => useRecentlyViewedImages(mockStore), {
      wrapper: MockStateProvider,
    });

    const imageToAdd = {
      dirPath: 'Pictures/2012',
      fileName: '20120918_0911231.jpg',
      remote: 'googledrive-main-encrypted',
    };
    result.current.addImage(imageToAdd);

    expect(dispatchFn).toBeCalledWith({
      type: actionTypes.ADD_IMAGE,
      payload: imageToAdd,
    });
  });
});
