import { Blob } from 'blob-polyfill';
import { customRender, screen } from 'test-utils/react';
import TextDialogContent from '../TextDialogContent';

describe('TextDialogContent', () => {
  it('should match snapshot', async () => {
    const blob = new Blob(['1234'], { type: 'application/text' });

    const { baseElement } = customRender(<TextDialogContent fileBlob={blob} />);

    await screen.findByText('1234');
    expect(baseElement).toMatchSnapshot();
  });
});
