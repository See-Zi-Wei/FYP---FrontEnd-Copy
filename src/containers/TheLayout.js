import React from 'react'
import {
  TheContent,
  TheSidebar,
  TheHeader
} from './index'
import Cookies from "universal-cookie";
import { Redirect } from 'react-router-dom';

const TheLayout = () => {

  const cookies = new Cookies();
  let isLoggedIn = false;
  if (cookies.get("data") !== undefined) {
    isLoggedIn = true;
  }
  return (
    isLoggedIn ? (
      <div className="c-app c-default-layout">
        <TheSidebar />
        <div className="c-wrapper">
          <TheHeader />
          <div className="c-body">
            <TheContent />
          </div>
        </div>
      </div>
    ) : (
      <Redirect to={{ pathname: "/login" }} />
    )
  )
}

export default TheLayout
