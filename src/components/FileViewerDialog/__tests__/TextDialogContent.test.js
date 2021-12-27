import { Blob } from 'blob-polyfill';
import { customRender, waitFor } from 'test-utils/react';
import TextDialogContent from '../TextDialogContent';

describe('TextDialogContent', () => {
  it('should match snapshot', async () => {
    const blob = new Blob(['1234'], { type: 'application/text' });

    const component = customRender(<TextDialogContent fileBlob={blob} />);

    await waitFor(() => {
      expect(component.getByText('1234')).toBeInTheDocument();
      expect(component.baseElement).toMatchSnapshot();
    });
  });
});
