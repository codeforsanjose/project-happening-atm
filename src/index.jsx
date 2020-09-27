import React, { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import './index.scss';

import MeetingView from './components/MeetingView/MeetingView';
import Header from './components/Header/Header';
import classnames from 'classnames';
import NavigationMenu from './components/Header/NavigationMenu';
import Subscribe from './components/Subscribe/Subscribe';
import MeetingItem from './components/MeetingItem/MeetingItem';

function App() {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = useCallback(() => {
        setShowMenu(!showMenu);
    }, [showMenu, setShowMenu]);

    return (
        <React.StrictMode>
            <div className={classnames('app-root')}>
                <Router>
                    <div className="ribbon" />
                    <Header toggleMenu={toggleMenu} shouldHide={showMenu}/>
                    <div className="fade-box" />
                    {/*
                     A <Switch> looks through all its children <Route>
                     elements and renders the first one whose path
                     matches the current URL. Use a <Switch> any time
                     you have multiple routes, but you want only one
                     of them to render at a time
                     */}
                    <Switch>
                        <Route exact path="/">
                            <MeetingView />
                        </Route>
                        <Route path="/subscribe/:id">
                            <Subscribe />
                        </Route>
                        <Route path="/meeting-item/:id">
                            <MeetingItem />
                        </Route>
                    </Switch>
                    <NavigationMenu toggleMenu={toggleMenu} showMenu={showMenu}/>
                </Router>
            </div>
        </React.StrictMode>
    )

}
ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
