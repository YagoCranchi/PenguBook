import { Link } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import SideBarNav from './components/nav';
import SideBarUserBox from './components/userBox';
import { mdiBackburger, mdiMenu } from '@mdi/js';
import Icon from '@mdi/react';

import './index.scss';

const SideBar = () => {
  const { auth } = useAuth();
  const userInfos = auth?.userInfo || null;
  const userRole = userInfos?.roleName || null;
  const isAdmin = userRole === "ADMIN";

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
      <button className="hamburger-button" onClick={toggleMenu}>
        <Icon path={isMenuOpen? mdiBackburger : mdiMenu} size={1.5} color="currentColor" />
      </button>

      <div className="sidebar-content">
        <h2 className="sidebar-header">
          <Link to="/">
            <img src="/logo.png" alt="Logo" className="sidebar-logo" />
          </Link>
        </h2>
        
        <SideBarNav isAdmin={isAdmin} />

        <SideBarUserBox />
      </div>
    </div>
  );
};

export default SideBar;