import useRecentlyViewedImages from 'hooks/utils/useRecentlyViewedImages';
import { userEvent, render, screen } from 'test-utils/react';
import { RecentPicturesProvider } from '../index';

describe('RecentPicturesProvider', () => {
  it('should call localStorage.setItem() correctly when new images are being added', async () => {
    const imageToAdd = {
      dirPath: 'Pictures/2012',
      fileName: '20120918_0911231.jpg',
      remote: 'googledrive-main-encrypted',
    };

    const MockComponent = () => {
      const { addImage } = useRecentlyViewedImages();
      return <button onClick={() => addImage(imageToAdd)}>Add image</button>;
    };

    render(
      <RecentPicturesProvider>
        <MockComponent />
      </RecentPicturesProvider>
    );

    userEvent.click(screen.getByText('Add image'));

    expect(localStorage.getItem('recently_viewed_pictures')).toEqual(
      JSON.stringify([imageToAdd])
    );
  });
});
