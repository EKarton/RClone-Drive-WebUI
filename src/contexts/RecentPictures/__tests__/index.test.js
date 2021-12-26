import useRecentlyViewedImages from 'hooks/useRecentlyViewedImages';
import { userEvent, render, waitFor } from 'test-utils/react';
import { RecentPicturesProvider } from '..';

describe('RecentPicturesProvider', () => {
  it('should call localStorage.setItem() correctly when new images are being added', async () => {
    const imageToAdd = {
      folderPath: 'Pictures/2012',
      fileName: '20120918_0911231.jpg',
      remote: 'googledrive-main-encrypted',
    };

    const MockComponent = () => {
      const { addImage } = useRecentlyViewedImages();
      return <button onClick={() => addImage(imageToAdd)}>Add image</button>;
    };

    const component = render(
      <RecentPicturesProvider>
        <MockComponent />
      </RecentPicturesProvider>
    );

    userEvent.click(component.getByText('Add image'));

    await waitFor(() => {
      expect(localStorage.getItem('recently_viewed_pictures')).toEqual(
        JSON.stringify([imageToAdd])
      );
    });
  });
});
