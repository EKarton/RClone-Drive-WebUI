import { Link } from 'react-router-dom';
import { customRender } from 'test-utils/react';
import Breadcrumb from '../Breadcrumbs';

describe('Breadcrumbs', () => {
  it.each([
    ['googledrive', '/'],
    ['googledrive', 'Documents'],
    ['googledrive', 'Documents/Work'],
    ['googledrive', 'Documents/Work/Company/Projects/Project X/Files'],
  ])('should match snapshot given remote = %s and path = %s', (remote, path) => {
    const homeLink = <Link to="/home">Home</Link>;

    const { baseElement } = customRender(
      <Breadcrumb remote={remote} path={path} homeLink={homeLink} />
    );

    expect(baseElement).toMatchSnapshot();
  });
});
