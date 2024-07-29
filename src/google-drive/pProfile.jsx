import React, { useState } from 'react'
import supaLogo from './CSS/supa.png'
import '@fortawesome/react-fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOut, faSun, faUser, faHand, faHandHoldingHeart, faRefresh, faExchange, faSocks } from '@fortawesome/free-solid-svg-icons'
import Profile from '../Authentication/Profile.jsx'
import { Link, useNavigate } from "react-router-dom"


export default function PProfile({ email }) {
  const [isProfileVisible, setIsProfileVisible] = useState(true);

  const toggleProfileVisibility = () => {
    setIsProfileVisible(!isProfileVisible);
  };

  return (
    <>
      <div className="rightHeader">
        <Profile></Profile>
        <div className="supaLogoContainer">
          <h2>Supa</h2><h1>DRIVE</h1>
        </div>
        <div className='FrontIcon'>
          <div className="aCenter">
            <FontAwesomeIcon icon={faSun}></FontAwesomeIcon>
          </div>
          <div className={`aRight`} onClick={toggleProfileVisibility}>
            <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
          </div>
        </div>

      </div >
      <div className={`allProfileBg ${isProfileVisible ? 'HideG' : 'ShowG'}`} ></div>
      <div className={`allProfile ${isProfileVisible ? 'HideProfile' : 'ShowProfile'}`} >
        <div className='sonProfile'>
          <FontAwesomeIcon icon={faUser} />
          <h4>Shivam Goyal</h4>
          <h5><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">{email}</a></h5>
        </div>
        <div className="apItem">
          <div className="apItemIcon">
            <Link to="/forgot-password" className="btn btn-primary w-100 mt-3">
              <FontAwesomeIcon icon={faRefresh} />
            </Link>
          </div>
          <Link to="/forgot-password" className="btn btn-primary w-100 mt-3">
            Reset Password
          </Link>
        </div>
        <div className="apItem">
          <div className="apItemIcon">
            <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
              <FontAwesomeIcon icon={faExchange} />
            </Link>
          </div>

          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">   Update Profile </Link>
        </div>
        <div className="apItem">
          <div className="apItemIcon">
            <FontAwesomeIcon icon={faSocks} />
          </div>
          <a href="">Github Link</a>
        </div>
        <div className="apItem">
          <div className="apItemIcon">
            <FontAwesomeIcon icon={faHand} />
          </div>
          <a href="">Github Link</a>
        </div>
      </div >
    </>
  )
}
