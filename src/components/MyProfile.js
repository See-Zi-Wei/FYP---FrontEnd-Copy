import React from 'react'
import { useState, useEffect, useMemo } from "react";
import Cookies from "universal-cookie";
import {
    CCol,
    CModalBody,
    CModalHeader,
    CModalTitle,
    CRow,
    CTabContent,
    CNavLink,
    CNavItem,
    CTabPane,
    CNav,
    CTabs,
    CForm,
    CFormGroup,
    CTextarea,
    CModal,
    CButton,
    CInput,
    CLabel,
    CAlert,
    CSpinner,
    CImg
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { useHistory } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import configData from "../config.json";

const MyProfile = ({ showModal, onShow, token, user, data }) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const cookies = new Cookies();
    const activeUsers = useSelector(state => state.activeUsers)

    const [isVisible, setVisibility] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoaderVisible, setLoaderVisibility] = useState("d-none");

    if (data === undefined) history.go(0);

    const user_id = data['user_id'];
    const username = data['username'];
    const [user_role, setUserRole] = useState(data['user_role']);
    const [department, setDepartment] = useState(data['department']);
    const [location, setLocation] = useState(data['location']);
    const [full_name, setFullName] = useState(data['full_name']);
    const [email, setEmail] = useState(data['email']);
    const [job_title, setJobTitle] = useState(data['job_title']);
    const [description, setDescription] = useState(data['description']);
    const [picture, setPicture] = useState(data['picture']);
    const status = data['status'];
    const expire = new Date(data['expire']);

    const [password_cur, setPassword_cur] = useState('');
    const [password_new, setPassword_new] = useState('');
    const [password_cfm, setPassword_cfm] = useState('');

    useEffect(() => {
        setFullName(data['full_name']);
        setEmail(data['email']);
        setUserRole(data['user_role']);
        setJobTitle(data['job_title']);
        setDepartment(data['department']);
        setLocation(data['location']);
        setDescription(data['description']);
        setPicture(data['picture']);
    }, [data])

    // For dropzone file upload
    const [placeHolder, setPlaceHolder] = useState(true)
    const [files, setFiles] = useState([]);
    const [fileMessage, setFileMessage] = useState(false);

    const baseStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '3px',
        borderWidth: 2,
        borderRadius: 2,
        borderColor: '#3399ff',
        borderStyle: 'dashed',
        color: '#3399ff',
        outline: 'none',
        transition: 'border .24s ease-in-out',
        minWidth: '292px'
    };

    const activeStyle = {
        borderColor: '#3399ff',
        borderStyle: 'solid',
    };

    const acceptStyle = {
        borderColor: '#3399ff',
        borderStyle: 'solid',
    };

    const rejectStyle = {
        borderColor: '#e55353'
    };

    const thumbsContainer = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16
    };

    const thumb = {
        display: 'inline-flex',
        borderRadius: 2,
        border: '1px solid #eaeaea',
        marginRight: 8,
        width: 100,
        height: 100,
        padding: 4,
        boxSizing: 'border-box'
    };

    const thumbInner = {
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden'
    };

    const img = {
        display: 'block',
        width: 'auto',
        height: '100%'
    };

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        acceptedFiles,
        fileRejections
    } = useDropzone({
        accept: 'image/png, image/jpg, image/jpeg, ', multiple: false, maxFiles: 1, maxSize: 1048576,
        // onDrop is called when an image is given
        onDrop: acceptedFiles => {
            // Show the image once successfully drop
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
            setFileMessage(true);
        },
        onDropAccepted: acceptedFiles => {
            setPlaceHolder(false)
            var formData = new FormData();
            acceptedFiles.forEach(file => {
                formData.append('f', file);
            })
            fetch(configData.API_URL + "/upload_file", {
                method: "POST",
                headers: {
                    "Authorization": "Basic " + btoa(user + ":" + token)
                },
                body: formData
            }).then(response => {
                return response.json()
            }).then(body => {
                console.log(body);
                if (body.detail === "Forbidden") {
                    cookies.remove("data");
                    history.push("/login");
                } else {
                    setPicture(body.result)
                }
            }).catch(error => {
                console.log(error);
            })
        },
        onDropRejected: () => {
            setPlaceHolder(true)
        },
    });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    // Image
    const thumbs = files.map(file => (
        <div style={thumb} key={file.name}>
            <div style={thumbInner}>
                <img
                    src={file.preview}
                    style={img}
                />
            </div>
        </div>
    ));

    // Accepted File Message
    const fileAcceptedItems = acceptedFiles.map(file => (
        <li key={file.path}>
            Img - {file.size} bytes
        </li>
    ));

    // Rejected File Message (larger than 1mb)
    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li key={file.path}>
            Img - {file.size} bytes
            <ul>
                {errors.map(e => (
                    <li key={e.code} className="text-danger">{e.message}</li>
                ))}
            </ul>
        </li>
    ));

    const onUpdate = (e) => {
        e.preventDefault();
        setVisibility(false);

        if (!full_name || !email || !job_title || !description) {
            setErrorMsg("Please fill in mandatory fields.");
            setVisibility(true);
        } else if (full_name.length <= 5) {
            setErrorMsg("Full name must be more than 5 characters.");
            setVisibility(true);
        } else if (/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(email) === false) {
            setErrorMsg("Invalid email address.");
            setVisibility(true);
        } else if (description.length >= 512) {
            setErrorMsg("Description too long.");
            setVisibility(true);
        } else {
            var data = { username, full_name, email, job_title, department, location, description, user_role, status, picture }
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
                    data = { ...data, user_id, token, expire };
                    cookies.set("data", data, { path: "/", expires: expire });
                    dispatch({
                        type: 'set', activeUsers: (
                            activeUsers.map((user) => {
                                if (user.user_id === user_id) {
                                    return {
                                        ...user,
                                        full_name: data.full_name,
                                        email: data.email,
                                        job_title: data.job_title,
                                        description: data.description,
                                        picture: data.picture,
                                    }
                                } else {
                                    return user
                                }
                            })
                        )
                    })
                    onShow();
                    resetForm();
                }
            }).catch(error => {
                setLoaderVisibility("d-none");
                console.log(error);
            })
        }
    }

    const changePwd = (e) => {
        e.preventDefault();
        setVisibility(false);

        if (password_new.length <= 5 || password_cfm.length <= 5) {
            setErrorMsg("Password must be more than 5 characters.");
            setVisibility(true);
        } else if (password_new !== password_cfm) {
            setErrorMsg("New Password and Confirm Password Unmatched.");
            setVisibility(true);
        } else {
            const data = { password_cur, password_new }
            setLoaderVisibility("");
            fetch(configData.API_URL + "/user_password/" + user_id, {
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
                } else if (body.result === "Wrong password") {
                    setErrorMsg("Wrong password.");
                    setVisibility(true);
                } else if (body.result === "Success") {
                    onShow();
                    resetForm();
                }
            }).catch(error => {
                setLoaderVisibility("d-none");
                console.log(error);
            })
        }
    }

    function resetForm() {
        setFullName(data['full_name'])
        setEmail(data['email'])
        setJobTitle(data['job_title']);
        setDescription(data['description']);
        setUserRole(data['user_role']);
        setDepartment(data['department']);
        setLocation(data['location']);
        setPicture(data['picture']);
        setPassword_cur('');
        setPassword_new('');
        setPassword_cfm('');
        setPlaceHolder(true);
        setFiles([]);
        setFileMessage(false);
        setVisibility(false);
        setLoaderVisibility("d-none");
    }

    return (
        <CModal
            show={showModal}
            onClose={() => {
                onShow()
                resetForm()
            }}>
            <CModalHeader closeButton>
                <CModalTitle>My Profile</CModalTitle>
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
                    <CRow className="d-flex justify-content-center">
                        <p><CIcon className="mb-1 mr-1" content={freeSet.cilInfo} />
                            {user_role === 0 && 'System Administrator'}
                            {user_role === 1 && 'Manager'}
                            {user_role === 2 && 'Artist'}
                            {user_role === 3 && 'Vendor'}
                            {user_role === 4 && 'Client'}</p>

                        <p className="mx-3"><CIcon className="mb-1 mr-1" content={freeSet.cilPeople} />
                            {department === 0 && 'Operations'}
                            {department === 1 && 'Production Management'}
                            {department === 2 && 'Directing'}
                            {department === 3 && 'Art and Design'}
                            {department === 4 && 'Modeling and Texturing'}
                            {department === 5 && 'Technical Directing'}
                            {department === 6 && 'Animation'}
                            {department === 7 && 'Lighting and Comp'}
                            {department === 8 && 'Visual Effects'}</p>

                        <p><CIcon className="mb-1 mr-1" content={freeSet.cilLocationPin} />
                            {location === 0 && 'Singapore'}
                            {location === 1 && 'Kuala Lumpur'}
                            {location === 2 && 'Bangalore'}</p>
                    </CRow>

                    {/* Tabs for Profile and Change Password */}
                    <CTabs activeTab="profile">
                        <CNav variant="tabs" className="mb-4">
                            <CNavItem>
                                <CNavLink data-tab="profile">Profile </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink data-tab="changePassword"> Change Password</CNavLink>
                            </CNavItem>
                        </CNav>
                        <CTabContent>
                            <CTabPane data-tab="profile">
                                <CForm action="" method="put" encType="multipart/form-data" className="form-horizontal" className="container">
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
                                        <CLabel className="col-md-4 mt-2">Job Title *</CLabel>
                                        <CInput
                                            className="col-md-8 border-top-0 border-left-0 border-right-0 rounded-0 mb-2"
                                            placeholder="Enter your job title"
                                            value={job_title}
                                            onChange={(e) => (setJobTitle(e.target.value))} />
                                    </CFormGroup>
                                    <CFormGroup className="row">
                                        <CLabel htmlFor="textarea-input" className="col-md-4 mt-1">Description *</CLabel>
                                        <CTextarea
                                            name="textarea-input"
                                            id="textarea-input"
                                            rows="3"
                                            placeholder="Enter your description..."
                                            value={description}
                                            className="col-md-8 mb-2"
                                            onChange={(e) => (setDescription(e.target.value))} />
                                    </CFormGroup>
                                    <CFormGroup className="row">
                                        <CLabel htmlFor="company" className="col-md-4 mt-2">Picture (Ratio 1:1, max 1mb)</CLabel>
                                        {/* DropZone */}
                                        <div className="col-md-8 ml-md-n3">
                                            <div {...getRootProps({ style })}>
                                                <input {...getInputProps()} />
                                                {placeHolder && <CIcon className="mt-3" content={freeSet.cilCloudUpload} size={'2xl'} />}
                                                {placeHolder && <p show={placeHolder.toString()}>Drop files here to upload</p>}
                                                {/* Image */}
                                                {thumbs}
                                            </div>
                                            {fileMessage &&
                                                <aside style={thumbsContainer}>
                                                    {/* Messages */}
                                                    <ul>{fileAcceptedItems}</ul>
                                                    <ul>{fileRejectionItems}</ul>
                                                </aside>
                                            }
                                        </div>
                                    </CFormGroup>
                                    <CFormGroup className="d-flex justify-content-center mt-4">
                                        <CButton
                                            color="secondary"
                                            className="mr-2"
                                            onClick={() => {
                                                onShow()
                                                resetForm()
                                            }}>Cancel</CButton>
                                        <CButton color="info" onClick={onUpdate}>Update Profile</CButton>
                                        <div className={isLoaderVisible + " mt-1 ml-2"}>
                                            <CSpinner color="info" size="sm" grow />
                                        </div>
                                    </CFormGroup>
                                </CForm>
                            </CTabPane>
                            <CTabPane data-tab="changePassword">
                                <CForm className="container">
                                    <CFormGroup className="row">
                                        <CLabel className="col-md-5 mt-2">Current Password *</CLabel>
                                        <CInput
                                            type="password"
                                            className="col-md-7 border-top-0 border-left-0 border-right-0 rounded-0"
                                            value={password_cur}
                                            onChange={(e) => (setPassword_cur(e.target.value))} />
                                    </CFormGroup>
                                    <CFormGroup className="row">
                                        <CLabel className="col-md-5 mt-2">New Password *</CLabel>
                                        <CInput
                                            type="password"
                                            className="col-md-7 border-top-0 border-left-0 border-right-0 rounded-0"
                                            value={password_new}
                                            onChange={(e) => (setPassword_new(e.target.value))} />
                                    </CFormGroup>
                                    <CFormGroup className="row">
                                        <CLabel className="col-md-5 mt-2">Confirm Password *</CLabel>
                                        <CInput
                                            type="password"
                                            className="col-md-7 border-top-0 border-left-0 border-right-0 rounded-0"
                                            value={password_cfm}
                                            onChange={(e) => (setPassword_cfm(e.target.value))} />
                                    </CFormGroup>
                                    <CFormGroup className="d-flex justify-content-center mt-4">
                                        <CButton
                                            color="secondary"
                                            className="mr-2"
                                            onClick={() => {
                                                onShow()
                                                resetForm()
                                            }}>Cancel</CButton>
                                        <CButton color="danger" onClick={changePwd}>Change Password</CButton>
                                        <div className={isLoaderVisible + " mt-1 ml-2"}>
                                            <CSpinner color="info" size="sm" grow />
                                        </div>
                                    </CFormGroup>
                                </CForm>
                            </CTabPane>
                        </CTabContent>
                    </CTabs>
                    <CAlert show={isVisible} color="danger">{errorMsg}</CAlert>
                </CForm>
            </CModalBody>
        </CModal>
    )
}

export default MyProfile
