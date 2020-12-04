import React from 'react';
import Search from './Search';

import renderer from 'react-test-renderer';

it('Search renders correctly', () => {
    const tree = renderer.create(<Search />).toJSON();
    expect(tree).toMatchSnapshot();
});
