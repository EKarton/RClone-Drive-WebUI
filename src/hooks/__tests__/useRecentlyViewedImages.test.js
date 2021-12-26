import { renderHook } from '@testing-library/react-hooks';
import reducer from 'contexts/RecentPictures/reducer';
import actionTypes from 'contexts/RecentPictures/actionTypes';
import useRecentlyViewedImages from 'hooks/useRecentlyViewedImages';
import { createContext, useReducer } from 'react';

const recentPictures = [
  {
    folderPath: 'Pictures/2010',
    fileName: '20100918_091219.jpg',
    remote: 'googledrive-main-encrypted',
  },
  {
    folderPath: 'Pictures/2010',
    fileName: '20101009_105344.jpg',
    remote: 'googledrive-main-encrypted',
  },
  {
    folderPath: 'Pictures/2010',
    fileName: '20100918_091229.jpg',
    remote: 'googledrive-main-encrypted',
  },
  {
    folderPath: 'Pictures/2010',
    fileName: '20100918_091209.jpg',
    remote: 'googledrive-main-encrypted',
  },
  {
    folderPath: 'Pictures/2010',
    fileName: '20101009_1053283.jpg',
    remote: 'googledrive-main-encrypted',
  },
  {
    folderPath: 'Pictures/2010',
    fileName: '20100918_0912434.jpg',
    remote: 'googledrive-main-encrypted',
  },
  {
    folderPath: 'Pictures/2010',
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
      folderPath: 'Pictures/2012',
      fileName: '20120918_0911231.jpg',
      remote: 'googledrive-main-encrypted',
    };
    result.current.addImage(imageToAdd);

    expect(dispatchFn).toBeCalledWith({
      type: actionTypes.ADD_IMAGE,
      payload: imageToAdd,
    });
  });

  it('should call dispatch() corrrectly when removeImages() is called', () => {
    const { result } = renderHook(() => useRecentlyViewedImages(mockStore), {
      wrapper: MockStateProvider,
    });

    const imageToRemove = {
      folderPath: 'Pictures/2010',
      fileName: '20100918_091219.jpg',
      remote: 'googledrive-main-encrypted',
    };
    result.current.removeImages([imageToRemove]);

    expect(dispatchFn).toBeCalledWith({
      type: actionTypes.REMOVE_IMAGES,
      payload: [imageToRemove],
    });
  });
});
