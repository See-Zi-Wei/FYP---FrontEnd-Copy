import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCardText,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputCheckbox,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CLabel,
  CRow,
} from '@coreui/react';
import CIcon from "@coreui/icons-react";
import Cookies from "universal-cookie";
import { useHistory } from 'react-router-dom';
import configData from "../../../config.json";

const Login = () => {

  const history = useHistory();
  const cookies = new Cookies();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setVisibility] = useState("invisible");
  const [loginError, setLoginError] = useState("");

  const loginHandler = (e) => {
    let expire = new Date();
    expire.setTime(expire.getTime() + 7 * 24 * 60 * 60 * 1000);

    setVisibility("invisible");
    setLoginError("");
    e.preventDefault();

    const data = { username, password }
    fetch(configData.API_URL + "/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "accept": "application/json"
      },
      body: JSON.stringify(data),
      credentials: "include"
    }).then(response => {
      return response.json()
    }).then(body => {
      console.log(body);
      if (body.result === "Fail") {
        setLoginError("Invalid username and password");
        setVisibility("text-danger visible");
      } else {
        if (document.getElementById("check-box").checked === true) {
          expire.setTime(expire.getTime() + 23 * 24 * 60 * 60 * 1000);
        }
        body = { ...body, expire }
        cookies.set("data", body, { path: "/", expires: expire });
        history.push("/");
      }
    }).catch(error => {
      console.log(error);
    })
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard>
                <CCardBody className='d-flex align-items-center justify-content-center'>
                  <img src="/omens_logo.png" alt='omen_logo' className="img-fluid" />
                </CCardBody>
              </CCard>
              <CCard className="p-4 bg-secondary">
                <CCardBody className='text-center'>
                  <CForm onSubmit={loginHandler}>
                    <h1>Login</h1>
                    <p className='text-muted'>Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText className='bg-white text-dark border-right-0'>
                          <CIcon name='cil-user' />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="username"
                        placeholder="Enter Username"
                        autoComplete="username"
                        className='border-left-0'
                        onChange={(e) => setUsername(e.target.value)} />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText className='bg-white text-dark border-right-0'>
                          <CIcon name='cil-lock-locked' />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="password"
                        placeholder="Enter Password"
                        autoComplete="current-password"
                        className='border-left-0'
                        onChange={(e) => setPassword(e.target.value)} />
                    </CInputGroup>
                    <CRow>
                      <CCol>
                        <CInputGroup className='form-check mb-2'>
                          <CLabel className='form-check-label'>
                            <CInputCheckbox id="check-box" />Remember Me</CLabel>
                        </CInputGroup>
                      </CCol>
                    </CRow>
                    <CButton type="submit" color="primary" block>Login</CButton>
                    <CCardText className={isVisible + " mt-2"}>{loginError}</CCardText>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}
export default Login