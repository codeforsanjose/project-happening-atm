import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import NavigationMenu from './NavigationMenu';

import renderer from 'react-test-renderer';

it('NavigationMenu renders correctly', () => {
    const tree = renderer.create(
        <Router>
            <NavigationMenu />
        </Router>).toJSON();
    expect(tree).toMatchSnapshot();
});
