import React from 'react';
import { NavLink } from 'react-router-dom';
// import './Sidebar.css';
import {useAuth} from '../../../AuthContext/AuthContext'
import { useLocation } from 'react-router-dom';

const Sidebar = () => {

  const {user, logout, username} = useAuth()
  const location = useLocation()

  return (
    <div className="sidebar">
      <div className="sidebar-info">
      </div>
      <div className="links">
        <NavLink to="private-office" className={'sidebar-link'}>Мой кабинет</NavLink>
        <NavLink to="my-pipelines"  className={'sidebar-link'}>Мои сети</NavLink>
      
      
      </div>
      {location.pathname !== '/dashboard/new-pipeline' ? <NavLink to="new-pipeline" className={'sidebar-create-button'}>+ Новая сеть</NavLink> :(<div></div>)}
      
      <button className='logout-button' onClick={logout}>Выход</button>
    </div>
  );
};

export default Sidebar;