import React, { useState } from 'react'
import {
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormGroup,
  CTextarea,
  CInput,
  CLabel,
  CSelect,
  CSwitch,
  CAlert,
  CSpinner
} from '@coreui/react'
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import configData from "../../config.json";

const CreateUser = ({ showModal, onShow, token, user }) => {

  const history = useHistory();
  const cookies = new Cookies();

  const [isVisible, setVisibility] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoaderVisible, setLoaderVisibility] = useState("d-none");

  const [username, setUsername] = useState('');
  const [full_name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [user_role, setUserRole] = useState(0);
  const [job_title, setJobTitle] = useState('');
  const [department, setDepartment] = useState(0);
  const [location, setLocation] = useState(0);
  const [status, setStatus] = useState(1);
  const [description, setDescription] = useState('');

  const onCreate = (e) => {
    e.preventDefault();
    setVisibility(false);

    if (!username || !full_name || !email || !job_title || !description) {
      setErrorMsg("Please fill in mandatory fields.");
      setVisibility(true);
    } else if (username.length <= 5) {
      setErrorMsg("Username must be more than 5 characters.");
      setVisibility(true);
    } else if (full_name.length <= 5) {
      setErrorMsg("Full name must be more than 5 characters.");
      setVisibility(true);
    } else if (/^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(email) == false) {
      setErrorMsg("Invalid email address.");
      setVisibility(true);
    } else if (description.length >= 512) {
      setErrorMsg("Description too long.");
      setVisibility(true);
    } else {
      const data = { username, full_name, email, job_title, department, location, description, user_role, status }
      setLoaderVisibility("");
      fetch(configData.API_URL + "/user", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "accept": "application/json",
          "Authorization": "Basic " + btoa(user + ":" + token)
        },
        body: JSON.stringify(data)
      }).then(response => {
        return response.json()
      }).then(body => {
        console.log(body);
        setLoaderVisibility("d-none");
        if (body.detail === "Forbidden") {
          cookies.remove("data");
          history.push("/login")
        } else if (body.result !== "Success") {
          setErrorMsg(body.result);
          setVisibility(true);
        } else {
          setUsername('');
          setFullName('')
          setEmail('')
          setUserRole(0);
          setJobTitle('');
          setDepartment(0);
          setLocation(0);
          setStatus(1)
          setDescription('');
          onShow();
          history.push("/dashboard")
          history.goBack()
        }
      }).catch(error => {
        setLoaderVisibility("d-none");
        console.log(error);
      })
    }
  }

  return (
    <CModal
      show={showModal}
      className="text-dark"
      onClose={() => {
        onShow()
        setVisibility(false);
        setLoaderVisibility("d-none");
      }}>
      <CModalHeader closeButton>
        <CModalTitle>Create New User</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm action="" method="post" encType="multipart/form-data"
          className="form-horizontal" className="container" onSubmit={onCreate}>
          <CFormGroup className="row mt-n2">
            <CLabel htmlFor="company" className="col-md-4 mt-2"> Username *</CLabel>
            <CInput
              className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
              value={username}
              onChange={(e) => setUsername(e.target.value)} />
          </CFormGroup>
          <CFormGroup className="row mt-n2">
            <CLabel htmlFor="company" className="col-md-4 mt-2">Full Name *</CLabel>
            <CInput
              className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
              value={full_name}
              onChange={(e) => setFullName(e.target.value)} />
          </CFormGroup>
          <CFormGroup className="row mt-n2">
            <CLabel htmlFor="company" className="col-md-4 mt-2">Email *</CLabel>
            <CInput
              className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0 mb-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </CFormGroup>
          <CFormGroup className="row mt-n2">
            <CLabel htmlFor="company" className="col-md-4 mt-2">User Role</CLabel>
            <CSelect custom name="select" id="select"
              className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0 mb-1"
              value={user_role}
              onChange={(e) => setUserRole(parseInt(e.target.value))}>
              <option value="0">System Administrator</option>
              <option value="1">Manager</option>
              <option value="2">Artist</option>
              <option value="3">Vendor</option>
              <option value="4">Client</option>
            </CSelect>
          </CFormGroup>
          <CFormGroup className="row mt-n2">
            <CLabel className="col-md-4 mt-2">Job Title *</CLabel>
            <CInput
              className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0 mb-1"
              value={job_title}
              onChange={(e) => setJobTitle(e.target.value)} />
          </CFormGroup>
          <CFormGroup className="row mt-n2">
            <CLabel className="col-md-4 mt-2">Department</CLabel>
            <CSelect custom name="select" id="select"
              className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0 mb-1"
              value={department}
              onChange={(e) => setDepartment(parseInt(e.target.value))}>
              <option value="0">Operations</option>
              <option value="1">Production Management</option>
              <option value="2">Directing</option>
              <option value="3">Art and Design</option>
              <option value="4">Modeling and Texturing</option>
              <option value="5">Technical Directing</option>
              <option value="6">Animation</option>
              <option value="7">Lighting and Comp</option>
              <option value="8">Visual Effects</option>
            </CSelect>
          </CFormGroup>
          <CFormGroup className="row mt-n2">
            <CLabel className="col-md-4 mt-2">Office Location</CLabel>
            <CSelect custom name="select" id="select"
              className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0 mb-2"
              value={location}
              onChange={(e) => setLocation(parseInt(e.target.value))}>
              <option value="0">Singapore</option>
              <option value="1">Kuala Lumpur</option>
              <option value="2">Bangalore</option>
            </CSelect>
          </CFormGroup>
          <CFormGroup className="row mt-n2">
            <CLabel className="col-md-4 mt-1">Status </CLabel>
            <div className="col-md-8">
              <CSwitch shape={'pill'} color={'info'} labelOn={'\u2713'} labelOff={'\u2715'}
                checked={status}
                onChange={(e) => { if (e.currentTarget.checked) setStatus(1); else setStatus(0) }} />
            </div>
          </CFormGroup>
          <CFormGroup className="row mt-n2">
            <CLabel className="col-md-4 mt-2">Description *</CLabel>
            <CTextarea
              name="textarea-input"
              id="textarea-input"
              rows="3"
              className="col-md-8 "
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </CFormGroup>
          <CFormGroup className="d-flex justify-content-center mt-4">
            <CButton
              color="secondary"
              className="mr-2"
              onClick={() => {
                onShow()
                setVisibility(false);
                setLoaderVisibility("d-none");
              }}
            >Cancel</CButton>
            <CButton color="info" type="submit">Create User</CButton>
            <div className={isLoaderVisible + " mt-1 ml-2"}>
              <CSpinner color="info" size="sm" grow />
            </div>
          </CFormGroup>
          <CAlert show={isVisible} color="danger">{errorMsg}</CAlert>
        </CForm>
      </CModalBody>
    </CModal>
  )
}

export default CreateUser