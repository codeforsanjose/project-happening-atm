import React from 'react';
import './Header.scss';
import classnames from 'classnames';
import Search from './Search';

// Asset imports
import cityLogo from './../../assets/SanJoseCityLogo.png';

function Header({ toggleMenu, shouldHide }) {
    return (
        <div className={classnames('header', {
            'hide': shouldHide,
        })}>
            <div className={classnames('header-content')}>
                <img className="logo" src={cityLogo} alt="logo" />
                <div className="meeting-info">
                    <div className="title">
                        San José City Council Meeting Agenda
                    </div>

                    <div className="details-title">
                        Meeting Details
                    </div>

                    <div className="date">
                        Tuesday, August 25, 2020
                    </div>

                    <div className="time">
                        Start time: <span className="no-bold">11:00 AM</span>
                    </div>

                    <div className="status">
                        Meeting is in progress
                    </div>
                </div>

                <Search />
            </div>
        </div>
    );
}

export default Header;
