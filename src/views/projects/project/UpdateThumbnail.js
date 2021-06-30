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
import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';

import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import Cookies from "universal-cookie";
import configData from "../../../config.json";

const UpdateThumbnail = ({ showModal, onShow, token, user, data, setPictureState, onUpdateProject }) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const cookies = new Cookies();

    const [isLoaderVisible, setLoaderVisibility] = useState("d-none");

    const [picture, setPicture] = useState("");

    if (data === undefined) {
        history.push("/login")
    }

    // useEffect(() => {
    //     setPicture(userData.picture);
    // }, [userData])

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

    return (
        <CModal
            show={showModal}
            onClose={() => {
                onShow()
                setLoaderVisibility("d-none");
            }} >
            <CModalHeader closeButton>
                <CModalTitle>Update Thumbnail</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm action="" method="post" encType="multipart/form-data" className="form-horizontal" className="container">
                    <CFormGroup className="row">
                        <CLabel htmlFor="company" className="col-md-4 mt-2">Picture (Ratio 16:9, max 1mb)</CLabel>
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
                                setLoaderVisibility("d-none");
                            }}
                        >Cancel</CButton>
                        <CButton color="info" onClick={setPictureState(picture), onUpdateProject}>Update Thumbnail</CButton>
                        <div className={isLoaderVisible + " mt-1 ml-2"}>
                            <CSpinner color="info" size="sm" grow />
                        </div>
                    </CFormGroup>
                </CForm>
            </CModalBody>
        </CModal>
    )
}

export default UpdateThumbnail