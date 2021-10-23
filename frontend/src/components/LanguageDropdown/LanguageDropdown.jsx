import React, { useEffect,useRef,useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CaratDownIcon, GlobeIcon } from '../../utils/_icons';
import { NavLink } from 'react-router-dom';
import "./LanguageDropdown.scss";

function LanguageDropdown() {
    const { i18n } = useTranslation();
    
    const [clickedOutside, setClickedOutside] = useState(false);
    const [expanded, setExpanded] = useState(false);
    
    const myRef = useRef();
    
    const handleClickOutside = e => {
        if (!myRef.current.contains(e.target)) {
            setClickedOutside(true);
            setExpanded(false);
        }
    };

    const handleExpand = () => {
        setExpanded(!expanded)
    }

    const handleLanguageChange = (val) => {
        setClickedOutside(false);
        i18n.changeLanguage(val);
    }
     
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    });
    
    return (
        <div className="language-dropdown-wrapper" ref={myRef}>
        
        <li className="admin-nav-link" onClick={handleExpand}>
            <NavLink activeClassName="button-active" to="#">
                <div className="button-group">
                    <div className="button-group-inner">
                        <GlobeIcon className="button-icon"/>
                        <span className="button-text">Languages</span>
                        <CaratDownIcon className="button-dropdown-carat"/>
                    </div>
                </div>
            </NavLink>
        </li>
            {expanded && 
                <div className="language-menu">
                    <ul className="language-menu-list">
                        <li className="menu-list-item menu-list-item-1"><p  onClick={() => handleLanguageChange('en')}>English</p></li>
                        <li className="menu-list-item menu-list-item-2"><p onClick={() => handleLanguageChange('es')}>Spanish</p></li>
                        <li className="menu-list-item menu-list-item-3"><p  onClick={() => handleLanguageChange('vi')}>Vietnamese</p></li>
                    </ul>
                </div>
            }
        </div>
    )
}

export default LanguageDropdown;