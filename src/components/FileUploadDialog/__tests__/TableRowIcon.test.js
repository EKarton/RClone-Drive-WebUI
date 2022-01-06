import { render } from 'test-utils/react';
import TableRowIcon from '../TableRowIcon';

describe('TableRowIcon', () => {
  it.each(['application/zip', 'text/xml', 'application/octet-stream'])(
    'should match snapshot given file type %s',
    (fileType) => {
      const { baseElement } = render(<TableRowIcon fileType={fileType} />);

      expect(baseElement).toMatchSnapshot();
    }
  );
});
