import React from 'react'
import Cookies from "universal-cookie";
import {
  CSpinner
} from '@coreui/react'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import Moment from 'moment';

import configData from "../../config.json";
import _nav from '../../containers/_nav'
import UserList from './UserList'

const InactiveUsers = () => {

  const dispatch = useDispatch()
  dispatch({ type: 'set', currentSidebar: _nav.Users });
  dispatch({ type: 'set', currentModule: 'Users' });

  const [isLoaderVisible, setLoaderVisibility] = useState("d-none");

  const history = useHistory();
  const cookies = new Cookies();
  const data = cookies.get('data')
  var token, user, system_user_role;
  if (data === undefined) {
    history.push("/login")
  } else {
    token = data["token"]
    user = data["username"]
    system_user_role = data["user_role"]
  }

  // Check for access right to prevent user by typing the url manually
  if (system_user_role === 3 || system_user_role === 4) history.push("/");

  const inactiveUsers = useSelector(state => state.inactiveUsers)

  useEffect(() => {
    getUsers();
  }, [])

  // GET all inactive users
  const getUsers = () => {
    setLoaderVisibility("");
    fetch(configData.API_URL + "/users/0", {
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
      setLoaderVisibility("d-none");
      if (body.detail === "Forbidden") {
        cookies.remove("data");
        history.push("/login")
      }
      handleIndexValues(body);
    }).catch(error => {
      setLoaderVisibility("d-none");
      console.log(error);
    })
  }

  const handleIndexValues = (body) => {
    const data = body;
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      switch (element.user_role) {
        case 0:
          element.user_role = "Admin"
          break;
        case 1:
          element.user_role = "Manager"
          break;
        case 2:
          element.user_role = "Artist"
          break;
        case 3:
          element.user_role = "Vendor"
          break;
        case 4:
          element.user_role = "Client"
          break;
      }
      switch (element.department) {
        case 0:
          element.department = "Operations"
          break;
        case 1:
          element.department = "Production Management"
          break;
        case 2:
          element.department = "Directing"
          break;
        case 3:
          element.department = "Art and Design"
          break;
        case 4:
          element.department = "Modeling and Texturing"
          break;
        case 5:
          element.department = "Technical Directing"
          break;
        case 6:
          element.department = "Animation"
          break;
        case 7:
          element.department = "Lighting and Comp"
          break;
        case 8:
          element.department = "Visual Effects"
          break;
      }
      switch (element.location) {
        case 0:
          element.location = "SG"
          break;
        case 1:
          element.location = "KL"
          break;
        case 2:
          element.location = "BG"
          break;
      }
      if (element.last_login_time === "" && element.last_login_ip === null) {
        element.last_login_time = "-"
        element.last_login_ip = "-"
      } else {
        element.last_login_time = Moment(element.last_login_time)
          .format("DD-MMM-YY HH:mm")
      }
    }
    dispatch({ type: 'set', inactiveUsers: data })
  }

  return (
    <>
      <div className={isLoaderVisible + " float-left ml-4 mt-3 mb-n1"}>
        <CSpinner color="info" grow />
      </div>
      <UserList usersData={inactiveUsers} getUsers={() => getUsers()}></UserList>
    </>
  )
}

export default InactiveUsers