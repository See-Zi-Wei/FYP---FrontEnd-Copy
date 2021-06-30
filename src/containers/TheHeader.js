import React from 'react'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CSubheader,
  CButton,
  CImg,
  CBreadcrumbItem,
  CBreadcrumb,
  CLink
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

import Cookies from "universal-cookie";
import { useHistory, useLocation } from 'react-router-dom';

// routes config
import routes from '../routes'
import _nav from './_nav'
import MyProfile from '../components/MyProfile'
import configData from "../config.json";

const TheHeader = () => {

  const dispatch = useDispatch()
  const sidebarShow = useSelector(state => state.sidebarShow)

  const history = useHistory();
  const cookies = new Cookies();
  const data = cookies.get('data');
  var token, user, system_user_role;
  if (data === undefined) {
    history.push("/login")
  } else {
    token = data["token"];
    user = data["username"];
    system_user_role = data["user_role"];
  }

  const project = cookies.get('project');
  var project_name;
  if (project !== undefined) {
    project_name = project["project_name"]
  }

  const frame = cookies.get('frame');
  var job_id, job_name;
  if (frame !== undefined) {
    job_id = frame["job_id"]
    job_name = frame["job_name"]
  }

  // To display the custom breadcrumb item for different module
  const currentModule = useSelector(state => state.currentModule)
  const prevPage = useSelector(state => state.prevPage)
  const location = useLocation();

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch({ type: 'set', sidebarShow: val })
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch({ type: 'set', sidebarShow: val })
  }

  // My Profile Modal
  const [modal, setModal] = useState(false)

  // Logout
  const logoutHandler = () => {
    fetch(configData.API_URL + "/logout", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "accept": "application/json",
        "Authorization": "Basic " + btoa(user + ":" + token)
      },
    }).then(response => {
      return response.json()
    }).then(body => {
      console.log(body);
      dispatch({ type: 'set', assetSearch: [] });
      cookies.remove("data");
      cookies.remove('s_project');
      cookies.remove('s_asset_text');
      cookies.remove('s_assetClassSelection');
      history.push("/login");
    }).catch(error => {
      console.log(error);
    })
  }

  return (
    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderBrand className="mx-auto d-lg-none" to="/">
        <CImg src="/omens_logo.png" fluid width='130' />
      </CHeaderBrand>

      <CHeaderNav className="mr-auto">
        <CHeaderNavItem className="px-3" >
          <CHeaderNavLink to="/activeProjects">
            <CIcon className="pr-1" size={'lg'} content={freeSet.cilBorderAll} alt="Projects" />Projects</CHeaderNavLink>
        </CHeaderNavItem>
        {(system_user_role !== 3 && system_user_role !== 4) && (
          <CHeaderNavItem className="px-3">
            <CHeaderNavLink to="/assetSearch">
              <CIcon className="pr-1" size={'lg'} name="cil-file" alt="Asset Library" />Asset Library</CHeaderNavLink>
          </CHeaderNavItem>
        )}
        {(system_user_role !== 3 && system_user_role !== 4) && (
          <CHeaderNavItem className="px-3">
            <CHeaderNavLink to="/renderJobs">
              <CIcon className="pr-1" size={'lg'} content={freeSet.cilFire} alt="Afterburner" />Afterburner</CHeaderNavLink>
          </CHeaderNavItem>
        )}
        {(system_user_role !== 3 && system_user_role !== 4) && (
          <CHeaderNavItem className="px-3">
            <CHeaderNavLink to="/activeUsers">
              <CIcon className="pr-1" size={'lg'} name="cil-people" alt="Users" />Users</CHeaderNavLink>
          </CHeaderNavItem>
        )}
      </CHeaderNav>

      <CHeaderNav className="ml-auto px-3">
        <CHeaderNavItem className="px-1 pt-1">
          <CButton className="mr-1" onClick={() => { setModal(!modal) }}>
            <CIcon className="pr-1 pb-1" size={'lg'} name="cil-user" alt="avatar" />
            {user}</CButton>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-1 pt-1">
          <CButton type="submit" block onClick={logoutHandler}>
            <CIcon className="pr-1 pb-1" size={'lg'} content={freeSet.cilAccountLogout} alt="Logout" />
            Logout</CButton>
        </CHeaderNavItem>
      </CHeaderNav>

      <CSubheader className="px-3 justify-content-between">
        <CBreadcrumb className="border-0 c-subheader-nav m-0 px-0 px-md-3">
          {currentModule !== "Dashboard" && <CBreadcrumbItem>{currentModule}</CBreadcrumbItem>}
          {/* Prev Page Sub Header */}
          {(location.pathname === "/projectOverview" || location.pathname === "/renderJobs/renderFrames") &&
            <CBreadcrumbItem>
              <CLink onClick={() => history.goBack()}>
                {routes.map(nav => {
                  if (nav.path === prevPage) {
                    return nav.name
                  }
                })}
              </CLink>
            </CBreadcrumbItem>}

          <CBreadcrumbItem>
            <CLink onClick={() => history.go(0)}>
              {routes.map(nav => {
                if (nav.path === location.pathname) {
                  {/* Render Frames Sub Header */ }
                  if (location.pathname === "/renderJobs/renderFrames") {
                    return nav.name + " " + job_id + ": " + job_name
                  }
                  if (location.pathname === "/projectOverview") {
                    return nav.name + ": " + project_name
                  }
                  return nav.name
                }
              })}
            </CLink>
          </CBreadcrumbItem>
        </CBreadcrumb>
      </CSubheader>

      {/* My Profile Pop Up Form */}
      <MyProfile
        showModal={modal}
        onShow={() => setModal(!modal)}
        token={token}
        user={user}
        data={data} />
    </CHeader>
  )
}

export default TheHeader