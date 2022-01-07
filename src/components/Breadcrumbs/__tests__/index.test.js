import { customRender } from 'test-utils/react';
import Breadcrumb from '..';

describe('Breadcrumbs', () => {
  it.each([
    ['googledrive', '/'],
    ['googledrive', 'Documents'],
    ['googledrive', 'Documents/Work'],
    ['googledrive', 'Documents/Work/Company/Projects/Project X/Files'],
  ])('should match snapshot given remote = %s and path = %s', (remote, path) => {
    const { baseElement } = customRender(
      <Breadcrumb remote={remote} path={path} homePath="/files" homeText="My Files" />
    );

    expect(baseElement).toMatchSnapshot();
  });
});
