import React from 'react'
import {
    CInput,
    CButton,
    CCol,
    CModal,
    CModalBody,
    CModalHeader,
    CModalTitle,
    CForm,
    CFormGroup,
    CTextarea,
    CLabel,
    CSelect,
    CSwitch,
    CAlert,
    CSpinner,
    CImg
} from '@coreui/react'
import { useHistory } from "react-router-dom";
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "universal-cookie";
import configData from "../../config.json";

const UpdateUser = ({ showModal, onShow, token, user, data, userData }) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const cookies = new Cookies();
    const activeUsers = useSelector(state => state.activeUsers)
    const inactiveUsers = useSelector(state => state.inactiveUsers)

    const [isVisible, setVisibility] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoaderVisible, setLoaderVisibility] = useState("d-none");

    const [user_id, setId] = useState(userData.user_id);
    const [username, setUserName] = useState(userData.username);
    const [full_name, setFullName] = useState(userData.full_name);
    const [email, setEmail] = useState(userData.email);
    const [user_role, setUserRole] = useState(userData.user_role);
    const [job_title, setJobTitle] = useState(userData.job_title);
    const [department, setDepartment] = useState(userData.department);
    const [location, setLocation] = useState(userData.location);
    const [status, setStatus] = useState(userData.status);
    const [description, setDescription] = useState(userData.description);
    const [picture, setPicture] = useState(userData.picture);
    var loginID, expire;
    if (data === undefined) {
        history.push("/login")
    } else {
        loginID = data['user_id'];
        expire = new Date(data['expire']);
    }

    useEffect(() => {
        setId(userData.user_id);
        setUserName(userData.username);
        setFullName(userData.full_name);
        setEmail(userData.email);
        setUserRole(userData.user_role);
        setJobTitle(userData.job_title);
        setDepartment(userData.department);
        setLocation(userData.location);
        setStatus(userData.status);
        setDescription(userData.description);
        setPicture(userData.picture);
    }, [userData])

    const onUpdateUser = (e) => {
        e.preventDefault();
        setVisibility(false);

        if (!full_name || !email || !job_title || !description) {
            setErrorMsg("Please fill in mandatory fields.");
            setVisibility(true);
            // if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
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
            var data = { username, full_name, email, job_title, department, location, description, user_role, status }
            setLoaderVisibility("");
            fetch(configData.API_URL + "/user/" + user_id, {
                method: "PUT",
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
                    if (loginID === user_id) {
                        data = { ...data, picture, user_id, token, expire };
                        cookies.set("data", data, { path: "/", expires: expire });
                    }
                    switch (data.user_role) {
                        case 0:
                            data.user_role = "Admin"
                            break;
                        case 1:
                            data.user_role = "Manager"
                            break;
                        case 2:
                            data.user_role = "Artist"
                            break;
                        case 3:
                            data.user_role = "Vendor"
                            break;
                        case 4:
                            data.user_role = "Client"
                            break;
                    }
                    switch (data.department) {
                        case 0:
                            data.department = "Operations"
                            break;
                        case 1:
                            data.department = "Production Management"
                            break;
                        case 2:
                            data.department = "Directing"
                            break;
                        case 3:
                            data.department = "Art and Design"
                            break;
                        case 4:
                            data.department = "Modeling and Texturing"
                            break;
                        case 5:
                            data.department = "Technical Directing"
                            break;
                        case 6:
                            data.department = "Animation"
                            break;
                        case 7:
                            data.department = "Lighting and Comp"
                            break;
                        case 8:
                            data.department = "Visual Effects"
                            break;
                    }
                    switch (data.location) {
                        case 0:
                            data.location = "SG"
                            break;
                        case 1:
                            data.location = "KL"
                            break;
                        case 2:
                            data.location = "BG"
                            break;
                    }
                    if (status === 1) {
                        if (status !== userData.status) {
                            inactiveUsers.map((user, index) => {
                                if (user.user_id === user_id) {
                                    inactiveUsers.splice(index, 1)
                                }
                            })
                            dispatch({
                                type: 'set', inactiveUsers: inactiveUsers.map((user) => {
                                    return user // dont know why isit needed but MUST HAVE!!!
                                })
                            })
                        } else {
                            dispatch({
                                type: 'set', activeUsers: (
                                    activeUsers.map((user) => {
                                        if (user.user_id === user_id) {
                                            return {
                                                ...user,
                                                full_name: data.full_name,
                                                email: data.email,
                                                job_title: data.job_title,
                                                department: data.department,
                                                location: data.location,
                                                description: data.description,
                                                user_role: data.user_role,
                                                status: data.status,
                                            }
                                        } else {
                                            return user
                                        }
                                    })
                                )
                            })
                        }
                    } else {
                        if (status !== userData.status) {
                            activeUsers.map((user, index) => {
                                if (user.user_id === user_id) {
                                    activeUsers.splice(index, 1)
                                }
                            })
                            dispatch({
                                type: 'set', activeUsers: activeUsers.map((user) => {
                                    return user // dont know why isit needed but MUST HAVE!!!
                                })
                            })
                        } else {
                            dispatch({
                                type: 'set', inactiveUsers: (
                                    inactiveUsers.map((user) => {
                                        if (user.user_id === user_id) {
                                            return {
                                                ...user,
                                                full_name: data.full_name,
                                                email: data.email,
                                                job_title: data.job_title,
                                                department: data.department,
                                                location: data.location,
                                                description: data.description,
                                                user_role: data.user_role,
                                                status: data.status,
                                            }
                                        } else {
                                            return user
                                        }
                                    })
                                )
                            })
                        }
                    }
                    onShow()
                }
            }).catch(error => {
                setLoaderVisibility("d-none");
                console.log(error);
            })
        }
    }

    const resetPassword = (e) => {
        e.preventDefault();
        setVisibility(false);
        setLoaderVisibility("");

        fetch(configData.API_URL + "/user_password_reset/" + user_id, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                "accept": "application/json",
                "Authorization": "Basic " + btoa(user + ":" + token)
            }
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
                onShow()
            }
        }).catch(error => {
            setLoaderVisibility("d-none");
            console.log(error);
        })
    }

    return (
        <CModal
            show={showModal}
            onClose={() => {
                onShow()
                setVisibility(false);
                setLoaderVisibility("d-none");
            }} >
            <CModalHeader closeButton>
                <CModalTitle>Update User</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm action="" method="post" encType="multipart/form-data" className="form-horizontal" className="container">
                    <CCol className="d-flex justify-content-center">
                        <CImg src={configData.File_URL + picture} alt="pic"
                            shape="rounded-circle" height="100" width="100" className="mb-2 p-1 shadow" />
                    </CCol>
                    <CCol className="d-flex justify-content-center">
                        <p className="mx-auto">{username}</p>
                    </CCol>
                    <CFormGroup className="row">
                        <CLabel className="col-md-4 mt-2">Full Name *</CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0"
                            placeholder="Enter your full name"
                            value={full_name}
                            onChange={(e) => (setFullName(e.target.value))} />
                    </CFormGroup>
                    <CFormGroup className="row">
                        <CLabel className="col-md-4 mt-2">Email *</CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0 mb-1"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => (setEmail(e.target.value))} />
                    </CFormGroup>
                    <CFormGroup className="row">
                        <CLabel className="col-md-4 mt-2">User Role</CLabel>
                        <CSelect custom name="select" id="select"
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0 mb-1"
                            value={user_role}
                            onChange={(e) => (setUserRole(parseInt(e.target.value)))}>
                            <option value="0">System Administrator</option>
                            <option value="1">Manager</option>
                            <option value="2">Artist</option>
                            <option value="3">Vendor</option>
                            <option value="4">Client</option>
                        </CSelect>
                    </CFormGroup>
                    <CFormGroup className="row">
                        <CLabel className="col-md-4 mt-2">Job Title *</CLabel>
                        <CInput
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0 mb-1"
                            placeholder="Enter your job title"
                            value={job_title}
                            onChange={(e) => (setJobTitle(e.target.value))} />
                    </CFormGroup>
                    <CFormGroup className="row">
                        <CLabel className="col-md-4 mt-2">Department</CLabel>
                        <CSelect custom name="select" id="select"
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0 mb-1"
                            value={department}
                            onChange={(e) => (setDepartment(parseInt(e.target.value)))}>
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
                    <CFormGroup className="row">
                        <CLabel className="col-md-4 mt-2">Office Location</CLabel>
                        <CSelect custom name="select" id="select"
                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0 mb-2"
                            value={location}
                            onChange={(e) => (setLocation(parseInt(e.target.value)))}>
                            <option value="0">Singapore</option>
                            <option value="1">Kuala Lumpur</option>
                            <option value="2">Bangalore</option>
                        </CSelect>
                    </CFormGroup>
                    <CFormGroup className="row">
                        <CLabel className="col-md-4 mt-1">Status </CLabel>
                        <div className="col-md-8">
                            <CSwitch shape={'pill'} color={'info'} labelOn={'\u2713'} labelOff={'\u2715'}
                                checked={status}
                                onChange={(e) => { if (e.currentTarget.checked) setStatus(1); else setStatus(0) }} />
                        </div>
                    </CFormGroup>
                    <CFormGroup className="row">
                        <CLabel htmlFor="textarea-input" className="col-md-4 mt-2">Description *</CLabel>
                        <CTextarea
                            name="textarea-input"
                            id="textarea-input"
                            rows="3"
                            placeholder="Enter your description..."
                            value={description}
                            className="col-md-8"
                            onChange={(e) => (setDescription(e.target.value))}
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
                        <CButton color="danger" className="mr-2" onClick={resetPassword}>Reset Password</CButton>
                        <CButton color="info" onClick={onUpdateUser}>Update User</CButton>
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

export default UpdateUser